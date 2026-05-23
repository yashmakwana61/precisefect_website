-- Precisefect production: leads + CRM + permissions + automation + integrations
-- Run in Supabase SQL Editor on the SAME database as Hostinger DATABASE_URL.
-- Safe to re-run (IF NOT EXISTS / duplicate_object guards).
-- Requires: CMS tables already exist; users + module_registry from 0001_foundation.sql.

-- ========== 0002_leads.sql ==========
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM ('contact_form', 'whatsapp', 'manual', 'referral', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  business_type TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  source lead_source NOT NULL DEFAULT 'contact_form',
  source_detail TEXT NOT NULL DEFAULT '',
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  ip_hash TEXT,
  user_agent TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_created_idx ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_assigned_idx ON leads (assigned_to_id);
CREATE INDEX IF NOT EXISTS leads_is_read_idx ON leads (is_read);

CREATE TABLE IF NOT EXISTS lead_notes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_notes_lead_id_idx ON lead_notes (lead_id, created_at DESC);

UPDATE module_registry SET is_enabled = TRUE, updated_at = NOW() WHERE key = 'leads';

-- ========== 0003_phase3_automation_permissions.sql ==========
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

-- ========== 0004_crm_tasks_scoring.sql ==========
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

-- ========== 0005_integrations.sql ==========
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
