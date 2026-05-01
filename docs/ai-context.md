# Open Care — AI Context (Constitution)

Last updated: 2025-12-26
Scope: Applies to ALL Open Care repos (frontend, backend, infra, tools).

## 1) Project Identity

Open Care is a healthcare information + service platform for Bangladesh that connects:

- Patients, Doctors, Nurses, Hospitals, Institutions, Organizations
  Core goals:
- Trustworthy directory + search
- Role-based dashboards
- Appointments / care services (now or planned)
- Secure health records (reports/prescriptions) with strict privacy
- Location-aware features (Bangladesh admin areas)
  Non-goals:
- Do not invent new product scope without explicit request
- Do not add features that change architecture unless asked

## 2) Ground Rules for AI (Must Follow)

- Prefer small, safe, reviewable changes over big rewrites.
- Do not guess API contracts, DB schema, or enums. If unclear:
  - search the repo for existing patterns, or
  - propose options and mark assumptions explicitly.
- Never silently change public interfaces (API routes, DTO shapes, table columns) unless requested.
- Keep naming consistent with existing codebase.
- Always keep backward compatibility unless explicitly told to break it.

## 3) Architecture & Boundaries

### Frontend vs Backend

- Frontend handles: UI, routing, forms, client-side validation, calling APIs, rendering.
- Backend handles: business rules, permissions enforcement, data validation, persistence, audit logging.
- No business logic duplication in frontend.

### Service boundaries (backend)

- Each service owns its data and rules.
- No cross-service database access.
- Inter-service calls should use existing patterns (REST/Feign now; messaging later if planned).

## 4) Security & Privacy (High Priority)

- Treat medical and personal data as sensitive by default.
- Do not log: passwords, OTPs, tokens, patient medical details, document URLs containing secrets.
- Enforce authorization on backend for every protected action.
- Use Keycloak as source of authentication identity (user id, roles/claims).
- Use least privilege: roles/permissions should be granular and explicit.

## 5) Data & Domain Language (Keep Consistent)

Key entities (examples, adapt to repo reality):

- Profile (base user identity)
- Doctor / Nurse (professional extensions)
- Hospital / Institution / Organization
- Appointment (scheduled interaction)
- Advertisement (campaign + targeting + logs)
- Location hierarchy (Division → District → Upazila → Union)
  Rules:
- Use consistent naming in code, DTOs, and UI labels.
- Do not rename domain terms casually.

## 6) API Contract Standards (If repo uses APIs)

### URL style

- Resource-based routes: `/doctors`, `/hospitals`, `/appointments`
- Use nouns, not verbs (except auth actions if needed)

### Pagination (preferred)

- `page`, `size`, optional `sort`
- Response includes: `items`, `page`, `size`, `total`

### Error shape (preferred)

Return a consistent JSON error object, e.g.

- `timestamp`
- `status`
- `error`
- `message`
- `path`
  (If repo already has a standard, follow existing.)

## 7) Coding Standards (General)

- Keep functions small and testable.
- Avoid “clever” code; prefer clarity.
- No dead code, no unused imports, no commented-out blocks.
- Add docs/comments only where intent is not obvious.

## 8) Testing Standards (Minimal but Real)

- Add/adjust tests for:
  - critical business rules
  - permission checks
  - serialization/deserialization contracts (DTOs)
- Prefer fast tests; avoid brittle UI snapshot tests unless already used.

## 9) Performance & Reliability

- Avoid N+1 queries and heavy synchronous loops over large datasets.
- Add indexes/migrations only when needed and consistent with existing migration tool.
- Use caching only when there is a clear hotspot and invalidation story.

## 10) AI Output Requirements (How to respond)

When generating changes, provide:

- What files changed
- Why each change is needed
- How to run/verify locally (commands)
- Any assumptions made (clearly labeled)

## 11) If You Are Unsure

If an instruction conflicts with the repo’s existing patterns:

1. Follow the repo’s existing pattern first.
2. Document the conflict and suggest an improvement path (optional).
