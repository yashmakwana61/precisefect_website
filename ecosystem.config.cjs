/** PM2 config for Hostinger VPS / Node hosting */
module.exports = {
  apps: [
    {
      name: "precisefect",
      cwd: __dirname,
      script: "artifacts/api-server/dist/index.mjs",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
      },
    },
  ],
};
