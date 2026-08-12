# Birthday Site Builder

A Next.js SaaS built from your original `birthday-site-fixed.html` template.
Members sign up, customize a birthday surprise site (countdown → greeting →
cake cutting → reasons → photo gallery → videos → letter → secret screen →
contact form), and share it with a single public link. Nothing from your
original HTML/CSS/JS was dropped — it was turned into a data-driven template
(`src/lib/templateEngine.ts`) so every screen, animation, sound cue, and
interaction (mic-triggered candle blowing, GSAP cursor, floating hearts,
localStorage-persisted cake state, EmailJS contact form, 24h auto-reset,
back-button history) still works exactly as before, just with the text/media/
colors/dates coming from the database instead of being hardcoded.

## How it's organized

- `src/lib/demoConfig.ts` + `src/app/demo/route.ts` — a public, no-login demo
  of the real template (generic placeholder photos/text) rendered live on the
  homepage in an iframe, plus a "Open full screen" link. This is what lets
  visitors see the actual template before signing up.
- `src/app/page.tsx` — homepage: embeds the live demo, a 3-step "how it
  works" section, and the Log in / Sign up entry points.
- `src/types/site-config.ts` — every field a user can customize (name, date,
  age/candles, colors, reasons, photos, videos, letter text, secret photo,
  audio URLs, social links, EmailJS keys). Add a field here + wire it into
  `templateEngine.ts` to expose more customization later.
- `src/lib/templateEngine.ts` — takes a `SiteConfig` and returns the *exact*
  original single-file HTML page (styles + script included), with the
  editable parts substituted in. This is what makes the shared link behave
  identically to your original file.
- `src/app/site/[slug]/route.ts` — the public share link. No login needed;
  serves the generated HTML directly (`Content-Type: text/html`).
- `src/app/dashboard/[siteId]/edit/page.tsx` — the "admin panel": a form for
  every field in `SiteConfig`, with a live iframe preview next to it.
- `src/app/api/sites/*` — create/list/update/delete sites (ownership-checked
  against the logged-in user).
- `src/app/api/signup`, `src/lib/auth.ts` — email/password signup + login via
  NextAuth (Credentials provider, bcrypt-hashed passwords). The home page
  (`src/app/page.tsx`) has the Log in / Sign up entry points you asked for.

## Database: Postgres (Supabase or Neon)

This project is set up for Postgres from the start.

1. Create a free project at [supabase.com](https://supabase.com) or
   [neon.tech](https://neon.tech).
2. Copy the connection string it gives you:
   - **Supabase:** Project Settings → Database → Connection string → URI
     (use the "Transaction" pooler string if deploying to a serverless host
     like Vercel)
   - **Neon:** Dashboard → Connection Details
3. Paste it into `.env` as `DATABASE_URL`.

## Media uploads: Cloudinary

Photo, video, and audio fields in the editor now have an **Upload** button
next to the URL field — you can either paste an existing link or upload a
file directly from your device, exactly like the question you answered.

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud name** from the dashboard home page.
3. Go to Settings → Upload → Upload presets → Add upload preset → set
   **Signing Mode** to **Unsigned** → Save. Copy the preset's name.
4. Put both into `.env`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-unsigned-preset"
   ```

Uploads go straight from the browser to Cloudinary (no API secret is ever
exposed) via `src/lib/cloudinary-client.ts`. The reusable
`src/components/MediaField.tsx` component is what renders the "paste a URL
or upload" input pattern — reuse it anywhere else you add a media field.

If Cloudinary isn't configured yet, the URL field still works fine on its
own — the Upload button just shows a friendly error until you add the env
vars.

## Running it locally

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, NEXTAUTH_SECRET, Cloudinary keys
npm run db:push           # creates the tables in your Postgres database
npm run dev
```

Open http://localhost:3000 — sign up, create a site, fill in the editor
(paste URLs or use the Upload buttons), and open the "View" link
(`/site/<slug>`) to see the live public page.

## Deploying

Any Next.js host works (Vercel is the easiest). Set the same env vars from
`.env.example` in your host's dashboard (use your real Postgres
`DATABASE_URL`), and set `NEXTAUTH_URL` / `NEXT_PUBLIC_BASE_URL` to your real
domain.
