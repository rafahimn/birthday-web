-- Login hardening: brute-force lockout tracking on profiles.
-- Safe to re-run: uses IF NOT EXISTS everywhere.

alter table public.profiles add column if not exists failed_login_attempts integer not null default 0;
alter table public.profiles add column if not exists login_locked_until timestamptz;

create index if not exists profiles_email_idx on public.profiles(email);
