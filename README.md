# Dynamic Youth Empowerment & Advocacy (YEA) website

The website and member app for the **Dynamic Youth Empowerment & Advocacy (YEA)**,
built with [Astro](https://astro.build), [Supabase](https://supabase.com) and
Tailwind CSS.

## Features

- **Home**: a static, fast-loading landing page with a hero, mission, offerings, a story video and a community gallery.
- **Programs**: YEA's core areas of impact.
- **Courses**: digital skills courses with modules. Signed-in users can enrol (`enrollments`, unique on `(user_id, course_id)`).
- **Mentorship**: a mentor directory. Signed-in users can send a mentorship request (`mentor_requests`, unique on `(mentee_id, mentor_id)`).
- **Events**: event listings and registration. Each registration gets a QR code for check-in (`event_registrations`, unique on `(user_id, event_id)`).
- **Jobs**: industry opportunities. Signed-in users can apply (`applications`, unique on `(job_id, applicant_id)`).
- **Accounts**: sign in, sign up and sign out with Supabase Auth.

Forms use [Astro Actions](https://docs.astro.build/en/guides/actions/), so they
work even with JavaScript turned off.

## Getting started

Requires Node.js 22.12 or newer.

```sh
npm install
cp .env.example .env    # then add your Supabase URL and public key
npm run dev             # http://localhost:4321
```

The site runs without Supabase keys. Pages that need data show a setup hint
until the keys are added.

## Adding images and videos

Every image and video has a named slot with a placeholder. Save a file with the
slot's name into `src/assets/images/` or `src/assets/videos/` and it replaces
the placeholder. See [src/assets/README.md](src/assets/README.md) for the full
list of slots and recommended sizes.

## Project structure

```
src/
  actions/index.ts        form handlers (sign in, enrol, register, apply, request)
  assets/images, videos   your media files (see src/assets/README.md)
  components/             header, footer, page banner, media slots
  layouts/BaseLayout.astro
  lib/                    Supabase client, media slots, date helpers
  middleware.ts           loads the signed-in user for each request
  pages/                  one file per route
  styles/global.css       Tailwind theme (brand colours, fonts)
```

## Database

Create the tables in Supabase with **Row Level Security enabled** on each, with
policies that let users read and change only their own rows. Add these composite
**UNIQUE constraints** to prevent duplicates:

- `enrollments`: `(user_id, course_id)`
- `mentor_requests`: `(mentee_id, mentor_id)`
- `event_registrations`: `(user_id, event_id)`
- `applications`: `(job_id, applicant_id)`

Also create a public storage bucket called `qr-codes` for event check-in QR codes.

## Scripts

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server                          |
| `npm run build`   | Type-check, then build for production         |
| `npm run preview` | Preview the production build locally          |
| `npm run check`   | Type-check `.astro` and `.ts` files           |

## Deployment

Configured for [Vercel](https://vercel.com) with `@astrojs/vercel`. Import the
repository in Vercel and set `PUBLIC_SUPABASE_URL` and
`PUBLIC_SUPABASE_PUBLISHABLE_KEY` under **Project Settings → Environment
Variables**. To host elsewhere, swap the adapter in `astro.config.mjs` (for
example `@astrojs/node`).

## License

This project is provided for educational purposes and is not licensed for commercial use.
