# Open Care Frontend

Open Care Frontend is a React-based web application designed to provide users with a comprehensive platform for accessing medical resources, including doctors, hospitals, and medical institutes. The application is built using modern technologies like React, TypeScript, and Vite, and leverages Ant Design for a polished and responsive UI.

## Features

- **Home Page**: Displays featured doctors, hospitals, institutes, and statistics.
- **Doctors**: Search and browse a list of doctors with filters and pagination.
- **Hospitals**: Explore hospitals with detailed information and filtering options.
- **Institutes**: View medical institutes with filtering and pagination.
- **Profile**: Manage user profile information.
- **Hospital Details**: View detailed information about a specific hospital, including associated doctors.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

The project follows a modular structure for better scalability and maintainability:

```
src/
├── assets/          # Static assets like images
├── components/      # Reusable UI components
├── config/          # Configuration files
├── pages/           # Page-level components
├── services/        # API service functions
├── types/           # TypeScript type definitions
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── App.css          # Global styles
├── index.css        # Additional global styles
```

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Strongly typed programming language for better code quality.
- **Vite**: Fast build tool for modern web applications.
- **Ant Design**: UI library for responsive and elegant components.
- **Axios**: HTTP client for API requests.
- **React Router**: For routing and navigation.
- **CountUp.js**: For animated statistics.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Cipher-Text/open-care-frontend.git
   cd open-care-frontend
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```properties
   VITE_API_URL=http://46.102.157.211:6500/
   VITE_ITEMS_PER_PAGE=10
   ```

4. Start the development server:

   ```bash
   yarn dev
   ```

5. Open the application in your browser at `http://localhost:5173`.

## Scripts

- `yarn dev`: Start the development server.
- `yarn build`: Build the application for production.
- `yarn preview`: Preview the production build.
- `yarn lint`: Run ESLint to check for code quality issues.

## API Configuration

The application uses the following environment variables for API configuration:

- `VITE_API_URL`: Base URL for the backend API.
- `VITE_ITEMS_PER_PAGE`: Number of items to display per page in paginated views.

## Folder Details

### `src/pages/`

Contains the main pages of the application:

- `Home.tsx`: Landing page with featured content.
- `Doctors.tsx`: List of doctors with search and filters.
- `Hospitals.tsx`: List of hospitals with filters.
- `HospitalDetails.tsx`: Detailed view of a hospital.
- `Institutes.tsx`: List of medical institutes.
- `Profile.tsx`: User profile management.

### `src/services/`

Contains API service functions for interacting with the backend:

- `api.ts`: Functions for fetching doctors, hospitals, institutes, and user profiles.

### `src/types/`

Contains TypeScript type definitions for the application:

- `index.ts`: Defines types like `Doctor`, `Hospital`, `Institute`, etc.

### `src/components/`

Reusable UI components:

- `AppHeader.tsx`: Header with navigation links.

### `src/config/`

Configuration files:

- `index.ts`: Contains application-wide configuration like API URL and pagination settings.

## Deployment

To build the application for production, run:

```bash
yarn build
```

The production-ready files will be available in the `dist` directory.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [Ant Design](https://ant.design/) for the UI components.
- [Vite](https://vitejs.dev/) for the fast development experience.
- [React](https://reactjs.org/) for the robust frontend framework.
