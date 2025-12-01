// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import CountrySelect from "../components/CountrySelect";
import "../styles/Register.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // form state
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ✅ Auto-detect referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setReferredBy(refCode);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!acceptedTerms) {
      return setError("You must accept the Terms & Conditions");
    }

    const formData = {
      username,
      firstName,
      lastName,
      phone,
      country,
      email,
      password,
      referredBy: referredBy || null,
    };

    console.log("Submitting data: ", formData);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Register Error:", err);
      setError(err.response?.data?.message || "Registration failed");
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
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          required
        />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          required
        />

        <CountrySelect value={country} onChange={setCountry} />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        {/* Password with toggle */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password with toggle */}
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
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
          readOnly={!!referredBy} // ✅ lock field if auto-filled from URL
        />

        {/* ✅ Terms & Conditions checkbox */}
        <label className="terms-checkbox">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />{" "}
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </a>
        </label>

        <button type="submit">Register</button>

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
