-- ============================================================
-- Birthday Surprise Site — Supabase Schema
-- Run this once in Supabase SQL Editor
-- ============================================================

-- One-row table holding all "global" settings (name, age, countdown target, texts, links)
create table if not exists site_settings (
  id int primary key default 1,
  recipient_name text not null default 'Natu..',
  age int not null default 18,
  birthday_month int not null default 6,      -- 0 = January ... 11 = December
  birthday_day int not null default 6,
  birthday_hour int not null default 21,      -- 24h format
  birthday_minute int not null default 30,
  greeting_text text not null default 'Hey You Know What! You''re the most adorable human i ever met! 💖',
  cake_title text not null default 'Happy Birthday Sweety❤️🎂',
  letter_title text not null default 'A Letter for You Babiee 💌',
  letter_content text not null default 'Every laugh, every chat, and every moment we''ve shared has been truly special.💫',
  secret_photo_url text,
  secret_button_label text not null default 'See Your Friend',
  secret_button_link text default 'https://www.instagram.com/',
  facebook_url text,
  instagram_url text,
  countdown_audio_url text,
  birthday_audio_url text,
  contact_email text,
  whatsapp_url text,
  emailjs_public_key text,
  emailjs_service_id text,
  emailjs_template_id text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Migration: if you already ran this schema before (older
-- version without the Contact fields), run just this block once
-- in the SQL Editor to add the new columns without losing data.
-- ------------------------------------------------------------
alter table site_settings add column if not exists contact_email text;
alter table site_settings add column if not exists whatsapp_url text;
alter table site_settings add column if not exists emailjs_public_key text;
alter table site_settings add column if not exists emailjs_service_id text;
alter table site_settings add column if not exists emailjs_template_id text;

-- Reasons shown on the "reasons" screen
create table if not exists reasons (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  emoji text not null default '💖',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Photo gallery
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null default '',
  caption text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Video messages
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  video_url text not null,
  poster_url text,
  title text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- Public (anon) can only READ. Only authenticated users (admin) can write.
-- ============================================================
alter table site_settings enable row level security;
alter table reasons enable row level security;
alter table photos enable row level security;
alter table videos enable row level security;

create policy "public read settings" on site_settings for select using (true);
create policy "auth write settings" on site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read reasons" on reasons for select using (true);
create policy "auth write reasons" on reasons for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read photos" on photos for select using (true);
create policy "auth write photos" on photos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read videos" on videos for select using (true);
create policy "auth write videos" on videos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- After running this:
-- 1. Go to Authentication -> Users in Supabase and create ONE user
--    (your email + password) — this is the admin login.
-- 2. Disable public sign-ups: Authentication -> Providers -> Email ->
--    turn OFF "Allow new users to sign up".
-- ============================================================
