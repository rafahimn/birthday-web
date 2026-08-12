# Birthday Site Builder — multi-tenant

A Next.js + Supabase SaaS. Anyone can sign up, build their own birthday
surprise site (countdown → greeting → cake cutting → reasons → photo
gallery → videos → letter → secret screen → contact form), and share it
with a unique public link. Every screen/animation/interaction lives in
`app/BirthdayExperience.tsx`, driven entirely by data from Supabase — the
same component powers the homepage demo, the dashboard live preview, and
the public share link.

## How it's organized

- `app/page.tsx` — marketing homepage: embeds a live, no-login `/demo` in
  an iframe, a 3-step "how it works", and Log in / Sign up.
- `app/demo/page.tsx` + `lib/demoData.ts` — the public demo (hardcoded
  placeholder data, no database).
- `app/login`, `app/signup` — Supabase Auth (email/password).
- `app/dashboard/page.tsx` — a member's list of sites + create new.
- `app/dashboard/[siteId]/...` — the per-site admin panel (Overview with
  live preview + publish toggle + slug editor, Countdown & Greeting,
  Contact, Reasons, Photos, Videos, Letter, Secret Photo). Every page
  checks that the logged-in user owns `siteId` before showing anything.
- `app/s/[slug]/page.tsx` — the public share link. No login needed; looks
  up a *published* site by slug and renders `BirthdayExperience`.
- `lib/types.ts` — `Site` (all customizable fields), `Reason`, `Photo`,
  `VideoItem`.
- `lib/data.ts` — `getUserSites`, `getSiteForOwner` (dashboard, ownership
  checked explicitly), `getSiteBySlug` (public, published-only).
- `lib/actions.ts` — all server actions (auth, site CRUD, publish/slug,
  and reasons/photos/videos/settings/contact/letter/secret CRUD), every
  mutation scoped to `siteId` and checked against the logged-in owner.
- `middleware.ts` + `lib/supabase/middleware.ts` — protects `/dashboard/*`,
  redirects logged-in users away from `/login` and `/signup`.

## Database: Supabase (Postgres)

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (Project Settings → API) into `.env.local`.
3. Open the SQL Editor and run all of `supabase_schema.sql` — it creates
   `sites`, `reasons`, `photos`, `videos`, and the Row Level Security
   policies that make ownership + the public share link work.
4. Authentication → Providers → Email → make sure "Allow new users to
   sign up" is **ON** (members create their own accounts from `/signup`).

If you're migrating from the old single-site version of this project,
see the migration notes at the bottom of `supabase_schema.sql`.

## Media uploads: Cloudinary

Same as before — photo/video/audio fields have an **Upload** button next
to the URL field.

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud name** from the dashboard home page.
3. Settings → Upload → Upload presets → Add upload preset → Signing Mode
   **Unsigned** → Save. Copy the preset's name.
4. Put both into `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-preset"
   ```

## Running it locally

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Cloudinary keys
npm run dev
```

Open http://localhost:3000 — sign up, create a site from `/dashboard`,
fill in the editor, then open `/s/<your-slug>` to see the live public page.

## Deploying

Any Next.js host works (Vercel is the easiest). Set the same env vars
from `.env.example` in your host's dashboard, and set
`NEXT_PUBLIC_BASE_URL` to your real domain.
