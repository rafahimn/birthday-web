-- Member approval workflow. Existing rows all get approved=true (backfilled
-- automatically by the NOT NULL DEFAULT) so nobody already using the app gets
-- locked out; only signups created after this migration default to pending.
alter table public.profiles add column if not exists approved boolean not null default true;
create index if not exists profiles_approved_idx on public.profiles(approved);

-- 'settings' table (key/value, already exists) is reused for:
--   key='approval_system' value={"enabled": boolean}
--   key='signup_invite_token' value={"token": string}
-- No schema change needed for that — rows are created on first admin write.
