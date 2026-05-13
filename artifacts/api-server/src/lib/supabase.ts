import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for asset uploads.",
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "cms-assets";
}

export function getPublicAssetUrl(storagePath: string): string {
  const url = process.env.SUPABASE_URL;
  const bucket = getStorageBucket();
  if (!url) throw new Error("SUPABASE_URL must be set");
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${storagePath}`;
}
