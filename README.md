# OpenCare - Healthcare Made Simple

A comprehensive healthcare management platform built with Next.js that connects patients with certified doctors, hospitals, ambulance services, and blood banks across Bangladesh.

## 🌟 Features

### Patient Services

- **Doctor Consultation**: Find and consult with verified doctors across various specialties
- **Hospital Directory**: Browse hospitals with URL-state filters and an Email button on each card
- **Ambulance Directory**: Public list of ambulance services, plus a red 999 emergency pill in the header
- **Institutions**: Public institutions directory
- **Blood donors and requisitions**: Managed in the admin dashboard (no public blood page yet)

Not built: online booking, telemedicine, GPS ambulance tracking.

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
- **Role Permissions**: Edit which permissions each role has, with an audit log
- **Advertisements**: Create, edit and delete advertisements and advertisement types
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
│   │   ├── (admin)/admin/     # Admin dashboard routes (auth required)
│   │   ├── (main)/            # Public pages (doctors, hospitals, ambulances, institutions, pricing, about, contact, privacy, terms); the home page is src/app/page.tsx
│   │   ├── login/ signup/ logout/ auth/refresh/
│   ├── components/            # admin, common, doctors, hospitals, home, ui
│   ├── api/                   # API client modules, one per backend resource
│   ├── contexts/              # Auth context
│   ├── hooks/                 # use-permissions, use-url-params, use-polling, use-mobile
│   ├── types/ validations/    # TypeScript types, Zod schemas
│   ├── config/                # config.ts (API base URL)
│   └── lib/                   # api-client, auth, pagination (page-shape contract), public-stats (cached home stats), utils
│   ├── middleware.ts          # /admin and /account need a login; non-staff are sent to /account
│   ├── config/                # navigation-rules.ts (menu and guards), role-permissions fixture, nav test
├── docs/                      # Feature docs, AI context, openapi.json
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
- **Hospitals** (`/hospitals`) - Hospital directory (real API, filters in the URL); `/hospitals/[slug]` shows contact buttons, directions, services and doctors
- **Ambulances** (`/ambulances`), **Institutions** (`/institutions`)
- **Pricing** (`/pricing?for=patients|doctors|hospitals`): Free, Plus and Pro for each audience, with prices and the features each plan includes read from `GET /api/plans` (the backend plans, so there is one place to change them) and the wording in `src/config/pricing-plans.ts`. If the API is unreachable the page says prices are unavailable. `npm run test:pricing` checks how the plans become the page. Paid plans are a waitlist (mailto) and roadmap features are labelled; nothing is sold or charged in the app yet
- **About**, **Contact**, **Privacy**, **Terms** (`/about`, `/contact`, `/privacy`, `/terms`)
- **Login/Signup** - `/login` and `/signup`. Signup calls `POST /api/auth/register` (`src/api/register.ts`) and creates a regular `USER` account; passwords need an uppercase letter, a lowercase letter, a digit and one of `@#$%^&+=`

### Admin Dashboard (`/admin`)

- **Dashboard** (`/admin`) - one dashboard for everyone in the console: real directory totals, shortcuts for what your role can do, pending consent requests, and (super admin) the full system overview. A doctor sees their own practice instead of directory totals (`DoctorDashboard`, data from `GET /api/me/doctor-dashboard`): items needing attention, prescriptions and patients against the previous 30 days, 12-week trend, consent outcomes, follow-ups due, profile readiness, top diagnoses and medicines. `/admin/dashboard` redirects here. The old placeholder analytics and users pages with made-up figures were removed
- **Doctors, Nurses, Hospitals, Institutions** - Directory management; `/admin/doctors/bulk-upload` for CSV import
- **Associations / Social Organizations** - Organization management
- **Blood, Ambulances** - Donation and emergency services
- **Medical Specialities / Medical Tests / Degrees** - Reference data
- **Geolocation** - Divisions, districts, upazilas
- **Prescriptions** (`/admin/prescriptions`, `/new`, `/[id]`, `/[id]/edit`) and **My consents** (`/admin/consents`)
- **My doctor profile** (`/admin/doctors/me`, `view-doctor-panel`) opens the signed-in doctor's own record to edit (found through `GET /api/me/doctor`). The edit button in the Doctors list shows only on their own row, and `/admin/doctors/[id]` refuses another doctor's id, unless they administer doctors (`src/config/doctor-access.ts`, the same rule as the API's `DoctorAccess`). Doctors also get read-only **Institutions**, **Associations** and **Medicines** (`/admin/medicines`: search plus a searchable company dropdown) from `view-doctor-panel`
- **Roles & Permissions** (`/admin/role-permissions`, needs `manage-role-permissions`)
- **Advertisement, Health vitals, Users, Profile(s), Settings, Constants**

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration (see src/config/config.ts). Required for production builds; the build fails without it.
# Local development defaults to http://localhost:6700/api. Copy .env.example for the full list.
NEXT_PUBLIC_API_BASE_URL=https://api.opencarebd.com/api
```

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
- **SEO**: `src/app/sitemap.ts` serves `/sitemap/0.xml` (static pages) plus chunked hospital and doctor sitemaps (1,000 records each, cached for a day), and `src/app/robots.ts` lists them and blocks `/admin`, `/login`, `/signup`, `/logout` and `/auth`. Set `NEXT_PUBLIC_SITE_URL` per environment (default `https://opencarebd.com`).
- **Menus, guards and landing**: `src/config/navigation-rules.ts` is the one list of who sees which console page (a person sees an entry when they hold any of its permissions). It drives the sidebar, the page guard in the admin layout, `src/middleware.ts` and the redirect after login. Staff (anyone with a console permission) land in `/admin`; everyone else lands in `/account` (home, profile, consents, health). The menu is grouped into People, Facilities, Reference data, Clinical, Platform and Account. Permissions come from `GET /api/me/capabilities` (Keycloak, so role changes apply without a new login) with the token as fallback. The Roles & Permissions screen has three tabs: Mapping (edit permissions), Menus (what each role will see, including changes not saved yet, with differences outlined) and History. `npm run docs:access` regenerates `opencare/docs/reference/ACCESS_MATRIX.md`. `npm run test:nav` checks the menu of all 15 roles against a snapshot of the live role mapping (`src/config/role-permissions.fixture.json`; refresh it after changing roles).
- **Page guards**: `RequirePermission` (`src/components/admin/require-permission.tsx`) wraps pages that need a permission (Profiles, Admin Dashboard, Role permissions). Permissions come only from the token; the old hardcoded role map was removed because it drifted from Keycloak. The API enforces the same permissions on every route
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
```

## 📊 Admin Features

### Blood Management System

- **Donors**: Track blood donors with contact information
- **Requisitions**: Manage blood requests from hospitals
- **Donations**: Monitor blood donation records
- **Search & Filter**: Advanced filtering across all blood data

### Geolocation Management

- **Divisions**: Administrative divisions of Bangladesh
- **Districts**: District-level location data
- **Upazilas**: Sub-district administrative units
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

No test runner or `type-check` script is configured yet; see `docs/testing-frontend.md` for the plan. Type errors surface through `npm run build`.

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
