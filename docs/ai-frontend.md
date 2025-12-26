# Open Care Frontend — AI Rules (Bylaws)

Last updated: 2025-12-26
Applies to: Frontend repository only
Depends on: docs/ai-context.md (constitution). If conflict, ai-context.md wins.

## 1) Stack & Defaults

- Framework: Next.js (React)
- Language: TypeScript (preferred). If repo is JS, follow existing.
- Styling/UI: Follow existing repo standard (Tailwind/MUI/shadcn/etc.). Do not introduce a new UI framework unless asked.
- State management: Use existing approach (React Query/SWR/Redux/Zustand/etc.). Do not add a new one unless asked.

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

- Auth is via Keycloak (OIDC/JWT) (follow repo implementation).
- Keep token handling secure:
  - prefer httpOnly cookies if already used
  - avoid storing tokens in localStorage unless that is existing repo standard
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

- Follow existing test setup (Jest/Vitest/Playwright/Cypress).
- Add tests only where they provide real value:
  - critical form validation
  - critical rendering paths
  - basic navigation smoke tests (if e2e exists)
- Do not introduce a new test framework unless asked.

## 10) UI & API Contract Discipline

- Do not rename fields coming from backend; map them at the boundary if needed.
- Keep date/time formatting consistent.
- Keep pagination/filter query params consistent across pages.

## 11) Output Format for AI Changes

When generating code, always include:

- Files created/modified
- New/changed routes/pages
- Components added
- How to run locally (dev/build/lint)
- Any assumptions clearly labeled
