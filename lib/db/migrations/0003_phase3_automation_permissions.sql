-- Phase 3a: permissions + automation

CREATE TABLE IF NOT EXISTS "permissions" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" text NOT NULL UNIQUE,
  "label" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
  "role_id" integer NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "permission_id" integer NOT NULL REFERENCES "permissions"("id") ON DELETE CASCADE,
  PRIMARY KEY ("role_id", "permission_id")
);

CREATE TABLE IF NOT EXISTS "automation_rules" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "enabled" boolean DEFAULT true NOT NULL,
  "trigger_type" text DEFAULT 'event' NOT NULL,
  "trigger_event" text NOT NULL,
  "trigger_schedule" text,
  "conditions" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "actions" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "module_key" text DEFAULT 'leads' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "automation_rules_trigger_idx"
  ON "automation_rules" ("trigger_type", "trigger_event", "enabled");

CREATE TABLE IF NOT EXISTS "automation_runs" (
  "id" serial PRIMARY KEY NOT NULL,
  "rule_id" integer REFERENCES "automation_rules"("id") ON DELETE SET NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "trigger_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "error" text,
  "started_at" timestamptz DEFAULT now() NOT NULL,
  "finished_at" timestamptz
);

CREATE INDEX IF NOT EXISTS "automation_runs_rule_idx"
  ON "automation_runs" ("rule_id", "started_at");

INSERT INTO "module_registry" ("key", "label", "is_enabled", "config")
VALUES ('automation', 'Workflow Automation', true, '{}'::jsonb)
ON CONFLICT ("key") DO UPDATE SET "is_enabled" = true, "updated_at" = now();
