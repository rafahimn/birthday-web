# Birthday Builder SaaS

This package is the complete architectural foundation based on the supplied original HTML and requested SaaS structure. The original reference is preserved at `docs/master-template-reference.html.txt`.

## Routes
Home, Demo, Templates, Features, Pricing, FAQ, Contact, Login, Signup, Dashboard, Builder, Published `/site/[slug]`, Admin.

## Core stack
Next.js 14, React, TypeScript, Tailwind, Prisma/PostgreSQL, Cloudinary, Resend, Vercel.

## Data model
Users, websites, templates, analytics events, notifications, settings. Website content is a reusable JSON contract so all templates share one builder data model.

## Required production wiring
Auth/email verification/reset, database persistence, RLS/authorization, Cloudinary signed upload, full CRUD APIs, publish/unpublish, analytics, admin CRUD, rate limiting and complete pixel-level migration of the supplied HTML/CSS/JS into the Master Template.

## Setup
Copy `.env.example` to `.env.local`, install dependencies, run `npx prisma generate`, `npx prisma db push`, then `npm run dev`.