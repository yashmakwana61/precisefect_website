-- Phase 1 foundation (additive). Run against Supabase Postgres when not using drizzle-kit push.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS activity_events (
  id SERIAL PRIMARY KEY,
  actor_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_registry (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_registry (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS taxonomy_terms (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  slug TEXT NOT NULL,
  label TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS taxonomy_kind_slug_idx ON taxonomy_terms (kind, slug);

CREATE TABLE IF NOT EXISTS content_taxonomy (
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  term_id INTEGER NOT NULL REFERENCES taxonomy_terms(id) ON DELETE CASCADE,
  PRIMARY KEY (entity_type, entity_id, term_id)
);

CREATE TABLE IF NOT EXISTS asset_links (
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL DEFAULT 'default',
  PRIMARY KEY (entity_type, entity_id, field_key)
);

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES team_members(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS photo_asset_id INTEGER REFERENCES assets(id) ON DELETE SET NULL;

ALTER TABLE content_revisions ADD COLUMN IF NOT EXISTS created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE seo_pages ADD COLUMN IF NOT EXISTS page_registry_id INTEGER REFERENCES page_registry(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS content_revisions_entity_idx ON content_revisions (entity_type, entity_id, created_at DESC);

-- Fix case_studies.sort_order if it was created as serial
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'case_studies' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE case_studies
      ALTER COLUMN sort_order TYPE INTEGER USING COALESCE(sort_order::integer, 0);
    ALTER TABLE case_studies ALTER COLUMN sort_order SET DEFAULT 0;
    ALTER TABLE case_studies ALTER COLUMN sort_order SET NOT NULL;
  ELSE
    ALTER TABLE case_studies ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;
