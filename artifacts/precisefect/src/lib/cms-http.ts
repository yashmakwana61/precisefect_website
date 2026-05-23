const API_BASE = "/api";

type ZodIssue = { path?: Array<string | number>; message?: string; code?: string };

export function formatCmsApiError(status: number, body: string): string {
  try {
    const data = JSON.parse(body) as { error?: string; issues?: ZodIssue[] };
    if (data.issues?.length) {
      const lines = data.issues.map((issue) => {
        const field = issue.path?.length ? String(issue.path.at(-1)) : "field";
        return `${field}: ${issue.message ?? issue.code ?? "invalid"}`;
      });
      return lines.join("\n");
    }
    if (data.error) return data.error;
  } catch {
    // not JSON
  }
  return `${status}: ${body}`;
}

export async function cmsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(formatCmsApiError(res.status, text || res.statusText));
  }
  return res.json() as Promise<T>;
}

export function scopeQuery(scope?: "admin" | "preview"): string {
  if (scope === "admin") return "?scope=admin";
  if (scope === "preview") return "?preview=1";
  return "";
}
