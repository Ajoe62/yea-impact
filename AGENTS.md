# AGENTS.md

This guide defines how contributors (human or AI agents) should work in the **yea-impact** repository.

It is based on the current repository layout, existing implementation patterns, and configuration files. Use this as the default standard for edits and new features.

## 1) Project Snapshot

- **Framework:** Next.js App Router (`app/` directory).
- **Language:** TypeScript (`strict: true` in `tsconfig.json`).
- **Styling:** Tailwind CSS + global CSS layers.
- **Data/Auth backend:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`).
- **Animation/UI libs:** `framer-motion`, `keen-slider`.
- **Package manager:** `pnpm` (locked via `packageManager` in `package.json`).

## 2) Repository Structure (Current)

- `app/` â€” routes, pages, and feature-level server/client code.
  - Route families: `courses`, `events`, `jobs`, `mentorship`, `login`.
  - Route-local server actions are colocated in files like `*-actions.ts`.
- `components/` â€” reusable UI and layout components.
  - `components/ui/` for lower-level reusable UI primitives.
- `hooks/` â€” reusable client hooks.
- `utils/supabase/` â€” Supabase client factories for server and browser.
- `public/images/` â€” static image assets.
- `types/` â€” ambient type declarations.
- Config files at repo root: `package.json`, `tsconfig.json`, `tailwind.config.js`, `next.config.js`, `postcss.config.js`, `.stylelintrc.json`.

## 3) Core Architectural Rules

### 3.1 App Router boundaries

- Default to **Server Components** in `app/`.
- Use `"use client"` only where browser APIs, interactivity, or hooks are required.
- Put mutations in **Server Actions** with `"use server"`.
- Keep fetch-heavy and secret-aware logic on the server side.

### 3.2 Supabase usage

- Use `createServer()` from `utils/supabase/server.ts` in server components/actions.
- Use `createClient()` from `utils/supabase/client.ts` in client components only.
- Never expose service-role credentials in client code.
- Prefer RLS-safe queries and assume authenticated-user scoping in write operations.
- Handle known Supabase error cases explicitly (especially unique constraint violations).

### 3.3 Routing and feature organization

- Keep feature logic close to its route segment:
  - `app/<feature>/page.tsx` for list/landing views.
  - `app/<feature>/[id]/page.tsx` for detail views.
  - `app/<feature>/[id]/*-form.tsx` for client forms.
  - `app/<feature>/[id]/*-actions.ts` for server mutations.
- Reuse shared components for repeated UI patterns.

## 4) Coding Style Standards

### 4.1 TypeScript

- Maintain strict typing discipline (`strict: true`).
- Prefer explicit interfaces/types for API row shapes and component props.
- Avoid broad `any`; if temporary casts are unavoidable, keep scope minimal and comment why.
- Keep path aliases consistent (`@/*`, `@components/*`, `@utils/*`).

### 4.2 React

- Keep components focused; split large components when logical boundaries exist.
- Use semantic HTML and accessibility attributes (`aria-*`, labels, keyboard-focus states).
- Prefer predictable state flows in client components.

### 4.3 Styling

- Use Tailwind utility classes as the first choice.
- Use `app/globals.css` layers for shared utilities/base tokens only.
- Keep responsive behavior aligned with Tailwind breakpoints (and custom `xs` if needed).
- Preserve visual consistency with existing YEA green palette in `tailwind.config.js`.

### 4.4 File naming and conventions

- Routes: `page.tsx`, `layout.tsx` per Next.js conventions.
- Server actions: `*-actions.ts`.
- Client forms: `*-form.tsx`.
- Hooks: `use*.ts`.
- Remove backup/temporary file suffixes (`.bak`, `.new`) before merging.

### 4.5 Imports and formatting

- Keep import groups stable and ordered (framework, third-party, internal).
- Prefer one quote style per file; follow local file style when editing.
- Avoid unnecessary churn (do not reformat unrelated files in same change).

## 5) Configuration Awareness

### 5.1 Runtime/env contract

Expected env vars (from current examples and runtime usage):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (QR/check-in links)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, optional by feature)

When adding new env vars:

1. Add them to `.env.example` and `.env.local.example`.
2. Document usage in `README.md`.
3. Keep naming explicit and environment-safe.

### 5.2 Dependency and script contract

- Use `pnpm` commands for all package operations.
- Existing scripts:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm start`
  - `pnpm lint`
- If adding a new mandatory quality gate (e.g. tests/typecheck), define it in `package.json` scripts and document in `README.md`.

## 6) Quality Gates Before Merge

Run these checks locally for meaningful code changes:

1. `pnpm lint`
2. `pnpm build` (for route/component or config changes)
3. Feature-focused manual validation in `pnpm dev`.
4. Security audit and vulnerability checks:
   - `pnpm audit --audit-level=high` for dependency vulnerabilities.
   - `pnpm dlx better-npm-audit audit --level high` (optional secondary check when available).
   - Secret scan before commit using patterns like `rg -n "(SUPABASE_SERVICE_ROLE_KEY|BEGIN (RSA|OPENSSH) PRIVATE KEY|AKIA[0-9A-Z]{16})" .`.

If high/critical vulnerabilities are found, do not merge until they are patched, mitigated, or explicitly risk-accepted in the PR.

For data mutations:

- Validate auth-required flows.
- Validate duplicate-submission handling.
- Confirm success and error UI states.

## 7) README and Documentation Standards

- Keep README accurate to the codebase and setup flow.
- Remove stale/generated citation artifacts or external-reference placeholders.
- Document any new feature route, env var, migration requirement, or operational caveat.
- For major structural changes, include a short â€œArchitecture Notesâ€ section.

## 8) How to Bring Existing Files Into Compliance

Use this incremental cleanup process:

1. **Delete stale artifacts:** remove `.bak` / `.new` files once replacements are confirmed.
2. **Normalize style drift:** standardize quote style and import order only when touching a file.
3. **Reduce oversized files:** split very large pages into route-local subcomponents.
4. **Harden typings:** replace `any` and broad casts with concrete types where feasible.
5. **Consolidate CSS:** avoid duplicated global stylesheets unless both are intentionally used.
6. **Align docs/config:** keep README/env examples/scripts synchronized.

Do these changes in small PRs to reduce risk.

## 9) Rules for New Files (Future-proofing)

When adding new code, follow this checklist:

- [ ] Put code in the correct layer (`app`, `components`, `hooks`, `utils`, `types`).
- [ ] Use Server Component by default; opt into client only when necessary.
- [ ] Keep server actions close to the route and enforce auth/validation.
- [ ] Add/extend TypeScript types for new data contracts.
- [ ] Use existing design tokens/utilities before inventing new ones.
- [ ] Add docs/env/script updates if setup/runtime changed.
- [ ] Run lint/build checks before commit.

## 9.1) AGENTS.md reference policy (all files)

To keep this guide visible and enforceable, all tracked files in this repository should reference `AGENTS.md`:

- For code/config files that support comments (`.ts`, `.tsx`, `.js`, `.css`, `.md`, `.env*`), include a short top-of-file note pointing to `/AGENTS.md`.
- For strict JSON files, include an `agentGuide` field where it is safe to do so.
- Any newly added file must include this reference at creation time.

## 10) Commit and PR Expectations

- Keep commits focused and descriptive.
- PR description should include:
  - what changed,
  - why it changed,
  - how it was validated,
  - any env or migration impact.
- Include screenshots for visible UI changes.

## 11) Non-goals / Anti-patterns

- Donâ€™t move secret-aware logic into client components.
- Donâ€™t bypass RLS assumptions with unsafe query patterns.
- Donâ€™t introduce new global styles for one-off component needs.
- Donâ€™t commit temporary files, dead experiments, or commented-out legacy blocks.

---

If a contributor must deviate from this guide, they should document the rationale in the PR and (if permanent) update this AGENTS.md accordingly.
