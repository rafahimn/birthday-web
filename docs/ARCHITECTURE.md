# Birthday Builder Architecture

This project keeps the requested SaaS structure: public website, live demo, auth, member dashboard, builder, reusable master template, published sites, admin modules, template catalog, database models, media abstraction, API routes, analytics and deployment configuration.

## Master Template
`docs/master-template-reference.html.txt` is the supplied original HTML reference. The React `MasterTemplate` preserves its core interaction model: countdown-ready content, typewriter greeting, candle interactions, cake cut state, section navigation, photo/video/letter/secret areas, music and configurable effects.

## Production integrations
- PostgreSQL via Prisma (`DATABASE_URL`)
- Cloudinary environment variables for media
- Resend environment variables for transactional email
- Vercel build uses `prisma generate && next build`

## Security
- HTTP-only session cookie
- bcrypt password hashing
- user ownership checks on website APIs
- admin role gate
- Prisma relational constraints
- input validation for authentication

## Routes
Public: `/`, `/demo`, `/templates`, `/features`, `/pricing`, `/faq`, `/contact`, `/login`, `/signup`.
Member: `/dashboard`, `/builder/new`, `/builder/[id]`.
Published: `/site/[slug]`.
Admin: `/admin`.
APIs: `/api/auth/*`, `/api/websites`, `/api/websites/[id]`, `/api/publish`, `/api/upload`, `/api/templates`, `/api/analytics`.
