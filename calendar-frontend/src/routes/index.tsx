import { Routes, Route, Navigate } from "react-router-dom";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<div>Login page</div>} />
    <Route path="/" element={<div>Main page</div>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
