-- Phase 3b: CRM tasks + lead scoring

DO $$ BEGIN
  CREATE TYPE "crm_task_status" AS ENUM('open', 'done', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "crm_task_type" AS ENUM('call', 'email', 'follow_up', 'custom');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "crm_tasks" (
  "id" serial PRIMARY KEY NOT NULL,
  "lead_id" integer NOT NULL REFERENCES "leads"("id") ON DELETE CASCADE,
  "assigned_to_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
  "created_by_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
  "title" text NOT NULL,
  "due_at" timestamptz,
  "completed_at" timestamptz,
  "type" "crm_task_type" DEFAULT 'follow_up' NOT NULL,
  "status" "crm_task_status" DEFAULT 'open' NOT NULL,
  "reminder_sent_at" timestamptz,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "crm_tasks_lead_idx" ON "crm_tasks" ("lead_id", "status");
CREATE INDEX IF NOT EXISTS "crm_tasks_due_idx" ON "crm_tasks" ("due_at", "status");
CREATE INDEX IF NOT EXISTS "crm_tasks_assigned_idx" ON "crm_tasks" ("assigned_to_id", "status");

ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "score" integer DEFAULT 0 NOT NULL;
ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "score_breakdown" jsonb DEFAULT '{}'::jsonb NOT NULL;

UPDATE "module_registry"
SET "is_enabled" = true, "label" = 'CRM', "config" = '{}'::jsonb, "updated_at" = now()
WHERE "key" = 'crm';
