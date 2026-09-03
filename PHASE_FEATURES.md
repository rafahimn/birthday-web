# Phase 1/3/4 feature upgrade

Implemented in this package:
- Creator profile avatar/bio
- Personalized recipient links with `?recipient=...`
- Per-recipient event analytics API + builder analytics view
- QR sharing + dynamic OG image
- Made with badge, referrals, WhatsApp/Messenger sharing
- Gamification badges
- Group Birthday Mode
- Admin Template Spotlight
- Time Capsule
- Collaborative Wishes
- Live Reaction / Emoji Rain
- Browser Save/Print to PDF
- Multi-language content selector + translations
- Google Photos Picker OAuth/session/list/import flow (requires Google Cloud credentials)

Database:
Run `supabase/migrations/004_growth_advanced.sql` in Supabase, or run the complete `supabase_schema.sql`.

Optional integrations:
- Google Photos: `GOOGLE_PHOTOS_CLIENT_ID`, `GOOGLE_PHOTOS_CLIENT_SECRET`, `GOOGLE_PHOTOS_REDIRECT_URI`

The public birthday template keeps the existing experience and adds the new feature panel without replacing the original flow.
