# Open Care – Frontend Testing Plan & Strategy

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
