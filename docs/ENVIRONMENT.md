# Environment setup

## Supabase

Set `DATABASE_URL` to the Supabase **pooler** connection string (port 6543, `pgbouncer=true`) for normal application traffic.
Set `DIRECT_URL` to the Supabase direct database connection (port 5432) for Prisma migrations / `db push`.

Also keep the standard Supabase project variables ready for client/server integrations:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose to browser code)

## Google Login

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.
The production redirect URI must exactly match the URI registered in Google Cloud Console.

## Gmail SMTP

Set the Gmail SMTP variables and use a Google App Password. Never put the normal Gmail password in the project.
