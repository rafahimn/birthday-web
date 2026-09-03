# Environment & Supabase setup

## Vercel variables
Set these for Production/Preview as appropriate:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- optional `SMTP_*`, `EMAIL_FROM`, `ADMIN_EMAIL` for direct app mail

There is **no Supabase/Supabase/Supabase** in the Supabase-only architecture.

## Supabase Auth
1. Authentication > Providers > enable Email and Google.
2. Configure Google Client ID/Secret in Supabase, not in Vercel.
3. Authentication > URL Configuration: set the Site URL to `NEXT_PUBLIC_APP_URL`.
4. Add redirect URL:
   `https://YOUR-DOMAIN/api/auth/google/callback`
5. For password recovery/email confirmation, allow:
   `https://YOUR-DOMAIN/auth/callback`

## Gmail SMTP
In Supabase Dashboard > Authentication > SMTP Settings, configure Gmail SMTP with a Google App Password. This makes Supabase verification, recovery and auth emails use Gmail SMTP.
