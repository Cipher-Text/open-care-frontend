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

- Node.js 18+
- npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/open-care-frontend.git
cd open-care-frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Environment Setup**

```bash
# Copy environment files
cp .env.dev .env.local
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
open-care-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/           # Admin dashboard routes
│   │   └── (main)/            # Public pages
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin-specific components
│   │   ├── common/            # Shared components
│   │   ├── home/              # Homepage components
│   │   └── ui/                # UI component library
│   ├── api/                   # API integration functions
│   ├── types/                 # TypeScript type definitions
│   ├── config/                # Configuration files
│   └── lib/                   # Utility functions
├── docs/                      # Documentation
├── public/                    # Static assets
└── ...config files
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend Integration

- **API Base**: `https://api.opencarebd.com/api`
- **Authentication**: Keycloak integration ready
- **HTTP Client**: Fetch API

## 📱 Key Pages

### Public Pages

- **Homepage** (`/`) - Hero, services, testimonials
- **Doctors** (`/doctors`) - Browse and search doctors
- **Hospitals** (`/hospitals`) - Hospital directory
- **Login/Signup** - User authentication

### Admin Dashboard (`/admin`)

- **Dashboard** - Analytics and overview
- **Doctors** - Doctor management
- **Hospitals** - Hospital administration
- **Blood Management** - Blood donation system
- **Medical Specialties** - Specialty management
- **Medical Tests** - Test catalog
- **Geolocation** - Location data management
- **Analytics** - Reports and insights

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.opencarebd.com/api

# Development
NODE_ENV=development
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
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

- WCAG compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

## 🧪 Development

### Code Quality

- **ESLint**: Code linting
- **TypeScript**: Type safety
- **Prettier**: Code formatting
- **Husky**: Git hooks (if configured)

### Testing

```bash
# Run tests (when configured)
npm run test

# Type checking
npm run type-check
```

## 📖 Documentation

Detailed documentation is available in the `/docs` directory:

- [Blood Management](docs/blood-management.md)
- [Geolocation Management](docs/geolocation-management.md)
- [Degrees Management](docs/degrees-management.md)

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
