# Codex Project Instructions (YEA Foundation Web App)

## Project Overview
This is a Next.js App Router app for the Youth Empowerment Africa (YEA) Foundation.
It uses Supabase (SSR + browser clients) for auth and data, and Tailwind CSS for styling.

## Stack
- Next.js App Router (`app/`)
- React 18 + TypeScript
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Tailwind CSS
- Package manager: pnpm

## Key Paths
- `app/`: routes and server components
- `components/`: shared UI
- `utils/supabase/`: Supabase client helpers
- `middleware.ts`: auth gating for `/login` and `/dashboard`

## Conventions
- Prefer server components by default; use client components only when necessary.
- Use `utils/supabase/server.ts` for server-side Supabase access.
- Use `utils/supabase/client.ts` for browser/client components.
- Keep auth flow consistent with `middleware.ts` redirects.
- Match existing code style in a file (quotes, formatting) instead of enforcing a new style.

## Environment
Required env vars (see `README.md`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, server only)
- `NEXT_PUBLIC_BASE_URL`

Do not edit `.env.local` unless asked.

## Commands
- `pnpm install`
- `pnpm dev`
- `pnpm lint`
- `pnpm build`

Run `pnpm lint` for TypeScript/TSX changes when feasible.
