// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppLoader from "./AppLoader";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <AppLoader label="Checking secure session..." />;

  // 🚫 if not logged in, redirect to login page
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ authorized
  return children;
};

export default ProtectedRoute;
