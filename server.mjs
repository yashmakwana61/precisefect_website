// Hostinger entrypoint (repo root). Sets defaults, then starts the bundled API + static site.
process.env.PORT ??= "3000";
process.env.BASE_PATH ??= "/";
process.env.NODE_ENV ??= "production";

await import("./artifacts/api-server/dist/index.mjs");
