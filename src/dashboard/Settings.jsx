// src/dashboard/Settings.jsx
import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import "./Settings.css";
import { toast } from "react-toastify";
import api from "../utils/axiosInstance"; // ✅ uses HTTPS baseURL + token interceptor

// Normalize any profile image to an absolute HTTPS URL
const normalizeImageUrl = (val) => {
  if (!val) return null;
  if (val.startsWith("http://")) return val.replace("http://", "https://");
  if (val.startsWith("https://")) return val;
  // backend serves uploads at /uploads/*
  if (val.startsWith("/uploads")) return `https://api.metaxtrader.com${val}`;
  return val;
};

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser, logout } = useUser();
  const token = localStorage.getItem("token");

  // Local state
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    normalizeImageUrl(user?.profileImage) || "/images/default-avatar.png" // ✅ served by frontend; no CORS
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [phoneEmail, setPhoneEmail] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ---------------- PROFILE IMAGE ----------------
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const uploadProfileImage = async () => {
    if (!profileFile) return toast.error("Please choose a file first");

    const formData = new FormData();
    formData.append("photo", profileFile);

    try {
      const res = await api.patch("/api/users/settings/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }, // extra safety
      });

      const img =
        normalizeImageUrl(res?.data?.imageUrl) ||
        normalizeImageUrl(res?.data?.profileImage) ||
        normalizeImageUrl(res?.data?.url);

      if (img) {
        setUser((prev) => ({ ...prev, profileImage: img }));
        setProfilePreview(img);
      }

      toast.success("Profile picture updated!");
      setProfileFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to upload profile image");
    }
  };

  // ---------------- CHANGE PASSWORD ----------------
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword)
      return toast.error("New passwords do not match");

    try {
      await api.patch(
        "/api/users/settings/password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.msg || err?.response?.data?.message || "Failed to update password");
    }
  };

  // ---------------- PHONE REQUEST ----------------
  const handlePhoneChange = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/api/users/settings/phone-request",
        { email: phoneEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.info("Verification email sent!");
      setPhoneEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to request phone number change");
    }
  };

  // ---------------- FORGOT PASSWORD ----------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/users/settings/password-reset-request", { email: resetEmail });
      toast.info("Password reset link sent!");
      setShowForgot(false);
      setResetEmail("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send reset link");
    }
  };

  // ---------------- THEME SWITCH ----------------
  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;

    try {
      await api.patch(
        "/api/users/settings/theme",
        { theme: newTheme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toggleTheme(newTheme);
      toast.success(`Theme updated to ${newTheme}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update theme");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => logout();

  if (!user) return <div className="settings-page">Loading...</div>;

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>

      {/* PROFILE PICTURE */}
      <div className="settings-section">
        <h3>Profile Picture</h3>
        <div className="profile-image-preview">
          <img
            src={profilePreview || "/images/default-avatar.png"}
            alt="Preview"
            onError={(e) => {
              e.currentTarget.src = "/images/default-avatar.png"; // ✅ always safe, same-origin
            }}
          />

          <input type="file" accept="image/*" onChange={handleProfileImageChange} />
        </div>
        <button onClick={uploadProfileImage}>Upload New Picture</button>
      </div>

      {/* PHONE NUMBER */}
      <div className="settings-section">
        <h3>Change Phone Number</h3>
        <form onSubmit={handlePhoneChange}>
          <label>Email Verification Required</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={phoneEmail}
            onChange={(e) => setPhoneEmail(e.target.value)}
            required
          />
          <button type="submit">Request Change</button>
        </form>
      </div>

      {/* PASSWORD */}
      <div className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>
        </form>

        <p className="forgot-password-link" onClick={() => setShowForgot(!showForgot)}>
          Forgot old password?
        </p>

        {showForgot && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>
          </form>
        )}
      </div>

      {/* THEME SWITCH */}
      <div className="settings-section">
        <h3>Theme</h3>

        <div className="theme-toggle">
          <label>Choose Theme:</label>
          <select value={theme} onChange={handleThemeChange}>
            <option value="light">🌞 Light</option>
            <option value="dark">🌙 Dark</option>
          </select>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="settings-section logout-section">
        <h3>Logout</h3>

        {showLogoutConfirm ? (
          <div className="logout-confirm">
            <p>Are you sure?</p>

            <button onClick={handleLogout} className="confirm-btn">
              Yes, Logout
            </button>

            <button onClick={() => setShowLogoutConfirm(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowLogoutConfirm(true)} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;

