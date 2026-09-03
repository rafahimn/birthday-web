# Birthday Builder SaaS

Production-oriented birthday website builder using **Next.js + Supabase + Vercel**.

## Quick setup
1. Create a Supabase project.
2. Run `supabase_schema.sql` in Supabase SQL Editor.
3. In Supabase Authentication, enable Email and Google providers. Configure Google Client ID/Secret inside Supabase.
4. Configure Gmail SMTP under Supabase Authentication > SMTP Settings using a Google App Password.
5. Copy `.env.example` to `.env.local` and fill the Supabase variables.
6. Set the same variables in Vercel.
7. Deploy.

## Important environment variables
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- optional direct `SMTP_*` variables for application/admin messages

There is no Prisma setup and no `DATABASE_URL`/`DIRECT_URL`.

## Google redirect
In Supabase Authentication > URL Configuration, add:
`https://YOUR-DOMAIN/api/auth/google/callback`

## Admin
Create/sign up a user, then set that user's `profiles.role` to `admin` in Supabase Table Editor/SQL Editor. Admin routes are protected server-side and no public admin-login button is exposed.

## Verification
Run `npm run build`. The project contains a Supabase-only preflight script and no Prisma build step.
