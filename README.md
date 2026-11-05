# OpenCare - Healthcare Made Simple

A comprehensive healthcare management platform built with Next.js that connects patients with certified doctors, hospitals, ambulance services, and blood banks across Bangladesh.

> Status (October 2026): the type check, lint and the three small Node test scripts below pass, but **most screens were not tried in a browser** (the newer ones in particular: verification, notifications, booking, schedule, enquiries, reviews, who looked, my prescriptions, my figures, plans). The Bangla text was written by the team and needs a native review before release. Source of truth per feature: `opencare/docs/features/`.

## 🌟 Features

### Patient Services

- **Doctor Directory**: Find verified doctors across specialties
- **Hospital Directory**: Browse hospitals with URL-state filters and an Email button on each card
- **Bangla**: the home page, doctors list, doctor page (with reviews), blog and hospitals list and page also exist in Bangla under `/bn`; the other public pages and every signed-in screen are English only
- **Ambulance Directory**: Public list of ambulance services, plus a red 999 emergency pill in the header
- **Institutions**: Public institutions directory
- **Blood donors and requisitions**: Managed in the admin dashboard (no public blood page yet)

Signed-in patients (`/account`, English only): ask a verified doctor for a chamber visit (`/account/book`, `/account/appointments`), send a facility an enquiry (`/account/enquiry`), review a doctor after a completed visit (`/account/review`, `/account/reviews`), see their prescriptions (`/account/prescriptions`), see who looked at their data (`/account/data-access`), and claim or check verification (`/account/verification`). Booking is a request the doctor confirms; the phone-code step, payment and online sessions are not built.

Not built: telemedicine, GPS ambulance tracking.

### Admin Dashboard

- **Doctor Management**: Add, edit, and manage doctor profiles and specializations
- **Hospital Administration**: Comprehensive hospital data management
- **Blood Management**: Track blood donors, donations, and requisitions
- **Medical Specialties**: Manage medical specializations and departments
- **Medical Tests**: Catalog and manage available medical tests
- **Geolocation Management**: Administrative divisions, districts, and upazilas
- **Hospital management**: on `/admin/hospitals/[id]/view`, add and remove doctors, medical tests and amenities, and edit tags (each action needs its permission, tags and doctors need `update-hospital`)
- **Doctor Bulk Upload**: Import doctors from CSV with a dry-run preview
- **Prescriptions** (`/admin/prescriptions`, doctors with the prescription permissions): find a registered patient by exact phone, email or username, ask for consent, then write the prescription. List and search your own prescriptions, view, edit, and print or save as PDF from the browser
- **Blood donor choice** (on `/admin/profile` and `/account/profile`): the person ticks to be listed as a blood donor and chooses whether to show their phone and address; unticking withdraws. Calls `PUT /api/profiles/self/blood-donor`
- **My consents** (`/admin/consents`, any signed-in user): approve or decline a doctor's request and take back a consent you gave
- **Verification** (`/admin/verification`, `verify-doctor` or `verify-facility`): review doctor and facility requests; each case has a BMDC register check card (the reviewer looks the number up on the BMDC site and records the result; nothing is sent from the app). The admin doctors list can filter by verification status and by "verified more than the review period ago"
- **Notifications and message delivery**: `/admin/notifications` (everyone signed in) is the inbox; `/admin/notification-deliveries` (`view-user-activity`) lists queued text messages and email with retry and shows the SMS balance
- **Doctor practice**: `/admin/appointments` (answer visit requests), `/admin/my-schedule` (weekly hours and time off), `/admin/reviews` (what patients wrote), `/admin/my-figures` (page views, calls and directions, for doctors and hospital admins), `/admin/enquiries` (facility enquiries; reachable by URL, not in the menu)
- **Platform**: `/admin/review-moderation`, `/admin/data-access` (who opened other people's health data, prescriptions, profiles, the donor list and private files), `/admin/subscriptions` (Plans: put a doctor, facility or patient on a plan), `/admin/blog`
- **Role Permissions**: Edit which permissions each role has, with an audit log
- **Advertisements**: Create, edit and delete advertisements and advertisement types (the only admin lists whose Delete buttons work; the Delete buttons on the other lists, and Add, Edit or View buttons that had no page, were removed)
- **Analytics & Reports**: Healthcare facility performance insights

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ (matches the Dockerfiles)
- npm or yarn (`package.json` pins yarn 1.22; Docker builds use `npm ci`)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Cipher-Text/open-care-frontend.git
cd open-care-frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**

```bash
# Only NEXT_PUBLIC_API_BASE_URL is required; .env.dev/.env.qa/.env.prod hold per-environment values
cp .env.dev .env.local
```

4. **Start the development server**

```bash
npm run dev   # next dev --turbopack
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000). (`npm run start` serves the production build on port 5175.)

## 🏗️ Project Structure

```
open-care-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (site)/[locale]/   # Public pages in English (no prefix) and Bangla (/bn): home, doctors, hospitals, ambulances, institutions, blog, pricing, about, contact, privacy, terms. Its own root layout (html lang from the URL)
│   │   ├── (app)/             # English-only routes with their own root layout: (admin)/admin console, (account)/account, login, signup, logout, auth
│   ├── i18n/ messages/        # next-intl: routing (en, bn), request config (a missing Bangla message falls back to English), locale-aware Link, SEO helper; en.json and bn.json message files and their test
│   ├── components/            # admin, common, doctors, hospitals, home, ui
│   ├── api/                   # API client modules, one per backend resource
│   ├── contexts/              # Auth context
│   ├── hooks/                 # use-permissions, use-url-params, use-polling, use-mobile
│   ├── types/ validations/    # TypeScript types, Zod schemas
│   ├── config/                # config.ts (API base URL)
│   └── lib/                   # api-client, format (numbers and dates by language), fonts, auth, pagination (page-shape contract), public-stats (cached home stats), utils
│   ├── middleware.ts          # /admin and /account need a login; non-staff are sent to /account
│   ├── config/                # navigation-rules.ts (menu and guards), role-permissions fixture, nav test
├── docs/                      # Frontend docs, AI context, openapi.json (the feature docs live in opencare/docs/features)
├── scripts/                   # generate-access-matrix.ts (npm run docs:access)
├── public/                    # Static assets
├── Dockerfile{,.dev,.qa,.prod}, deploy.sh
└── .github/workflows/ci.yml
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router, Turbopack dev) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Custom components
- **Data fetching / tables**: TanStack Query and TanStack Table
- **Forms**: React Hook Form + Zod 4 validation
- **Icons**: Lucide React

### Backend Integration

- **API Base**: `https://api.opencarebd.com/api`
- **Authentication**: backend-issued Keycloak tokens stored in cookies (`access_token`), refreshed via `/auth/refresh`; `src/middleware.ts` guards `/admin` and `/account`
- **HTTP Client**: Fetch API

## 📱 Key Pages

### Public Pages

- **Homepage** (`/`) - Hero search, emergency strip with 999, live stats (server-cached, revalidated hourly), browse by place and facility type, claim-your-listing, FAQ
- **Doctors** (`/doctors`) - Browse and search doctors (real API, filters in the URL); `/doctors/[slug]` shows degrees, workplaces, associations and links
- **Bangla** (`/bn`, `/bn/doctors`, `/bn/doctors/[slug]`, `/bn/hospitals`, `/bn/hospitals/[slug]`, `/bn/blog`): the pages above plus the blog; `/bn/...` of any other public page shows English and is `noindex`
- **Hospitals** (`/hospitals`) - Hospital directory (real API, filters in the URL); `/hospitals/[slug]` shows contact buttons, directions, services and doctors
- **Ambulances** (`/ambulances`), **Institutions** (`/institutions`)
- **Pricing** (`/pricing?for=patients|doctors|hospitals`): Free, Plus and Pro for each audience, with prices and the features each plan includes read from `GET /api/plans` (the backend plans, so there is one place to change them) and the wording in `src/config/pricing-plans.ts`. If the API is unreachable the page says prices are unavailable. `npm run test:pricing` checks how the plans become the page. Paid plans are a waitlist (mailto) and roadmap features are labelled; nothing is sold or charged in the app yet
- **About**, **Contact**, **Privacy**, **Terms** (`/about`, `/contact`, `/privacy`, `/terms`)
- **Login/Signup** - `/login` and `/signup` (the "Forgot password?" link opens an email to support; there is no self-service reset page; logging out also ends the Keycloak session). Signup calls `POST /api/auth/register` (`src/api/register.ts`) and creates a regular `USER` account; passwords need an uppercase letter, a lowercase letter, a digit and one of `@#$%^&+=`

### Admin Dashboard (`/admin`)

- **Dashboard** (`/admin`) - one dashboard for everyone in the console: real directory totals, shortcuts for what your role can do, pending consent requests, and (super admin) the full system overview. A doctor sees their own practice instead of directory totals (`DoctorDashboard`, data from `GET /api/me/doctor-dashboard`): items needing attention, prescriptions and patients against the previous 30 days, 12-week trend, consent outcomes, follow-ups due, profile readiness, top diagnoses and medicines. `/admin/dashboard` redirects here. The old placeholder analytics and users pages with made-up figures were removed
- **Doctors, Nurses, Hospitals, Institutions** - Directory management; `/admin/doctors/bulk-upload` for CSV import
- **Associations / Social Organizations** - Organization management
- **Blood, Ambulances** - Donation and emergency services
- **Medical Specialities / Medical Tests / Degrees** - Reference data
- **Geolocation** - Divisions, districts, upazilas
- **Prescriptions** (`/admin/prescriptions`, `/new`, `/[id]`, `/[id]/edit`) and **My consents** (`/admin/consents`)
- **My doctor profile** (`/admin/doctors/me`, `view-doctor-panel`) opens the signed-in doctor's own record to edit (found through `GET /api/me/doctor`). The edit button in the Doctors list shows only on their own row, and `/admin/doctors/[id]` refuses another doctor's id, unless they administer doctors (`src/config/doctor-access.ts`, the same rule as the API's `DoctorAccess`). Doctors also get read-only **Institutions**, **Associations** and **Medicines** (`/admin/medicines`: search plus a searchable company dropdown) from `view-doctor-panel`
- **Bulk upload** (`/admin/bulk-upload`, Facilities menu, `create-hospital` or `delete-hospital`): add or change hospitals, ambulances or hospital test prices from a CSV, at most 50 rows (server setting); the rows appear in a preview where any cell can be edited or a row removed, then Check and Save (all rows or none) (`../opencare/docs/features/bulk-upload.md`).
- **Duplicate check** (`/admin/duplicates`, Facilities menu, any create or delete permission of hospitals, doctors, nurses or ambulances): look for a record by name or number, list records that share a name or number; the hospital and doctor add forms show similar records while typing, and a hospital with the same name in the same place needs "add anyway"; staff who may delete can delete one record of a pair that is the same (`../opencare/docs/features/duplicate-finder.md`).
- **Location review** (`/admin/location-review`, Facilities menu, `create-hospital` or `delete-hospital`): approve or refuse proposed upazilas and thanas for hospitals that have none, one by one or "Approve all address-confirmed"; a hospital that already has a place is never changed (`../opencare/docs/proposals/THANA_MAPPING.md` section 14).
- **Verification, Notifications, Message delivery (with the list of addresses not mailed), Appointments, My schedule, Reviews, Review moderation, My page figures, Data access log, Plans, Blog**: see the Admin Dashboard list above
- **Roles & Permissions** (`/admin/role-permissions`, needs `manage-role-permissions`)
- **Advertisement, Health vitals, Profile(s), Settings, Constants**

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration (see src/config/config.ts). Required for production builds; the build fails without it.
# Local development defaults to http://localhost:6700/api. Copy .env.example for the full list.
NEXT_PUBLIC_API_BASE_URL=https://api.opencarebd.com/api
```

### Sign in with Google

`/login` and `/signup` have a "Continue with Google" button. It goes through Keycloak (the realm's `google` identity provider), so the web app holds no Google secret: `/auth/google` sends the browser to Keycloak with `kc_idp_hint=google` and PKCE, Keycloak signs the person in with Google, and `/auth/google/callback` exchanges the one-time code for tokens on the server. The first time someone signs in, the callback calls `POST /api/profiles/self/ensure`: the backend creates their OpenCare profile (name and email from Google, type USER) and puts them in the standard `user` group, and the web app refreshes the token so it carries the roles. The district and other details are asked for afterwards in the account area.

Set these server-side variables (`.env.example`): `KEYCLOAK_URL`, `KEYCLOAK_REALM`, and optionally `KEYCLOAK_CLIENT_ID` (default `open-care-frontend`). Without the first two the button explains that Google sign-in is not available.

One-time setup in the Keycloak that serves the deployment (the deployed Keycloak is not changed by this repository):
1. **Google:** in Google Cloud, create an OAuth client (type Web application) and add the Keycloak broker address as its authorized redirect URI: `<keycloak>/realms/<realm>/broker/google/endpoint`.
2. **Identity provider:** in Keycloak, Identity providers, add or edit `google`: the Google client id and secret, and turn on **Trust Email** (Google verifies addresses).
3. **Client:** the `open-care-frontend` client must be public, with Standard flow on and "Proof Key for Code Exchange Code Challenge Method" set to `S256`. Add `<site>/auth/google/callback` to its **Valid redirect URIs** for every address the app runs on (for example `http://localhost:3000/auth/google/callback` for local development). Keycloak refuses the sign-in with `Invalid parameter: redirect_uri` until this is done.
4. **Same email as an existing account (chosen behaviour: link them):** duplicate the `first broker login` flow, and in its "Handle Existing Account" step remove "Confirm link existing account" and the account verification options, and add **Automatically set existing user**. Then set the `google` provider's "First login flow override" to the new flow. This is safe only because Trust Email is on and Google verifies addresses. As a backstop the backend refuses to create a second profile for an email that already has one (409).

### Dev one-click login

On `/login`, one-click buttons appear only when `NODE_ENV` is `development` (`npm run dev`), and the server action refuses to run otherwise. Put the accounts in `.env.local` (git-ignored, server-side only, never `NEXT_PUBLIC_`) as a JSON array, then restart the dev server:

```bash
DEV_LOGIN_ACCOUNTS='[{"label":"Super admin","username":"superadmin","password":"123456"},{"label":"Doctor","username":"doctor","password":"123456"}]'
```

The backend's local realm seeds one user per user type (see the backend README, "Seeded dev accounts"). Use accounts on a development backend, never a production admin.

### Conventions worth knowing

- **Pagination**: the backend returns `{content, currentPage (0-based), totalItems, totalPages}`. List fetchers go through `src/lib/pagination.ts` (`toWirePage`, `normalizePage`, `withWirePage`), so the UI always sees 1-based pages.
- **Rate limit**: the API allows 100 requests per minute per client. Share one `QueryClient` (`ClientProviders`), keep reference data on the 1 h stale time and avoid polling faster than needed (`usePolling`).
- **Detail pages** (`/doctors/[slug]`, `/hospitals/[slug]`) are addressed by slug, for example `/doctors/dr-md-sidur-rahman`. An old id link (`/doctors/123`) redirects permanently to the slug URL, and `src/lib/paths.ts` builds every link (falling back to the id for a record with no slug). They are server-rendered with a 10 minute cache via `src/lib/public-directory.ts`, carry a canonical URL, Open Graph tags and schema.org JSON-LD, and hide placeholder values such as "Not Available". They show only public professional fields: a doctor's phone, email, date of birth and blood group are never rendered.
- **Colors and controls**: every color comes from the tokens in `src/app/globals.css` (`primary`, `destructive`, `success`, `warning`, `emergency`, `chart-1` to `chart-5`, with a `.dark` theme), never from raw palette classes such as `bg-red-100` or `text-blue-600`, which ignore dark mode. The one exception is the print-only prescription document. Forms use `components/ui` (`Button`, `Input`, `Checkbox`, `Select`, and `NativeSelect` for a simple native dropdown) instead of raw `<button>`, `<input>` and `<select>`; hand-built tab and chip buttons are fine when they need their own active state.
- **Page headers**: admin pages open with `AdminHeader` (title, short description, actions on the right); public directory and information pages use `PageHero`. Do not write a page-level `<h1>` by hand.
- **Page counters**: `PublicEventTracker` (`src/components/common/PublicEventTracker.tsx`) on the doctor and hospital pages sends anonymous view, call and directions counts to `POST /api/public/events` (kind, slug and event type only, nothing about the visitor; nothing is sent when Do Not Track or Global Privacy Control is on). A link opts in with `data-track-event="CALL"` or `"DIRECTIONS"`.
- **Display names**: imported names can carry leading spaces and zero-width characters, so show them through `displayName` (`src/lib/text.ts`); the public detail data layer already does.
- **SEO**: `src/app/sitemap.ts` serves `/sitemap/0.xml` (static pages and blog posts) plus chunked hospital and doctor sitemaps (1,000 records each, cached for a day); the pages that exist in Bangla (home, doctors, hospitals, blog, and every doctor, hospital and blog page) are listed at both the English and the `/bn` address with language alternates, and `src/app/robots.ts` lists them and blocks `/admin`, `/login`, `/signup`, `/logout` and `/auth`. Set `NEXT_PUBLIC_SITE_URL` per environment (default `https://opencarebd.com`).
- **Menus, guards and landing**: `src/config/navigation-rules.ts` is the one list of who sees which console page (a person sees an entry when they hold any of its permissions). It drives the sidebar, the page guard in the admin layout, `src/middleware.ts` and the redirect after login. Staff (anyone with a console permission) land in `/admin`; everyone else lands in `/account` (home, profile, consents, health). The menu is grouped into People, Facilities, Reference data, Clinical, Platform and Account. Permissions come from `GET /api/me/capabilities` (Keycloak, so role changes apply without a new login) with the token as fallback. The Roles & Permissions screen has three tabs: Mapping (edit permissions), Menus (what each role will see, including changes not saved yet, with differences outlined) and History. `npm run docs:access` regenerates `opencare/docs/reference/ACCESS_MATRIX.md`. `npm run test:nav` (20 tests) checks the menu of all 15 roles against a snapshot of the live role mapping (`src/config/role-permissions.fixture.json`; refresh it after changing roles).
- **Page guards**: `RequirePermission` (`src/components/admin/require-permission.tsx`) wraps pages that need a permission (Profiles, Admin Dashboard, Role permissions). Permissions come only from the token; the old hardcoded role map was removed because it drifted from Keycloak. The API enforces the same permissions on every route
- **Sign-in tokens**: the browser holds none. They are httpOnly cookies; a signed-in call from the browser goes to the same-origin proxy `/api/bff/...` (`src/app/api/bff/[...path]/route.ts`), which adds the token, renews it when it has expired and forwards the caller's address; the screens learn who is signed in from `GET /api/session` (name, email, permissions, never the token). Use `apiGet`/`apiPost` from `src/lib/api-client.ts`; do not make an Authorization header in client code. Failures show `error.tsx` and missing pages `not-found.tsx` (English and Bangla for the public site).
- **Account menu**: one `UserMenu` in the admin top bar; the sidebar has no profile block.
- **Permissions**: UI hides actions with `usePermissions().hasPermission(...)`, which is only a convenience. The backend enforces access.

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server (port 5175)
npm run start

# Linting
npm run lint

# Tests (Node's built-in runner; not run in CI yet)
npm run test:nav       # menu and guards for all 16 roles (21 tests)
npm run test:i18n      # names, API error messages, en.json/bn.json parity (13 tests)
npm run test:pricing   # pricing page view, roadmap marks and hidden prices (11 tests)
npm run test:bff       # the same-origin proxy rules (11 tests)
npm run test:vitals    # the health readings screen rules (3 tests)
npm run test:url       # the link scheme rule (4 tests)
npm run test:blood     # the blood form rules (4 tests)
npm run test:void      # the prescription void reason rule (1 test)
npm run test:trend     # the health trend chart rules (4 tests)
npm run test:profile   # the profile details form rules (4 tests)
npm run test:cover     # the blog cover file rules (2 tests)
npm run test:consent   # the bilingual agreement texts (3 tests)
npm run test:csp       # the Content-Security-Policy (3 tests)
npm run test:shapes    # the answer checks: pages, capabilities, open times, consent (5 tests)
npm run test:workspaces # the workspace list and the current workspace (7 tests)
npm run test:dupes     # the duplicate finder's view rules (4 tests)
npm run test:bulk      # the bulk upload's view rules (4 tests)
npm run test:contribution  # article text to safe HTML, contribution kinds, level labels, the nutritionist kind (9 tests)

# Regenerate opencare/docs/reference/ACCESS_MATRIX.md from the menu rules and src/config/role-permissions.fixture.json
npm run docs:access
```

## 📊 Admin Features

### Blood Management System

`/admin/blood` is a read-only viewer (needs `manage-blood`); there is no screen to create or edit these records.

- **Donors**: Donor list (needs a login; Plus and Pro plans or staff; the screen sends the token)
- **Requisitions**: Blood requests (public data)
- **Donations**: Donation records (needs a login like the donor list; the screen sends the token)
- **Search & Filter**: Advanced filtering across all blood data

### Geolocation Management

Read-only viewer. Hospital, institution and association forms label the field "Upazila / Thana"; on the hospital forms upazila and union are optional and no longer default to 1.

- **Divisions**: Administrative divisions of Bangladesh
- **Districts**: District-level location data
- **Upazilas**: Sub-district administrative units, including thanas in metropolitan police areas
- **Hierarchical Data**: Parent-child location relationships

### Doctor Administration

- **Profile Management**: Complete doctor profiles
- **Specialization**: Medical specialty assignments
- **Verification Status**: Doctor verification workflow
- **Location Mapping**: Geographic distribution

## 🎯 Key Features

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces

### Performance

- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Caching strategies

### Accessibility

- Built on Radix UI primitives (keyboard and screen-reader support); no formal accessibility audit yet

## 🧪 Development

### Code Quality

- **ESLint**: Code linting
- **TypeScript**: Type safety

### Testing

Only small pure-logic tests exist (`test:nav`, `test:i18n`, `test:pricing`, `test:bff`, `test:vitals`, `test:url`, `test:blood`, `test:void`, `test:trend`, `test:profile`, `test:cover`, `test:consent`, `test:csp`, `test:shapes`, `test:dupes`, `test:bulk`, `test:contribution`, on Node's built-in runner); there is no component, browser or `type-check` script yet, and CI runs these tests and the build. See `docs/testing-frontend.md`. Type errors surface through `npm run build`.

## 📖 Documentation

Detailed documentation is available in the `/docs` directory:

- [Blood Management](docs/blood-management.md)
- [Geolocation Management](docs/geolocation-management.md)
- [Degrees Management](docs/degrees-management.md)
- [Advertisement Management](docs/advertisement-management.md)
- [Detail View Pattern](docs/detail-view-pattern.md)
- [Frontend Testing Plan & Strategy](docs/testing-frontend.md)
- [AI context](docs/ai-context.md), [AI frontend guide](docs/ai-frontend.md)

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
# Development
docker build -f Dockerfile.dev -t opencare-frontend:dev .

# QA
docker build -f Dockerfile.qa -t opencare-frontend:qa .

# Production
docker build -f Dockerfile.prod -t opencare-frontend:prod .
```

### Vercel Deployment

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new):

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on commits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the backend repository's LICENSE (no LICENSE file is present in this repo yet).

## 🆘 Support

For support and questions:

- **Email**: support@opencare.com.bd
- **Emergency Hotline**: +880-1777-999888
- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues

## 🏥 About OpenCare

OpenCare is a healthcare platform designed to make quality healthcare accessible to everyone in Bangladesh. We connect patients with verified healthcare professionals and provide essential services like emergency ambulance, blood bank networks, and telemedicine consultations.

---

**Made with ❤️ for healthcare accessibility in Bangladesh**

## Conventions (November 5, 2026)
- The API root is `/api/v1` (`NEXT_PUBLIC_API_BASE_URL`, for example `https://api.example.com/api/v1`); the backend answers the same routes under `/api` too.
- Browser calls go through `src/lib/api-client.ts` (`apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, `publicGet`, `unwrap`); `src/api/auth.ts` keeps its own `fetch` because it runs on the server.
- Cache keys: `src/lib/query-keys.ts` (`qk`). Staff error text: `problemText` in `src/lib/api-error.ts`.
- API types: `npm run api:snapshot` (needs a running backend, `OPENAPI_URL`), `npm run api:types`, `npm run api:check`; the contract is `src/types/api-contract.ts`.
