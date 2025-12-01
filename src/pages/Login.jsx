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
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ LOGIN
      const loginRes = await api.post("/api/auth/login", formData);
      const token = loginRes.data.token;
      localStorage.setItem("token", token);

      // 2️⃣ FETCH FULL USER DATA
      const meRes = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = meRes.data;

      // 3️⃣ VIP MAPPING
      const vipNumber = data.vipLevelNumber ?? 0;
      const vipName = vipNames[vipNumber];

      const finalUser = {
        ...data,
        token,
        vipLevelNumber: vipNumber,
        vipBadge: vipName,
        vipTitle: vipName,
        isAdmin: data.role === "admin",
      };

      // 4️⃣ Save everywhere
      setUser(finalUser);

      console.log("FULL USER:", finalUser);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2>Login</h2>

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <div className="password-input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={togglePassword}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" className="submit-btn">Login</button>

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
