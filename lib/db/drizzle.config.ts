import { defineConfig } from "drizzle-kit";
import path from "path";

const dbUrl = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    "Set DATABASE_URL, or DATABASE_DIRECT_URL for migrations (Supabase direct/session connection on port 5432 recommended for drizzle-kit push).",
  );
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
