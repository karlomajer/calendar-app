import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import AuthLayout from "../components/AuthLayout";
import LoginPage from "../pages/LoginPage";
import EventsPage from "../pages/EventsPage";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AuthLayout>
            <EventsPage />
          </AuthLayout>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
