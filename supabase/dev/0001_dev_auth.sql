-- Development-only authentication tables, used when Supabase is not configured.
-- Never applied to Supabase (production uses Supabase Auth).
create table if not exists dev_credentials (
  user_id uuid primary key references profiles(id) on delete cascade,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists dev_sessions (
  token_hash text primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
