-- Birthday Builder Phase 1/3/4 features. Safe to run repeatedly.
insert into public.templates (slug,name,category,description) values
  ('master','Master Template','master','Original HTML experience'),
  ('romantic','Romantic','romantic','Soft romantic style'),
  ('cute','Cute','cute','Playful birthday style'),
  ('luxury','Luxury','luxury','Premium elegant style'),
  ('anime','Anime','anime','Anime-inspired style'),
  ('gaming','Gaming','gaming','Gaming birthday style'),
  ('minimal','Minimal','minimal','Clean minimal style'),
  ('elegant','Elegant','elegant','Classic elegant style'),
  ('festival','Festival','festival','Colorful celebration style')
on conflict (slug) do nothing;

-- Custom domains were removed as a feature; drop the column/index if a
-- previous run of this migration already added them.
alter table public.websites drop column if exists custom_domain;
drop index if exists websites_custom_domain_idx;

alter table public.websites add column if not exists referral_code text;
create unique index if not exists websites_referral_code_idx on public.websites(referral_code) where referral_code is not null;

-- Note: recipient identity is tracked via metadata->>'recipientKey' (matching
-- an id inside websites.content.recipients) rather than a separate lookup
-- table, since a recipient link can be created and edited entirely inside
-- the JSON content without a DB round-trip. recipient_id below is kept as a
-- plain nullable column for forward-compatibility but isn't populated yet.
-- Drop the old recipient_links table and its FK if a previous run created them.
alter table if exists public.recipient_events drop constraint if exists recipient_events_recipient_id_fkey;
alter table if exists public.collaborative_wishes drop constraint if exists collaborative_wishes_recipient_id_fkey;
alter table if exists public.reactions drop constraint if exists reactions_recipient_id_fkey;
drop table if exists public.recipient_links;

create table if not exists public.recipient_events (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  recipient_id uuid,
  type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.collaborative_wishes (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  recipient_id uuid,
  author_name text not null,
  message text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  recipient_id uuid,
  emoji text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites(id) on delete cascade,
  code text not null,
  referred_from text,
  created_at timestamptz not null default now()
);
create index if not exists recipient_events_website_idx on public.recipient_events(website_id);
create index if not exists collaborative_wishes_website_idx on public.collaborative_wishes(website_id);
create index if not exists reactions_website_idx on public.reactions(website_id);

alter table public.recipient_events enable row level security;
alter table public.collaborative_wishes enable row level security;
alter table public.reactions enable row level security;
alter table public.referrals enable row level security;
drop policy if exists recipient_events_owner on public.recipient_events;
drop policy if exists wishes_public_read on public.collaborative_wishes;
drop policy if exists wishes_public_insert on public.collaborative_wishes;
drop policy if exists reactions_public_insert on public.reactions;
drop policy if exists reactions_public_read on public.reactions;
drop policy if exists referrals_owner on public.referrals;
create policy recipient_events_owner on public.recipient_events for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy wishes_public_read on public.collaborative_wishes for select using(approved=true);
create policy wishes_public_insert on public.collaborative_wishes for insert with check(true);
create policy reactions_public_insert on public.reactions for insert with check(true);
create policy reactions_public_read on public.reactions for select using(true);
create policy referrals_owner on public.referrals for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));

create index if not exists recipient_events_created_idx on public.recipient_events(created_at desc);
