// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "./components/AppHeader";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Hospitals from "./pages/Hospitals";
import HospitalDetails from "./pages/HospitalDetails";
import Institutes from "./pages/Institutes";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OurStory from "./pages/OurStory";
import "./App.css";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import DoctorDetails from "./pages/DoctorDetails";
import InstituteDetails from "./pages/InstituteDetails";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const { Content, Footer } = Layout;

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/hospitals" element={<Hospitals />} />
      <Route path="/hospitals/:id" element={<HospitalDetails />} />
      <Route path="/institutes" element={<Institutes />} />
      <Route path="/institutes/:id" element={<InstituteDetails />} />
      <Route path="/our-story" element={<OurStory />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout className="layout" style={{ minHeight: "100vh" }}>
          <AppHeader />
          <Content style={{ padding: "0 50px", marginTop: 64 }}>
            <div className="site-layout-content">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Medical Information Portal ©{new Date().getFullYear()} Created with
            Ant Design
          </Footer>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
