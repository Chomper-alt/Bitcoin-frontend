// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // 🚫 if not logged in, redirect to login page
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ authorized
  return children;
};

export default ProtectedRoute;
