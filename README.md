# OpenCare - Healthcare Made Simple

A comprehensive healthcare management platform built with Next.js that connects patients with certified doctors, hospitals, ambulance services, and blood banks across Bangladesh.

## 🌟 Features

### Patient Services

- **Doctor Consultation**: Find and consult with verified doctors across various specialties
- **Hospital Directory**: Browse hospitals with detailed information and services
- **Ambulance Booking**: 24/7 emergency ambulance services with GPS tracking
- **Blood Bank Network**: Connect with blood donors and blood banks for emergencies
- **Telemedicine**: Video consultations with healthcare professionals

### Admin Dashboard

- **Doctor Management**: Add, edit, and manage doctor profiles and specializations
- **Hospital Administration**: Comprehensive hospital data management
- **Blood Management**: Track blood donors, donations, and requisitions
- **Medical Specialties**: Manage medical specializations and departments
- **Medical Tests**: Catalog and manage available medical tests
- **Geolocation Management**: Administrative divisions, districts, and upazilas
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
│   │   ├── (main)/            # Public pages (doctors, hospitals)
│   │   ├── login/ signup/ logout/ auth/refresh/
│   ├── components/            # admin, common, doctors, hospitals, home, ui
│   ├── api/                   # API client modules, one per backend resource
│   ├── contexts/              # Auth context
│   ├── hooks/                 # use-permissions, use-mobile
│   ├── types/ validations/    # TypeScript types, Zod schemas
│   ├── config/                # config.ts (API base URL)
│   └── lib/                   # Utility functions
├── middleware.ts              # Redirects unauthenticated /admin requests to /login
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
- **Authentication**: backend-issued Keycloak tokens stored in cookies (`access_token`), refreshed via `/auth/refresh`; `middleware.ts` guards `/admin`
- **HTTP Client**: Fetch API

## 📱 Key Pages

### Public Pages

- **Homepage** (`/`) - Hero, services, testimonials
- **Doctors** (`/doctors`) - Browse and search doctors
- **Hospitals** (`/hospitals`) - Hospital directory
- **Login/Signup** - User authentication (`/login`, `/signup`)

### Admin Dashboard (`/admin`)

- **Dashboard / Analytics** - Stats, charts, recent activity
- **Doctors, Nurses, Hospitals, Institutions** - Directory management
- **Associations / Social Organizations** - Organization management
- **Blood, Ambulances** - Donation and emergency services
- **Medical Specialities / Medical Tests / Degrees** - Reference data
- **Geolocation** - Divisions, districts, upazilas
- **Advertisement, Health vitals, Users, Profile(s), Settings, Constants**

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration (defaults to https://api.opencarebd.com/api, see src/config/config.ts)
NEXT_PUBLIC_API_BASE_URL=https://api.opencarebd.com/api
```

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
