const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
  "video/webm",
]);

const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".pdf",
  ".mp4",
  ".webm",
]);

export function isAllowedUpload(filename: string, mimeType: string): boolean {
  const ext = filename.includes(".")
    ? filename.slice(filename.lastIndexOf(".")).toLowerCase()
    : "";
  if (!ALLOWED_EXT.has(ext)) return false;
  if (!ALLOWED_MIME.has(mimeType.toLowerCase())) return false;
  return true;
}
