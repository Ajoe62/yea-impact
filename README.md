> AGENTS.md reference: Follow repository contribution/security standards in `/AGENTS.md`.

# YEA Foundation Web App

This repository contains a Next.js application for the **Youth Empowerment Africa (YEA) Foundation**.  The app is built using the Next.js App Router and Supabase to provide a full‑stack experience with authentication, database interactions, and real‑time updates.  It demonstrates how to structure a modern full‑stack application with server components, server actions, client components and Tailwind CSS styling.

## Features

- **Programs** – overview of YEA’s seven core areas of impact.
- **Courses** – list of in‑demand tech skills courses.  Users can view course details and enrol.  Enrolments are stored in the `enrollments` table with a unique constraint on `(user_id, course_id)` to prevent duplicate enrolments【599959557569026†L383-L452】.
- **Mentorship** – directory of mentors.  Users can view mentor details and submit mentorship requests.  Requests are stored in `mentor_requests` with a unique constraint on `(mentee_id, mentor_id)` and are protected by Row Level Security【742530328472577†L266-L344】.
- **Events** – list of upcoming events.  Users can view event details, register for an event, and receive a QR code for check‑in.  Registrations are stored in `event_registrations` with a unique constraint on `(user_id, event_id)`; a token is generated and stored to verify attendance.
- **Jobs** – list of industry opportunities.  Users can view job details and apply.  Applications are stored in `applications` with a unique constraint on `(job_id, applicant_id)` to prevent duplicates.
- **Authentication** – email/password auth plus Google OAuth using Supabase Auth. Server actions encapsulate sign‑in/sign‑up/OAuth logic and redirect upon success.
- **Reusable server actions** – server actions are used for enrolment, registration, mentorship requests and job applications.  They handle auth checks, enforce unique constraints and return friendly error messages.

## Getting Started

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-org/yea.git
   cd yea
   ```

2. **Install dependencies**

   This project specifies pnpm as its package manager via the `packageManager` field in
   `package.json`.  After installing pnpm globally (e.g. using
   `corepack enable`), run:

   ```sh
   pnpm install
   ```

   If you already have a `package-lock.json` from npm, you can convert it to
   pnpm’s lockfile by running `pnpm import`.  This step is optional but will
   help pnpm reproduce the exact dependency tree used by npm.

3. **Configure environment variables**

   Copy the provided `.env.local.example` file to `.env.local` and set the following variables:

   ```sh
   cp .env.local.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` – your Supabase anon/public key.
   - `SUPABASE_SERVICE_ROLE_KEY` – (optional) service role key used only on the server.
- `NEXT_PUBLIC_BASE_URL` – the base URL of your deployed app (e.g. `https://your-app.vercel.app`). Used for auth email redirects and generating QR/check-in links.
  - Add `${NEXT_PUBLIC_BASE_URL}/auth/callback` to Supabase Auth allowed redirect URLs for Google sign-in.

4. **Set up the database**

   Create tables in your Supabase project according to the schema described in the application.  Ensure that **Row Level Security (RLS) is enabled** on each table and that appropriate policies are written so users can only see and modify their own data【742530328472577†L266-L344】.  Add composite **UNIQUE constraints** on the following tables to prevent duplicates:

   - `enrollments`: unique on `(user_id, course_id)`【599959557569026†L383-L452】.
   - `mentor_requests`: unique on `(mentee_id, mentor_id)`.
   - `event_registrations`: unique on `(user_id, event_id)`.
   - `applications`: unique on `(job_id, applicant_id)`.

   Additionally, create a **storage bucket** called `qr-codes` for saving generated QR code images.

5. **Run the development server**

   ```sh
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Deployment

This application is designed to be deployed to Vercel.  The official Vercel × Supabase integration automatically injects Supabase environment variables and handles auth redirect URIs【463067303551720†screenshot】.  After linking your repository to Vercel, set the environment variables under **Project Settings → Environment Variables** or use the integration to have them created automatically【699162111592830†screenshot】.  When deploying to production, set `NEXT_PUBLIC_BASE_URL` to the Vercel URL of your app.

## Notes

- The app uses Next.js **App Router** with server components for data fetching and server actions for performing mutations.  See Supabase’s documentation on server actions vs. API routes for more details【422027496979845†L232-L304】.
- For simplicity, this project does not include user dashboards or admin management pages, but the structure allows you to add them easily by creating protected routes and writing additional server actions.
- If you encounter problems generating QR codes, ensure that the `qrcode` package is installed and that the `qr-codes` storage bucket is configured in Supabase.

## License

This project is provided for educational purposes and is not licensed for commercial use.
