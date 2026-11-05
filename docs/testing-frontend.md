# Open Care – Frontend Testing Plan & Strategy

> Status (October 2026): **the rest of this document is still a plan** (Jest, RTL, MSW, Playwright, axe and Lighthouse are not installed; there are no component, integration or E2E tests, and no `type-check` script; type errors surface through `npm run build`). What exists today is a small set of pure-logic tests that run on Node's built-in test runner (`node --test`, no extra package), checked on October 31, 2026:
>
> | Script | What it runs | Result |
> |---|---|---|
> | `npm run test:nav` | `src/config/navigation-rules.test.ts`: menu, landing page and path guards for all 16 roles against `src/config/role-permissions.fixture.json`, plus grouping and Dashboard rules | 21 tests, all pass |
> | `npm run test:i18n` | `src/lib/names.test.ts` (Bangla/English name helper), `src/lib/api-error.test.ts` (error messages by code), `src/messages/messages.test.ts` (`en.json` and `bn.json` have the same keys, no empty message, same placeholders) | 14 tests, all pass (and `problemText`, the staff error text) |
> | `npm run test:pricing` | `src/lib/pricing-view.test.ts` and `src/lib/roadmap-copy.test.ts`: how the plans from the API become the pricing page, which features are marked Roadmap, and the hidden prices | 11 tests, all pass |
> | `npm run test:bff` | `src/lib/bff-proxy.test.ts`: the same-origin proxy's rules (client header on changes, path guard, headers sent and returned, one token refresh at a time) | 11 tests, all pass (now also the caller address rule, which refreshes end the session, and the refresh grace time) |
> | `npm run test:vitals` | `src/lib/reading-form.test.ts`: which cleared fields a change cannot remove, and when a reading is already replaced or deleted | 3 tests, all pass |
> | `npm run test:url` | `src/lib/safe-url.test.ts`: which link schemes are rendered (http, https, mailto, tel) and which are dropped | 4 tests, all pass |
> | `npm run test:blood` | `src/lib/blood-form.test.ts`: the blood requisition and donation form rules (required fields, phone, bags, age, dates, the payload sent) | 4 tests, all pass |
> | `npm run test:void` | `src/lib/prescription-void.test.ts`: the reason rule of the "written by mistake" form | 1 test, passes |
> | `npm run test:trend` | `src/lib/trend.test.ts`: the trend chart rules (which readings make a line, scaling, latest change) | 4 tests, all pass |
> | `npm run test:profile` | `src/lib/profile-form.test.ts`: the "Your details" form rules (fill, payload, checks, changed) | 4 tests, all pass |
> | `npm run test:cover` | `src/lib/cover-upload.test.ts`: which pictures can be uploaded as a blog cover | 2 tests, all pass |
> | `npm run test:consent` | `src/lib/consent-text.test.ts`: every agreement text has English and Bangla, no placeholders, the same number of sentences | 3 tests, all pass |
> | `npm run test:csp` | `src/lib/csp.test.ts`: the Content-Security-Policy (no framing or plugins, scripts only from the site and Google Analytics, eval and websockets only in development) | 3 tests, all pass |
> | `npm run test:shapes` | `src/lib/api-shapes.test.ts`: the page envelope, the capabilities, the open times, the consent request and the patient lookup are checked; a wrong shape is refused | 5 tests, all pass |
> | `npm run test:workspaces` | `src/lib/workspaces.test.ts`: which workspaces a person has (personal, doctor or platform, one per organisation) and which one a page belongs to | 7 tests, all pass |
> | `npm run test:dupes` | `src/lib/duplicate-view.test.ts`: the duplicate finder's view rules (when a check is worth sending, strong matches first, when a form stops, where each kind links) | 4 tests, all pass |
> | `npm run test:bulk` | `src/lib/bulk-view.test.ts`: the bulk upload's view rules (template CSV, which cells are sent back, the summary line, when Save is offered) | 4 tests, all pass |
> | `npm run test:contribution` | `src/lib/contribution-kind.test.ts`: the safe conversion of an article's plain text to HTML (paragraphs, escaping), the nine contribution kinds and their request keys, the "Contributor / Blood Donor / Health Partner level N" labels, and the nutritionist kind (a general kind, its own verification words and public page) | 9 tests, all pass |
>
> `npm run docs:access` is not a test: it writes `opencare/docs/reference/ACCESS_MATRIX.md` from the menu rules and the role snapshot (refresh the snapshot first). `npm run lint` runs `next lint`. **CI (`.github/workflows/ci.yml`) runs `npm ci`, the sixteen test scripts above and `npm run build` (then a Trivy scan); since November 1, 2026 the tests run there too.** Nothing here tests how a screen looks or behaves: most screens (verification, notifications, booking and schedule, enquiries, reviews, data access log, my prescriptions, my figures, plans, and the Bangla pages) have not been checked in a browser. The proxy and the session route were tried once in a browser on November 1, 2026 with a locally made token set as a cookie (no real Keycloak); the error and not-found pages were seen with a forced error. Suggested next targets: `src/lib/pagination.ts`, `src/hooks/use-url-params.ts`, `usePermissions`, the login flow with a real Keycloak, and the bulk-upload and role-permissions pages. Bangla wording needs a native reader; no test can check it.

> Scope: **Open Care Frontend (Next.js / React)**
> Audience: Frontend engineers, QA, reviewers
> Goal: Ensure **trust, safety, and stability** for a healthcare platform

---

## 1. Objectives

- Prevent critical user-facing bugs in:
  - Authentication & Role-Based Access (RBAC)
  - Doctor/Hospital Directory & Search
  - Profiles & Dashboards (Doctor, Patient, Admin, Institution)
  - Appointments & Schedules
  - File Uploads (reports, prescriptions)
  - Advertisement placements
- Enable **fast, safe releases** with automated quality gates

---

## 2. Quality Principles

- Test **user behavior**, not implementation details
- Prefer **automation over manual testing**
- Catch issues **before merge**, not after deploy
- Keep E2E tests **few but critical**

---

## 3. Test Pyramid (Target Distribution)

- **70% – Unit & Component Tests** (fast, isolated)
- **20% – Integration Tests** (page + state + API)
- **10% – End-to-End (E2E) Tests** (real user journeys)

---

## 4. Tooling Stack

### Unit & Component Testing

- Jest
- React Testing Library (RTL)
- MSW (Mock Service Worker) for API mocking

### Integration Testing

- RTL + MSW
- Next.js routing & page-level tests

### End-to-End (E2E)

- Playwright
- Headless in CI, headed locally when debugging

### Code Quality & Safety

- TypeScript (strict)
- ESLint + Prettier
- axe-core (accessibility)
- Lighthouse CI (performance)

---

## 5. Environments & Test Data

### Environments

- **Local**: MSW-mocked APIs or local backend
- **CI Preview**: automated tests + build
- **Staging**: full E2E regression before release

### Test Data Rules

- Use **fixed seed users per role**:
  - Admin
  - Doctor
  - Patient
  - Hospital/Institution Admin
- Use **stable seed entities**:
  - Doctors (5–10)
  - Hospitals (5)
  - Tests & services
  - Advertisements
- Automated tests must **never depend on live/production data**

---

## 6. What to Test

### 6.1 Unit Tests (Logic Only)

Test pure functions and utilities:

- Data formatters (date, time, currency)
- Validators (forms, file size/type)
- Permission & RBAC helpers
- API response mappers
- Query builders (search, filters, pagination)

Rules:

- No DOM
- No network
- No Next.js router

### 6.2 Component Tests (UI Behavior)

Test reusable UI components:

- Forms (valid, invalid, loading, disabled)
- Search & filter components
- Tables & lists (pagination, empty state)
- Skeletons & loaders
- Modals (confirm / cancel)
- File upload UI (drag/drop, progress, validation)

Guidelines:

- Avoid snapshot-heavy testing
- Assert **what user sees and does**

### 6.3 Integration Tests (Pages & Flows)

Test full pages with mocked APIs:

- Directory pages:
  - Load data
  - Apply filters
  - Pagination works
- Profile pages:
  - Doctor profile sections render
  - Schedule & availability display
- Dashboards:
  - Correct menu by role
  - Restricted sections hidden/blocked
- Advertisement blocks:
  - Correct placement loads
  - No-ad fallback UI works

### 6.4 End-to-End (E2E) Tests

#### Smoke Tests (Every PR)

1. Landing -> Directory -> Doctor Profile
2. Patient login -> Dashboard -> Logout
3. Admin login -> Admin dashboard access

#### Regression Tests (Staging / Pre-release)

1. Patient:
   - Search doctor
   - Book appointment
   - See confirmation/status
2. Doctor:
   - Login
   - View appointments
   - Update availability (if applicable)
3. File Access:
   - Upload report/prescription
   - Authorized user can view/download
   - Unauthorized access blocked
4. Ads:
   - Ad visible
   - Click opens target safely
   - No layout break
5. RBAC:
   - Wrong role -> access denied with proper UI

---

## 7. Non-Functional Testing

### Performance

- Monitor Core Web Vitals on:
  - Home
  - Directory
  - Profile
  - Dashboard
- Enforce:
  - Image optimization (Next Image)
  - Route-level code splitting
  - Avoid unnecessary re-renders

### Accessibility (Mandatory)

- Keyboard navigation works
- Forms & modals pass axe checks
- Proper labels, roles, focus handling

### Security (Frontend Scope)

- No sensitive data in localStorage
- Avoid `dangerouslySetInnerHTML`
- Strict file upload validation

### Localization (Bangla)

- Today: `npm run test:i18n` checks that the Bangla and English message files match (keys, placeholders). Rendering, wrapping and dates in Bangla are not tested.
- Bangla text rendering & wrapping
- Date/number formatting consistency

---

## 8. API Contract Strategy

- Use typed API clients generated from OpenAPI (Springdoc)
- Maintain mock fixtures aligned with backend contracts
- Update frontend tests when API version changes

---

## 9. CI/CD Quality Gates

### On Every Pull Request

- Type check
- Lint
- Unit & component tests
- Integration tests
- Next.js build
- Playwright smoke tests

### On Release / Staging

- Full Playwright regression
- Lighthouse CI performance budgets
- Upload test reports (HTML/JUnit)

---

## 10. Coverage & Priority Rules

Coverage is **risk-based**, not vanity-based.

Highest priority areas:

- Authentication & RBAC
- Search & filtering logic
- Appointment flows
- File/report access
- Advertisement rendering

Suggested baseline:

- Unit/component: ~70% overall
- Critical utilities & permissions: ~90%

---

## 11. Definition of Done (Frontend)

A feature is **DONE** only if:

- Unit tests added for core logic
- Component tests cover loading/error/empty states
- Integration test updated (if page-level change)
- E2E test updated (if critical journey affected)
- Accessibility checks pass
- User-friendly error handling implemented

---

**This document is mandatory for all Open Care frontend development.**

> **API contract (November 5, 2026; `docs/openapi.json` refreshed from a running backend the same day: 297 paths, 266 schemas, including the contribution and claim routes; the Elasticsearch routes are gone):** `npm run api:check` (in CI) regenerates `src/types/api.gen.ts` from the snapshot `docs/openapi.json` and fails when they differ; `src/types/api-contract.ts` makes `tsc` (so the build) fail when a screen's response type names a field the backend lacks or types it differently, with three self-tests that must be refused. The snapshot was 177 paths behind (290 now) when this was set up.
