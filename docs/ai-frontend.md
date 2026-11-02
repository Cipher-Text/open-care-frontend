# Open Care Frontend — AI Rules (Bylaws)

Last updated: 2026-10-31
Applies to: Frontend repository only
Depends on: docs/ai-context.md (constitution). If conflict, ai-context.md wins.

## 1) Stack & Defaults

- Framework: Next.js 15 (App Router) with React 19, TypeScript, Tailwind CSS 4
- Styling/UI: shadcn/ui components (`src/components/ui`) on Radix, with color tokens from `src/app/globals.css`. Do not introduce a new UI framework unless asked.
- State management: TanStack React Query for server data, React Hook Form with Zod for forms. Do not add a new one unless asked.
- Language files: next-intl for the public pages (see 10b).
- Route groups: `src/app/(site)/[locale]/` holds the public pages (English and Bangla); `src/app/(app)/` holds sign-in, signup, logout, `/account` and the `/admin` console (English only).

## 2) Frontend Responsibility Boundaries (Non-negotiable)

- Frontend does NOT own business logic.
- Frontend does NOT enforce security decisions (backend must enforce).
- Frontend can do UX validation (required fields, formats) but backend remains source of truth.
- Do not embed secrets in the frontend (API keys, service credentials).

## 3) Project Structure & Conventions

- Respect existing folder conventions (app router vs pages router, components layout, naming).
- Prefer shared, reusable components for repeated UI patterns.
- Keep components small and focused:
  - UI components: rendering only
  - Feature components/hooks: data fetching + UI wiring

## 4) Data Fetching Rules

- Use the repo’s existing data fetching pattern:
  - fetch/axios wrapper, React Query, SWR, server actions, etc.
- Centralize API calls in a `lib/api` (or existing) layer.
- Use typed DTOs/interfaces matching backend contracts.
- Handle loading/error/empty states for every list page.
- Never guess endpoints: search repo or require explicit API contract.

## 5) Auth & Session Handling

- Auth is via Keycloak (OIDC/JWT): the backend issues the tokens, the web app keeps them in cookies (`src/lib/auth.ts`) and `src/middleware.ts` guards `/admin` and `/account`. Logging out also ends the Keycloak session (`src/app/(app)/logout/actions.ts`).
- Keep token handling secure:
  - do not store tokens in localStorage (the browser holds no token at all: tokens are httpOnly cookies, signed-in calls go through `/api/bff/...` (`src/app/api/bff/[...path]/route.ts`, which adds the token and renews it), and who is signed in comes from `GET /api/session`; use `apiGet`/`apiPost` from `src/lib/api-client.ts`, never a hand-made Authorization header in client code)
  - menus and guards come from `src/config/navigation-rules.ts`; the API still enforces every permission
- UI permission checks are for UX only (hide/show), not for security.

## 6) UX Standards (Consistency)

- Always include:
  - loading indicators
  - error message with retry action (when feasible)
  - empty-state message with CTA (when feasible)
- Forms:
  - clear validation messages
  - prevent double-submit
  - show success toast/feedback if repo uses it
- Accessibility:
  - proper labels for inputs
  - keyboard focus for dialogs
  - avoid div-only clickable elements without button semantics

## 7) Performance Rules

- Avoid unnecessary re-renders (memoize heavy components if needed).
- Prefer server rendering where repo pattern supports it (Next.js SSR/Server Components).
- Use pagination/virtualization for long lists if needed.
- Optimize images using Next/Image if that is already used.

## 8) Internationalization (If Applicable)

- If repo supports Bangla/English:
  - use existing i18n framework and translation keys
  - never hardcode long Bangla text inside components if translations exist

## 9) Testing Bylaws (Minimal Must-Haves)

- The only test setup is Node's built-in runner (`node --test`), with three scripts: `npm run test:nav` (menu and guard rules for all roles, 20 tests), `npm run test:i18n` (name helper, error messages, matching Bangla and English message files, 13 tests) and `npm run test:pricing` (8 tests). Run `test:nav` after changing `navigation-rules.ts` or the role snapshot, and `test:i18n` after changing a message file.
- `npm run docs:access` regenerates `opencare/docs/reference/ACCESS_MATRIX.md` from `src/config/role-permissions.fixture.json`; refresh the fixture first.
- CI runs only the build, not these tests. No component or browser tests exist (see `docs/testing-frontend.md`); say so when a screen was not checked in a browser.
- Add tests only where they provide real value:
  - critical form validation
  - critical rendering paths
  - basic navigation smoke tests (if e2e exists)
- Do not introduce a new test framework unless asked.
- Signed-in and console screens are English only, except the texts of the three agreement screens (health data consent, blood donor choice, prescription consent request), which `src/lib/consent-text.ts` holds in English and Bangla and `components/common/Bilingual.tsx` shows side by side. Public Bangla pages today: home, doctors list, doctor page (with reviews), blog, hospitals list and hospital page; the other public pages are not translated yet and are marked `noindex` under `/bn`. Bangla text was written by the team and needs a native review.

## 10) UI & API Contract Discipline

- Do not rename fields coming from backend; map them at the boundary if needed.
- Keep date/time formatting consistent.
- Keep pagination/filter query params consistent across pages.

## 10b) Languages (English and Bangla)

- Public pages live in `src/app/(site)/[locale]/`: English at the current URLs, Bangla under `/bn`. Sign-in, account and console routes are in `src/app/(app)/` and are English only. Do not move a public page out of `[locale]`, and do not put a console page inside it.
- All text on a public page goes in `src/messages/en.json` and `bn.json` (same keys in both; a missing Bangla key falls back to English). No hard-coded sentences in components. Use `useTranslations` (or `getTranslations` in async server code), never string concatenation for sentences, and ICU plurals for counts.
- Links between public pages use `Link` from `@/i18n/navigation`. Links to `/login`, `/signup`, `/account`, `/admin` use `next/link`.
- Every public page calls `setRequestLocale(locale)` when it uses translations, and `[slug]` pages export `generateStaticParams` returning `[]`, so they stay statically cached. Never read `cookies()` or `headers()` in a public page or the layout: it turns off caching.
- A page that exists in Bangla sets `...bilingual(locale, path)` (`src/i18n/seo.ts`) in its metadata for canonical, `hreflang` and `index`. A page not translated yet is marked `noindex` under `/bn` by the layout.
- Numbers and dates go through `src/lib/format.ts`, so Bangla gets Bangla digits. Show `bnName` as the main name when the language is Bangla, and never show a copy of the English name twice.
- Tests for this: `npm run test:i18n` (the Bangla and English message files have the same keys and placeholders; the name helper). Names come from `src/lib/names.ts` (`localizedNames`, `placeName`, `enumName`), which reads the language of each value from its letters because the imported data sometimes swaps `name` and `bnName`.
- Bangla text is written by the team and must be checked by a native reader before release, especially legal and medical wording.

## 11) Output Format for AI Changes

When generating code, always include:

- Files created/modified
- New/changed routes/pages
- Components added
- How to run locally (dev/build/lint)
- Any assumptions clearly labeled
