// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import api from "../utils/axiosInstance.js";
import "../styles/Login.css";

const vipNames = [
  "Beginner",
  "Amateur",
  "Senior",
  "Talented",
  "Expert",
  "Professional",
  "Master",
  "Legendary",
  "Eternal",
];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1) LOGIN
      const loginRes = await api.post("/api/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = loginRes?.data?.token;

      if (!token) {
        throw new Error("No token returned from server");
      }

      localStorage.setItem("token", token);

      // 2) TRY TO GET FULL USER DATA
      // If /me fails, do NOT treat login itself as failed
      let data = loginRes?.data?.user || null;

      try {
        const meRes = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (meRes?.data) {
          data = meRes.data;
        }
      } catch (meErr) {
        console.warn("Could not fetch /api/auth/me after login:", meErr);
      }

      // 3) BUILD SAFE USER OBJECT
      const vipNumber = data?.vipLevelNumber ?? 0;
      const vipName = vipNames[vipNumber] ?? vipNames[0];

      const finalUser = {
        ...(data || {}),
        token,
        vipLevelNumber: vipNumber,
        vipBadge: vipName,
        vipTitle: vipName,
        isAdmin: data?.role === "admin",
      };

      // 4) SAVE USER
      setUser(finalUser);

      console.log("FULL USER:", finalUser);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
          disabled={loading}
        />

        <label>Password</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />
          <button type="button" onClick={togglePassword} disabled={loading}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;