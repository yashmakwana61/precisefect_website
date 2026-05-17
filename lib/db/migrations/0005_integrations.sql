-- Phase 3c: external integrations

CREATE TABLE IF NOT EXISTS "integration_connections" (
  "id" serial PRIMARY KEY NOT NULL,
  "provider" text NOT NULL,
  "label" text NOT NULL,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "config" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "secrets_enc" text,
  "inbound_token" text UNIQUE,
  "created_by_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "integration_delivery_log" (
  "id" serial PRIMARY KEY NOT NULL,
  "connection_id" integer REFERENCES "integration_connections"("id") ON DELETE SET NULL,
  "direction" text NOT NULL,
  "event_type" text DEFAULT '' NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "http_status" integer,
  "error" text,
  "attempts" integer DEFAULT 1 NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "integration_delivery_connection_idx"
  ON "integration_delivery_log" ("connection_id", "created_at");
CREATE INDEX IF NOT EXISTS "integration_delivery_status_idx"
  ON "integration_delivery_log" ("status", "created_at");

INSERT INTO "module_registry" ("key", "label", "is_enabled", "config")
VALUES ('integrations', 'External Integrations', true, '{}'::jsonb)
ON CONFLICT ("key") DO UPDATE SET "is_enabled" = true, "updated_at" = now();
