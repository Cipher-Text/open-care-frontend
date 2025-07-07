# Open Care Frontend

Open Care Frontend is an open-source, modern web application for accessing medical resources in Bangladesh, including doctors, hospitals, and medical institutes. Built with Next.js, React, TypeScript, and Ant Design, it provides a fast, responsive, and user-friendly experience.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Docker Usage](#docker-usage)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features
- **Home Page**: Highlights featured doctors, hospitals, institutes, and statistics.
- **Doctors**: Search, filter, and view doctor profiles.
- **Hospitals**: Browse and filter hospitals with detailed info.
- **Institutes**: Explore medical institutes.
- **Profile**: Manage user profile and authentication.
- **Details Pages**: View detailed info for doctors, hospitals, and institutes.
- **Responsive Design**: Works on desktop and mobile.

---

## Tech Stack
- **Next.js** (App Router)
- **React** 19
- **TypeScript**
- **Ant Design** (UI components)
- **Axios** (API requests)
- **ESLint** (Linting)
- **Docker** (Containerization)

---

## Project Structure

```
app/
  ├── components/         # App-level UI components (e.g., AppHeader)
  ├── doctors/            # Doctors listing and details
  ├── hospitals/          # Hospitals listing and details
  ├── institutes/         # Institutes listing and details
  ├── profile/            # User profile page
  ├── login/              # Login page
  ├── register/           # Registration page
  ├── our-story/          # About/Our Story page
  ├── layout.tsx          # App layout
  └── page.tsx            # Main entry page
src/
  ├── assets/             # Static assets (images, etc.)
  ├── config/             # App configuration
  ├── contexts/           # React context providers (e.g., AuthContext)
  ├── services/           # API service functions
  ├── types/              # TypeScript type definitions
  ├── App.css             # Global styles
  └── index.css           # Additional global styles
public/
  └── images/             # Publicly served images
```

---

## Getting Started

### Prerequisites
- Node.js (v20 or later recommended)
- Yarn or npm
- (Optional) Docker

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Cipher-Text/open-care-frontend.git
   cd open-care-frontend
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory. Example:
   ```env
   VITE_API_URL=http://46.102.157.211:6700/
   VITE_ITEMS_PER_PAGE=10
   ```
4. **Run the development server:**
   ```bash
   yarn dev
   # or
   npm run dev
   ```
   The app will be available at [http://localhost:5175](http://localhost:5175) (or as configured).

---

## Available Scripts
- `yarn dev` / `npm run dev` — Start the development server
- `yarn build` / `npm run build` — Build for production
- `yarn start` / `npm start` — Start the production server
- `yarn lint` / `npm run lint` — Run ESLint

---

## Docker Usage

### Build and Run (Production)
```bash
docker build -f Dockerfile -t open-care-frontend .
docker run -p 5175:5175 open-care-frontend
```

### Development
```bash
docker build -f Dockerfile.dev -t open-care-frontend-dev .
docker run -p 5175:5175 open-care-frontend-dev
```

### QA/Production (Custom)
- Use `Dockerfile.qa` or `Dockerfile.prod` as needed:
  ```bash
  docker build -f Dockerfile.prod -t open-care-frontend-prod .
  docker run -p 5175:5175 open-care-frontend-prod
  ```

---

## Environment Variables
- `VITE_API_URL` — Base URL for backend API
- `VITE_ITEMS_PER_PAGE` — Default items per page for pagination

You can use `.env`, `.env.dev`, `.env.prod`, or `.env.qa` for different environments.

---

## Authentication
- The app uses a React context (`AuthContext`) for authentication state.
- Login stores a JWT token in `localStorage` and fetches the user profile.
- Logout clears the token and user state.
- Authenticated routes/pages use this context to check login status.

---

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- [Ant Design](https://ant.design/)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- All contributors and the open-source community!
