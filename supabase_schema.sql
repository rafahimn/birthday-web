-- ============================================================
-- Birthday Site Builder — Multi-tenant Supabase Schema
-- Run this once in Supabase SQL Editor (SQL Editor -> New query)
-- ============================================================

-- One row per birthday site. Each site belongs to one member (owner_id).
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  recipient_name text not null default 'Your Person',
  age int not null default 18,
  birthday_month int not null default 0,       -- 0 = January ... 11 = December
  birthday_day int not null default 1,
  birthday_hour int not null default 0,          -- 24h format
  birthday_minute int not null default 0,
  greeting_text text not null default 'Happy Birthday! You mean the world to me 💖',
  cake_title text not null default 'Happy Birthday! 🎂',
  letter_title text not null default 'A Letter for You 💌',
  letter_content text not null default 'Write something special here...',
  secret_photo_url text,
  secret_button_label text not null default 'See more',
  secret_button_link text,
  facebook_url text,
  instagram_url text,
  countdown_audio_url text,
  birthday_audio_url text,
  contact_email text,
  whatsapp_url text,
  emailjs_public_key text,
  emailjs_service_id text,
  emailjs_template_id text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index if not exists sites_owner_id_idx on sites(owner_id);

-- Reasons shown on the "reasons" screen (per site)
create table if not exists reasons (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  text text not null,
  emoji text not null default '💖',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Photo gallery (per site)
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  image_url text not null,
  title text not null default '',
  caption text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Video messages (per site)
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  video_url text not null,
  poster_url text,
  title text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists reasons_site_id_idx on reasons(site_id);
create index if not exists photos_site_id_idx on photos(site_id);
create index if not exists videos_site_id_idx on videos(site_id);

-- ============================================================
-- Row Level Security
-- - Owner (auth.uid() = sites.owner_id) has full read/write on their
--   own sites and everything under them (reasons/photos/videos).
-- - Anyone (including logged-out visitors) can READ a site — and its
--   reasons/photos/videos — only if that site is published. This is
--   what makes the public share link (/s/[slug]) work without login.
-- ============================================================
alter table sites enable row level security;
alter table reasons enable row level security;
alter table photos enable row level security;
alter table videos enable row level security;

create policy "owner full access sites" on sites for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "public read published sites" on sites for select
  using (published = true);

create policy "owner full access reasons" on reasons for all
  using (exists (select 1 from sites where sites.id = reasons.site_id and sites.owner_id = auth.uid()))
  with check (exists (select 1 from sites where sites.id = reasons.site_id and sites.owner_id = auth.uid()));

create policy "public read reasons of published sites" on reasons for select
  using (exists (select 1 from sites where sites.id = reasons.site_id and sites.published = true));

create policy "owner full access photos" on photos for all
  using (exists (select 1 from sites where sites.id = photos.site_id and sites.owner_id = auth.uid()))
  with check (exists (select 1 from sites where sites.id = photos.site_id and sites.owner_id = auth.uid()));

create policy "public read photos of published sites" on photos for select
  using (exists (select 1 from sites where sites.id = photos.site_id and sites.published = true));

create policy "owner full access videos" on videos for all
  using (exists (select 1 from sites where sites.id = videos.site_id and sites.owner_id = auth.uid()))
  with check (exists (select 1 from sites where sites.id = videos.site_id and sites.owner_id = auth.uid()));

create policy "public read videos of published sites" on videos for select
  using (exists (select 1 from sites where sites.id = videos.site_id and sites.published = true));

-- ============================================================
-- ADMIN PANEL — profiles (approval + role), templates, admin RLS
-- Run this block once, after the tables above already exist.
-- ============================================================

-- One row per auth user. Auto-created by the trigger below.
-- approved = false by default -> new members can log in but the
-- dashboard shows a "waiting for approval" screen until an admin
-- approves them from /admin/members.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used inside RLS policies. SECURITY DEFINER so it bypasses
-- RLS internally — avoids infinite recursion on the profiles policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$;

alter table profiles enable row level security;

create policy "user reads own profile" on profiles for select
  using (auth.uid() = id);

create policy "admin full access profiles" on profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Templates a member can start a new site from (admin managed).
create table if not exists templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  thumbnail_url text,
  greeting_text text not null default 'Happy Birthday! You mean the world to me 💖',
  cake_title text not null default 'Happy Birthday! 🎂',
  letter_title text not null default 'A Letter for You 💌',
  letter_content text not null default 'Write something special here...',
  secret_button_label text not null default 'See more',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table templates enable row level security;

create policy "read active templates" on templates for select
  using (is_active = true or public.is_admin());

create policy "admin full access templates" on templates for all
  using (public.is_admin())
  with check (public.is_admin());

-- Which template a site was started from (optional).
alter table sites add column if not exists template_id uuid references templates(id) on delete set null;

-- Let admins fully manage every site, on top of the owner-only policy
-- that already exists above.
create policy "admin full access sites" on sites for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- MAKE YOURSELF THE FIRST ADMIN (run once, manually)
-- 1. Sign up normally at /signup with the account you want as admin.
-- 2. Run this, swapping in that account's email:
--
--    update profiles set is_admin = true, approved = true
--    where email = 'your-admin-email@example.com';
--
-- Now log in at /admin/login with that same email + password.
-- ============================================================

-- ============================================================
-- INVITE LINK — sign up with no admin approval needed
-- One shareable link (shown on /admin/members) lets anyone who has
-- it create an account that's auto-approved. Everyone else who signs
-- up the normal way still needs manual approval.
-- ============================================================

create table if not exists app_settings (
  id int primary key default 1,
  invite_token text not null default encode(gen_random_bytes(9), 'hex'),
  constraint app_settings_singleton check (id = 1)
);

insert into app_settings (id) values (1) on conflict (id) do nothing;

alter table app_settings enable row level security;

create policy "admin full access app_settings" on app_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Called right after signup (from the signup form's invite link) to
-- auto-approve the brand-new account if the token matches. Runs with
-- elevated rights so a logged-out/just-signed-up user can call it
-- without needing SELECT on app_settings directly.
create or replace function public.approve_via_invite(p_token text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_match boolean;
begin
  select (invite_token = p_token) into v_match from app_settings where id = 1;
  if coalesce(v_match, false) then
    update profiles set approved = true where id = auth.uid();
    return true;
  end if;
  return false;
end;
$$;

grant execute on function public.approve_via_invite(text) to authenticated;

-- ============================================================
-- Signups
-- Members create their own account from /signup (Supabase Auth,
-- email/password) — no manual user creation needed.
-- Authentication -> Providers -> Email -> "Allow new users to sign up"
-- should stay ON for this multi-tenant version.
-- ============================================================

-- ============================================================
-- MIGRATING FROM THE OLD SINGLE-SITE SCHEMA
-- If you previously ran the old schema (a single `site_settings` row
-- + reasons/photos/videos with no site_id), do this once:
--
-- 1. Run everything above to create the new tables.
-- 2. Create your own account at /signup, note your user id
--    (Authentication -> Users -> copy the UUID).
-- 3. Insert one `sites` row using your old site_settings values,
--    with owner_id = your UUID and a slug of your choice, e.g.:
--
--    insert into sites (owner_id, slug, recipient_name, age, ...)
--    select 'YOUR-USER-UUID', 'my-first-site', recipient_name, age, ...
--    from site_settings where id = 1;
--
-- 4. For old reasons/photos/videos, add a site_id column pointing at
--    the new site's id, e.g.:
--    update reasons set site_id = 'NEW-SITE-UUID';  (repeat for photos, videos)
--    -- then add the not-null + FK constraint, or just re-add the
--    -- rows manually from the admin panel — for a handful of rows
--    -- that's often simpler than a migration script.
-- 5. Once confirmed, drop the old `site_settings` table.
-- ============================================================
