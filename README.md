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
