-- Birthday Builder SaaS - Supabase-only database
-- Run this entire file in Supabase SQL Editor.
create extension if not exists pgcrypto;

-- Supabase Storage bucket used by the application upload API.
insert into storage.buckets (id, name, public)
values ('birthday-builder', 'birthday-builder', true)
on conflict (id) do update set public = excluded.public;


create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  role text not null default 'user' check (role in ('user','admin','support')),
  avatar_url text,
  phone text,
  bio text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, category text not null,
  description text, preview_url text, active boolean not null default true, config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.template_categories (
  id uuid primary key default gen_random_uuid(), name text unique not null, slug text unique not null, description text, active boolean not null default true, sort integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  slug text unique not null, title text not null, status text not null default 'draft' check(status in ('draft','published','archived')),
  template_id text not null default 'master', content jsonb not null default '{}'::jsonb, views integer not null default 0,
  password_hash text, seo jsonb, favicon_url text, share_image_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.website_content (
  id uuid primary key default gen_random_uuid(), website_id uuid unique not null references public.websites(id) on delete cascade, content jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, url text not null, caption text, sort integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.music (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, url text not null, title text, created_at timestamptz not null default now()
);
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, url text not null, title text, created_at timestamptz not null default now()
);
create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, date text not null, title text not null, description text not null, sort integer not null default 0
);
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, text text not null, sort integer not null default 0
);
create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, title text not null, url text, claimed boolean not null default false
);
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, user_id uuid references auth.users(id) on delete set null, name text not null, message text not null, approved boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, user_id uuid references auth.users(id) on delete set null, name text not null, message text not null, approved boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, visitor_hash text, country text, device text, browser text, referrer text, first_seen_at timestamptz not null default now(), last_seen_at timestamptz not null default now(), views integer not null default 1
);
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(), website_id uuid not null references public.websites(id) on delete cascade, type text not null, country text, device text, browser text, referrer text, path text, created_at timestamptz not null default now()
);
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, url text not null, public_id text, type text not null, folder text, created_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null, message text not null, read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(), key text unique not null, subject text not null, body text not null, updated_at timestamptz not null default now()
);
create table if not exists public.settings (
  key text primary key, value jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table if not exists public.admin_accounts (
  id uuid primary key default gen_random_uuid(), user_id uuid unique not null references auth.users(id) on delete cascade, permission_set jsonb not null default '{}'::jsonb, active boolean not null default true, created_at timestamptz not null default now()
);
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(), website_id uuid references public.websites(id) on delete cascade, type text not null, payload jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.demo_sites (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, content jsonb not null default '{}'::jsonb, active boolean not null default true, updated_at timestamptz not null default now()
);

create index if not exists websites_user_id_idx on public.websites(user_id);
create index if not exists websites_status_idx on public.websites(status);
create index if not exists analytics_events_website_id_idx on public.analytics_events(website_id);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists gallery_website_id_idx on public.gallery(website_id);
create index if not exists media_user_id_idx on public.media(user_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,email,name) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',split_part(new.email,'@',1))) on conflict(id) do update set email=excluded.email,name=coalesce(excluded.name,profiles.name); return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.increment_website_views(p_website_id uuid) returns void language sql security definer set search_path=public as $$ update public.websites set views=views+1,updated_at=now() where id=p_website_id; $$;

-- updated_at triggers
 drop trigger if exists profiles_updated_at on public.profiles; create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
 drop trigger if exists websites_updated_at on public.websites; create trigger websites_updated_at before update on public.websites for each row execute function public.set_updated_at();
 drop trigger if exists templates_updated_at on public.templates; create trigger templates_updated_at before update on public.templates for each row execute function public.set_updated_at();
 drop trigger if exists email_templates_updated_at on public.email_templates; create trigger email_templates_updated_at before update on public.email_templates for each row execute function public.set_updated_at();
 drop trigger if exists settings_updated_at on public.settings; create trigger settings_updated_at before update on public.settings for each row execute function public.set_updated_at();
 drop trigger if exists demo_sites_updated_at on public.demo_sites; create trigger demo_sites_updated_at before update on public.demo_sites for each row execute function public.set_updated_at();
 drop trigger if exists website_content_updated_at on public.website_content; create trigger website_content_updated_at before update on public.website_content for each row execute function public.set_updated_at();

-- RLS: browser clients are denied by default; authenticated users can own their records.
DO $$ BEGIN
  EXECUTE 'drop policy if exists profiles_self on public.profiles';
  EXECUTE 'drop policy if exists websites_owner on public.websites';
  EXECUTE 'drop policy if exists website_content_owner on public.website_content';
  EXECUTE 'drop policy if exists gallery_owner on public.gallery';
  EXECUTE 'drop policy if exists music_owner on public.music';
  EXECUTE 'drop policy if exists videos_owner on public.videos';
  EXECUTE 'drop policy if exists timeline_owner on public.timeline';
  EXECUTE 'drop policy if exists memories_owner on public.memories';
  EXECUTE 'drop policy if exists wishlist_owner on public.wishlist_items';
  EXECUTE 'drop policy if exists guestbook_public_read on public.guestbook';
  EXECUTE 'drop policy if exists guestbook_insert_public on public.guestbook';
  EXECUTE 'drop policy if exists guestbook_owner_manage on public.guestbook';
  EXECUTE 'drop policy if exists analytics_owner on public.analytics_events';
  EXECUTE 'drop policy if exists media_owner on public.media';
  EXECUTE 'drop policy if exists notifications_self on public.notifications';
  EXECUTE 'drop policy if exists admin_accounts_self on public.admin_accounts';
  EXECUTE 'drop policy if exists reports_owner on public.reports';
  EXECUTE 'drop policy if exists templates_public_read on public.templates';
  EXECUTE 'drop policy if exists categories_public_read on public.template_categories';
  EXECUTE 'drop policy if exists demo_public_read on public.demo_sites';
END $$;
alter table public.profiles enable row level security; alter table public.websites enable row level security; alter table public.website_content enable row level security;
alter table public.gallery enable row level security; alter table public.music enable row level security; alter table public.videos enable row level security; alter table public.timeline enable row level security; alter table public.memories enable row level security; alter table public.wishlist_items enable row level security; alter table public.guestbook enable row level security; alter table public.comments enable row level security; alter table public.visitors enable row level security; alter table public.analytics_events enable row level security; alter table public.media enable row level security; alter table public.notifications enable row level security; alter table public.templates enable row level security; alter table public.template_categories enable row level security; alter table public.demo_sites enable row level security; alter table public.email_templates enable row level security; alter table public.settings enable row level security; alter table public.admin_accounts enable row level security; alter table public.reports enable row level security;

create policy profiles_self on public.profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy websites_owner on public.websites for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy website_content_owner on public.website_content for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy gallery_owner on public.gallery for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy music_owner on public.music for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy videos_owner on public.videos for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy timeline_owner on public.timeline for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy memories_owner on public.memories for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy wishlist_owner on public.wishlist_items for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy guestbook_public_read on public.guestbook for select using(approved=true or auth.uid()=user_id or exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy guestbook_insert_public on public.guestbook for insert with check(true);
create policy guestbook_owner_manage on public.guestbook for update using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy analytics_owner on public.analytics_events for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy media_owner on public.media for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy notifications_self on public.notifications for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy admin_accounts_self on public.admin_accounts for select using(auth.uid()=user_id);
create policy reports_owner on public.reports for all using(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid())) with check(exists(select 1 from public.websites w where w.id=website_id and w.user_id=auth.uid()));
create policy templates_public_read on public.templates for select using(active=true);
create policy categories_public_read on public.template_categories for select using(active=true);
create policy demo_public_read on public.demo_sites for select using(active=true);

-- Starter categories/templates; safe to re-run.
insert into public.template_categories(name,slug,description,sort) values
('Master','master','Original birthday HTML-based template',0),('Romantic','romantic','Romantic birthday experiences',1),('Cute','cute','Cute and playful experiences',2),('Luxury','luxury','Premium visual style',3),('Anime','anime','Anime-inspired style',4),('Gaming','gaming','Gaming style',5),('Minimal','minimal','Clean minimal style',6),('Elegant','elegant','Elegant style',7),('Festival','festival','Celebration style',8)
on conflict(slug) do nothing;
