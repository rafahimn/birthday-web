# Birthday Builder Architecture

- Next.js 14 App Router + React + Tailwind
- Supabase Auth: email/password, email confirmation, password recovery, Google OAuth
- Supabase Postgres: all application tables, relationships, indexes and RLS
- Supabase Storage can be used for app media; Cloudinary remains supported for image/media hosting
- Gmail SMTP: configure it in Supabase Authentication SMTP settings so Supabase verification/recovery/auth emails use Gmail
- Vercel: production deployment
- Server-side Supabase REST calls use the service-role key only; it is never exposed to the browser.
- No Prisma, Prisma Client, DATABASE_URL or DIRECT_URL is required.
