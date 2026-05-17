const API_BASE = "/api";

export async function cmsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function scopeQuery(scope?: "admin" | "preview"): string {
  if (scope === "admin") return "?scope=admin";
  if (scope === "preview") return "?preview=1";
  return "";
}
