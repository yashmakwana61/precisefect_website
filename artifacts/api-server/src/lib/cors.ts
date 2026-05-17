import type { CorsOptions } from "cors";

function parseAllowedOrigins(): string[] {
  const raw = process.env.CORS_ORIGINS?.trim();
  if (!raw) return [];
  return raw.split(",").map((o) => o.trim()).filter(Boolean);
}

export function createCorsOptions(): CorsOptions {
  const allowed = parseAllowedOrigins();
  const isProd = process.env.NODE_ENV === "production";

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowed.length > 0) {
        callback(null, allowed.includes(origin));
        return;
      }

      if (!isProd) {
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
          callback(null, true);
          return;
        }
      }

      callback(null, false);
    },
  };
}
