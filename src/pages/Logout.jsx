// src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored session/token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect back home after short delay
    setTimeout(() => {
      navigate("/");
    }, 500);
  }, [navigate]);

  return <div>Logging you out...</div>;
}
