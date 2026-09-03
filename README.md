# Birthday Builder SaaS

Production-oriented Next.js birthday website builder. The supplied original HTML is kept as the Master Template reference and the interactive experience is migrated into a reusable React template.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill `DATABASE_URL` plus optional Cloudinary/Resend values.
3. `npx prisma db push`
4. `npm run dev`

## Build
`npm run build`

## Vercel
Set the same environment variables in Vercel. The project runs Prisma generation automatically during install/build.

## First admin
After creating a user, set its Prisma `role` to `admin` (or seed an admin through your database tooling). Admin routes never expose a public admin-login button.

## Vercel / Prisma fix

The Prisma schema is intentionally formatted as a standard multiline Prisma schema.
Do not minify model blocks onto one line. Vercel runs `prisma validate` before the Next.js build,
then `prisma generate` during the build.

Recommended Vercel settings:
- Framework Preset: Next.js
- Install Command: `npm install`
- Build Command: `prisma generate && next build`
- `DATABASE_URL` must be configured in Vercel Environment Variables.

## Deployment requirement

Vercel can compile the application before the database is configured. For actual login, dashboard,
builder persistence, publishing, analytics and admin features, set `DATABASE_URL` in Vercel Environment
Variables to your Supabase/PostgreSQL connection string. Public `/demo` and `/templates` have safe fallbacks
when the database is not configured.
