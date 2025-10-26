import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "../components/PublicRoute";
import LoginPage from "../pages/LoginPage";

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
    <Route path="/" element={<div>Main page</div>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
