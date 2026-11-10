create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  dial_code text not null,
  phone text not null,
  name text,
  state text,
  batch_year integer,
  profile_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_phone_identity_unique unique (dial_code, phone),
  constraint users_batch_year_min check (batch_year is null or batch_year >= 2016)
);

alter table public.users enable row level security;
revoke all on table public.users from anon, authenticated;
grant all on table public.users to service_role;
