# Feature Matrix

Implemented core: authentication, protected dashboard, website CRUD, draft/publish, reusable Master Template, live preview, public `/site/[slug]`, demo, template catalog, analytics events, admin gate, Supabase relational schema, Cloudinary/Google/Gmail SMTP configuration hooks, Vercel Supabase build fix.

Architecture included: gallery, music, videos, timeline, memories, wishlist, guestbook, notifications, email templates, media, settings, demo sites, analytics and admin management routes.

Future-ready modules: premium templates, AI birthday message, AI theme generator, AI image generator, mobile app, PWA and team accounts.


## Phase 1/3/4 implementation
- Profile avatar + bio: `profiles` + builder `profile` content.
- Recipient links: `content.recipients`, public `?recipient=` URLs, `/api/public/interactions`, `/api/recipient-analytics`.
- QR + OG: QuickChart QR in the public experience and `/api/og?slug=...` dynamic Open Graph image.
- Growth: share buttons, referral code, Made with badge, badges, group birthday, collaborative wishes, live reactions.
- Advanced: time capsule, browser print-to-PDF, language translations, Google Photos integration hook.

### Required setup
Run `supabase/migrations/004_growth_advanced.sql` (or the full `supabase_schema.sql`) in Supabase. Google Photos requires Google Cloud OAuth/Pick­er credentials; the UI remains graceful when those credentials are not configured.
