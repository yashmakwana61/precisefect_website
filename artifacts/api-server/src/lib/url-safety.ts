import dns from "node:dns/promises";
import net from "node:net";
import { URL } from "node:url";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "metadata.google",
]);

function isPrivateOrReservedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (normalized === "::1") return true;
    if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
    if (normalized.startsWith("fe80")) return true;
  }
  return false;
}

export async function assertSafeOutboundUrl(urlStr: string): Promise<void> {
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    throw new Error("Invalid webhook URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Webhook URL must use HTTP or HTTPS");
  }

  if (url.username || url.password) {
    throw new Error("Webhook URL must not include credentials");
  }

  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("Webhook URL host is not allowed");
  }

  if (net.isIP(host) && isPrivateOrReservedIp(host)) {
    throw new Error("Webhook URL must not target private networks");
  }

  if (!net.isIP(host)) {
    const records = await dns.lookup(host, { all: true, verbatim: true });
    if (records.length === 0) {
      throw new Error("Webhook URL host could not be resolved");
    }
    for (const record of records) {
      if (isPrivateOrReservedIp(record.address)) {
        throw new Error("Webhook URL resolves to a private network address");
      }
    }
  }
}
