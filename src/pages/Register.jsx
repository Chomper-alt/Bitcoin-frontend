// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import api from "../utils/axiosInstance.js";
import { useUser } from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import CountrySelect from "../components/CountrySelect";
import "../styles/Register.css";

const Register = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setReferredBy(refCode);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!acceptedTerms) {
        setError("You must accept the Terms & Conditions");
        return;
      }

      const formData = {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        country,
        email: email.trim().toLowerCase(),
        password,
        referredBy: referredBy?.trim() ? referredBy.trim() : null,
      };

      const res = await api.post("/api/auth/register", formData);
      const token = res?.data?.token;
      const registeredUser = res?.data?.user;

      if (!token || !registeredUser) {
        setError("Registration succeeded, but the server did not return a login session.");
        return;
      }

      localStorage.setItem("token", token);

      let fullUser = registeredUser;
      try {
        const meRes = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes?.data) fullUser = meRes.data;
      } catch (meErr) {
        console.warn("Could not fetch /api/auth/me after registration:", meErr);
      }

      setUser({ ...fullUser, token });
      navigate("/dashboard/profile");
    } catch (err) {
      console.error("❌ Register Error:", err);
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} autoComplete="on">
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          disabled={loading}
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          required
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          required
          disabled={loading}
        />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          required
          disabled={loading}
        />

        <CountrySelect value={country} onChange={setCountry} disabled={loading} />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={loading}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={loading}
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            disabled={loading}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Referral Code (optional)"
          value={referredBy}
          onChange={(e) => setReferredBy(e.target.value)}
          autoComplete="off"
          readOnly={!!new URLSearchParams(location.search).get("ref")}
          disabled={loading}
        />

        <label className="terms-checkbox">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={loading}
          />{" "}
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </a>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="cta-text">
          Already have an account?{" "}
          <a href="/login" className="cta-link">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;