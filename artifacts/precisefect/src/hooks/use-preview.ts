import { useSearch } from "wouter";

export function usePreviewMode(): boolean {
  const search = useSearch();
  return new URLSearchParams(search).get("preview") === "1";
}

export function withPreviewQuery(path: string, preview = true): string {
  if (!preview) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}preview=1`;
}
