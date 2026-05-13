const fs = require("fs");

for (const f of ["package-lock.json", "yarn.lock"]) {
  try {
    fs.unlinkSync(f);
  } catch {}
}

const execpath = process.env.npm_execpath || "";
const isPnpm =
  execpath.includes("pnpm") ||
  Boolean(process.env.PNPM_VERSION) ||
  Boolean(process.env.PNPM_HOME);

if (!isPnpm) {
  console.error("Use pnpm instead of npm/yarn (pnpm install).");
  process.exit(1);
}
