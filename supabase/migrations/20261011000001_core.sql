-- Core schema. Portable Postgres: applied to Supabase in production and to the embedded
-- PGlite database in development and tests. Supabase-specific RLS lives in the next file.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------------------
-- Users and roles
-- ---------------------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key,
  email text not null unique,
  display_name text,
  role text not null default 'student'
    check (role in ('super_admin', 'content_admin', 'examiner', 'support_admin', 'student')),
  locale text not null default 'en' check (locale in ('en', 'de')),
  target_track text,
  exam_date date,
  onboarded_at timestamptz,
  ai_processing_consent boolean not null default false,
  recording_retention_days integer not null default 90 check (recording_retention_days between 1 and 730),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deletion_requested_at timestamptz
);

-- ---------------------------------------------------------------------------------------
-- Catalogue: tracks map 1:1 to a blueprint key; blueprint definitions are versioned in code
-- and snapshotted here so admin confirmations and exams can reference an exact version.
-- ---------------------------------------------------------------------------------------
create table if not exists exam_tracks (
  key text primary key,                      -- e.g. 'goethe-a1-sd1'
  provider text not null check (provider in ('goethe', 'telc')),
  level text not null check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  title text not null,
  variant text not null default 'Erwachsene',
  sort integer not null default 0,
  active boolean not null default true,
  target_mock_count integer not null default 5
);

create table if not exists blueprint_versions (
  blueprint_key text not null,
  version text not null,
  definition jsonb not null,
  created_at timestamptz not null default now(),
  primary key (blueprint_key, version)
);

create table if not exists blueprint_confirmations (
  id uuid primary key default gen_random_uuid(),
  blueprint_key text not null,
  version text not null,
  confirmed_by uuid references profiles(id),
  note text not null,
  created_at timestamptz not null default now(),
  foreign key (blueprint_key, version) references blueprint_versions(blueprint_key, version)
);

-- ---------------------------------------------------------------------------------------
-- Exams and immutable versions
-- ---------------------------------------------------------------------------------------
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  track_key text not null references exam_tracks(key),
  mock_number integer not null check (mock_number > 0),
  title text not null,
  access_tier text not null default 'premium' check (access_tier in ('free', 'premium')),
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'validated', 'in_review', 'approved', 'published', 'archived')),
  current_version_id uuid,
  published_version_id uuid,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (track_key, mock_number)
);

create table if not exists exam_versions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams(id) on delete cascade,
  version integer not null,
  blueprint_key text not null,
  blueprint_version text not null,
  content jsonb not null,
  status text not null default 'draft'
    check (status in ('draft', 'generated', 'validated', 'in_review', 'approved', 'published', 'superseded', 'archived')),
  validation jsonb,
  -- Content is frozen once a version is in review; edits create a new version.
  locked boolean not null default false,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  published_at timestamptz,
  unique (exam_id, version),
  foreign key (blueprint_key, blueprint_version) references blueprint_versions(blueprint_key, version)
);

alter table exams drop constraint if exists exams_current_version_fk;
alter table exams add constraint exams_current_version_fk foreign key (current_version_id) references exam_versions(id) deferrable initially deferred;
alter table exams drop constraint if exists exams_published_version_fk;
alter table exams add constraint exams_published_version_fk foreign key (published_version_id) references exam_versions(id) deferrable initially deferred;

create index if not exists exam_versions_exam_idx on exam_versions(exam_id);

create table if not exists review_decisions (
  id uuid primary key default gen_random_uuid(),
  exam_version_id uuid not null references exam_versions(id) on delete cascade,
  reviewer_id uuid references profiles(id),
  decision text not null check (decision in ('approve', 'request_changes', 'reject')),
  comments text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------
-- Audio production
-- ---------------------------------------------------------------------------------------
create table if not exists audio_assets (
  id uuid primary key default gen_random_uuid(),
  exam_version_id uuid references exam_versions(id) on delete set null,
  script_id text not null,
  kind text not null default 'final' check (kind in ('turn', 'ambience', 'final')),
  turn_id text,
  storage_path text not null,
  mime text not null,
  duration_sec numeric,
  provider text not null check (provider in ('elevenlabs', 'upload', 'studio_mix')),
  status text not null default 'generated' check (status in ('generated', 'approved', 'rejected')),
  production jsonb not null default '{}'::jsonb,
  created_by uuid references profiles(id),
  approved_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists audio_assets_script_idx on audio_assets(exam_version_id, script_id);

-- ---------------------------------------------------------------------------------------
-- Attempts
-- ---------------------------------------------------------------------------------------
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  exam_id uuid not null references exams(id),
  exam_version_id uuid not null references exam_versions(id),
  blueprint_key text not null,
  blueprint_version text not null,
  mode text not null check (mode in ('exam', 'practice')),
  section_ids text[] not null,
  state jsonb not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted')),
  play_counts jsonb not null default '{}'::jsonb,
  result jsonb,
  scoring_version text,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on attempts(user_id, started_at desc);

create table if not exists attempt_answers (
  attempt_id uuid not null references attempts(id) on delete cascade,
  item_id text not null,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (attempt_id, item_id)
);

create table if not exists attempt_events (
  id bigserial primary key,
  attempt_id uuid not null references attempts(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);

create table if not exists submission_media (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  item_id text not null,
  storage_path text not null,
  mime text not null,
  bytes integer not null,
  duration_sec numeric,
  transcript text,
  transcript_provider text,
  retention_until timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts(id) on delete cascade,
  item_id text not null,
  kind text not null check (kind in ('writing', 'speaking')),
  source text not null check (source in ('ai', 'human')),
  rubric_version text not null,
  evaluator_version text not null,
  criteria jsonb not null,             -- [{id, label, points, max, comment}]
  total numeric not null,
  max numeric not null,
  feedback jsonb not null default '{}'::jsonb, -- annotations, suggestions, model answer
  reviewer_id uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists assessments_attempt_idx on assessments(attempt_id);

create table if not exists issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  exam_version_id uuid references exam_versions(id) on delete cascade,
  item_id text,
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------
-- Plans, subscriptions, billing
-- ---------------------------------------------------------------------------------------
create table if not exists plans (
  id text primary key,                      -- 'free', 'premium_monthly', 'premium_annual'
  name text not null,
  description text not null default '',
  billing_interval text not null check (billing_interval in ('none', 'month', 'year')),
  price_cents integer not null default 0,
  currency text not null default 'eur',
  stripe_price_id text,
  entitlements jsonb not null,              -- see src/domain/entitlements.ts
  active boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_id text not null references plans(id),
  status text not null check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused')),
  source text not null check (source in ('stripe', 'dev_simulated', 'manual')),
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on subscriptions(user_id);

create table if not exists billing_customers (
  user_id uuid primary key references profiles(id) on delete cascade,
  stripe_customer_id text not null unique
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  stripe_invoice_id text unique,
  amount_cents integer not null,
  currency text not null,
  status text not null,
  hosted_invoice_url text,
  source text not null default 'stripe' check (source in ('stripe', 'dev_simulated')),
  created_at timestamptz not null default now()
);

create table if not exists stripe_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

create table if not exists usage_counters (
  user_id uuid not null references profiles(id) on delete cascade,
  period text not null,                      -- 'YYYY-MM'
  kind text not null,                        -- 'ai_writing', 'ai_speaking'
  count integer not null default 0,
  primary key (user_id, period, kind)
);

-- ---------------------------------------------------------------------------------------
-- AI generation and audit
-- ---------------------------------------------------------------------------------------
create table if not exists generation_jobs (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('exam', 'section', 'part', 'item', 'passage')),
  track_key text not null references exam_tracks(key),
  exam_id uuid references exams(id) on delete set null,
  exam_version_id uuid references exam_versions(id) on delete set null,
  target jsonb not null default '{}'::jsonb,  -- {sectionId, partId, itemId}
  prompt text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed')),
  provider text,
  model text,
  output jsonb,
  validation jsonb,
  error text,
  usage jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists audit_log (
  id bigserial primary key,
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  at timestamptz not null default now()
);
create index if not exists audit_log_entity_idx on audit_log(entity_type, entity_id);

create table if not exists consents (
  id bigserial primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,                        -- 'terms', 'privacy', 'ai_processing', 'recording'
  granted boolean not null,
  at timestamptz not null default now()
);
