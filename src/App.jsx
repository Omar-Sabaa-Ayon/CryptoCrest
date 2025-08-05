import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./Pages/LoginPage";
import DashboardPage from "./Pages/DashboardPage";
import HomePage from "./Pages/HomePage";
import RegisterPage from "./Pages/RegisterPage";
import NewsPage from "./Pages/NewsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TradePage from "./Pages/TradePage";

function App() {
  return (
    <>
      <Routes>
        {/* ✅ Root now redirects to public HomePage */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* ✅ Public pages */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <NewsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trade"
          element={
            <ProtectedRoute>
              <TradePage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Catch-all redirects to HomePage */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
