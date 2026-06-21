import React, { useState } from "react";
import {
  FaCamera,
  FaCheck,
  FaLock,
  FaMoon,
  FaPalette,
  FaPhoneAlt,
  FaSignOutAlt,
  FaSun,
  FaUpload,
  FaUserCircle,
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";
import "./Settings.css";
import { toast } from "react-toastify";
import api from "../utils/axiosInstance";
import AppLoader from "../components/AppLoader";


const normalizeImageUrl = (val) => {
  if (!val) return null;
  if (val.startsWith("http://")) return val.replace("http://", "https://");
  if (val.startsWith("https://")) return val;
  if (val.startsWith("/uploads")) return `https://api.metaxtrader.com${val}`;
  return val;
};


const MOBILE_IMAGE_MAX_SIZE = 960;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });

const loadImageFromDataUrl = (dataUrl) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not prepare selected image"));
    img.src = dataUrl;
  });

const prepareProfileImageForUpload = async (file) => {
  if (!file) return null;

  // Android/Capacitor gallery files can arrive as HEIC/WEBP or even blank mime types.
  // The backend multer filter accepts JPEG/PNG, so normalize every selected image to JPEG.
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImageFromDataUrl(dataUrl);

  const scale = Math.min(1, MOBILE_IMAGE_MAX_SIZE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not convert image"))),
      "image/jpeg",
      0.88
    );
  });

  return new File([blob], `profile-${Date.now()}.jpg`, { type: "image/jpeg" });
};

const addCacheBuster = (url) => {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${Date.now()}`;
};

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser, logout } = useUser();
  const token = localStorage.getItem("token");

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    normalizeImageUrl(user?.profileImage) || "/images/default-avatar.png"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [phoneEmail, setPhoneEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const uploadProfileImage = async () => {
    if (!profileFile) return toast.error("Please choose a file first");

    try {
      const uploadFile = await prepareProfileImageForUpload(profileFile);
      if (!uploadFile) return toast.error("Please choose a valid image first");

      const formData = new FormData();
      formData.append("photo", uploadFile, uploadFile.name);

      const res = await api.patch("/api/users/settings/profile-image", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = res?.data || {};
      const uploadedImage =
        normalizeImageUrl(payload?.imageUrl) ||
        normalizeImageUrl(payload?.profileImage) ||
        normalizeImageUrl(payload?.user?.profileImage) ||
        normalizeImageUrl(payload?.data?.profileImage);

      if (!uploadedImage) {
        throw new Error("Upload completed but no profile image URL was returned");
      }

      // Update the dashboard user state immediately from the upload response.
      // Do not rely on /me here because the bug we are fixing is display/sync,
      // not whether the backend stored the image. Mongo already stores profileImage.
      setUser((prev) => ({
        ...(prev || {}),
        profileImage: uploadedImage,
        imageUrl: uploadedImage,
        avatar: uploadedImage,
      }));

      setProfilePreview(uploadedImage);
      toast.success("Profile picture updated!");
      setProfileFile(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err?.response?.data?.msg || err?.message || "Failed to upload profile image");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return toast.error("New passwords do not match");
    }

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

  const handleThemeChange = async (nextTheme) => {
    if (!nextTheme || nextTheme === theme) return;

    try {
      await api.patch(
        "/api/users/settings/theme",
        { theme: nextTheme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toggleTheme(nextTheme);
      toast.success(`Theme updated to ${nextTheme}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update theme");
    }
  };

  const handleLogout = () => logout();

  if (!user) return <AppLoader label="Loading settings..." compact />;

  return (
    <div className="settings-page">
      <div className="settings-hero-card">
        <div>
          <span className="settings-eyebrow">Account Center</span>
          <h2>Settings</h2>
          <p>Manage your profile, security, theme, and account access.</p>
        </div>
        <div className="settings-hero-icon" aria-hidden="true">
          <FaUserCircle />
        </div>
      </div>

      <section className="settings-card profile-settings-card">
        <div className="settings-card-head">
          <span className="settings-card-icon"><FaCamera /></span>
          <div>
            <h3>Profile Picture</h3>
            <p>Update your account avatar.</p>
          </div>
        </div>

        <div className="profile-image-preview">
          <img
            src={profilePreview || "/images/default-avatar.png"}
            alt="Profile preview"
            onError={(e) => {
              e.currentTarget.src = "/images/default-avatar.png";
            }}
          />

          <div className="profile-upload-actions">
            <label className="file-picker-btn">
              <FaCamera />
              <span>{profileFile ? "Photo selected" : "Choose Photo"}</span>
              <input type="file" accept="image/*" onChange={handleProfileImageChange} />
            </label>
            <button type="button" className="settings-primary-btn" onClick={uploadProfileImage}>
              <FaUpload /> Upload
            </button>
          </div>
        </div>
      </section>

      <section className="settings-card theme-settings-card">
        <div className="settings-card-head">
          <span className="settings-card-icon"><FaPalette /></span>
          <div>
            <h3>Theme</h3>
            <p>Switch the app appearance.</p>
          </div>
        </div>

        <div className="theme-choice-grid" role="group" aria-label="Choose theme">
          <button
            type="button"
            className={`theme-choice ${theme === "light" ? "active" : ""}`}
            onClick={() => handleThemeChange("light")}
          >
            <FaSun />
            <span>Light</span>
            {theme === "light" && <FaCheck className="theme-check" />}
          </button>
          <button
            type="button"
            className={`theme-choice ${theme === "dark" ? "active" : ""}`}
            onClick={() => handleThemeChange("dark")}
          >
            <FaMoon />
            <span>Dark</span>
            {theme === "dark" && <FaCheck className="theme-check" />}
          </button>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-head">
          <span className="settings-card-icon"><FaPhoneAlt /></span>
          <div>
            <h3>Phone Number</h3>
            <p>Request a verified phone number change.</p>
          </div>
        </div>

        <form className="settings-form" onSubmit={handlePhoneChange}>
          <label>Email Verification Required</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={phoneEmail}
            onChange={(e) => setPhoneEmail(e.target.value)}
            required
          />
          <button type="submit" className="settings-primary-btn">Request Change</button>
        </form>
      </section>

      <section className="settings-card">
        <div className="settings-card-head">
          <span className="settings-card-icon"><FaLock /></span>
          <div>
            <h3>Security</h3>
            <p>Change your password or request a reset link.</p>
          </div>
        </div>

        <form className="settings-form" onSubmit={handlePasswordChange}>
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

          <button type="submit" className="settings-primary-btn">Update Password</button>
        </form>

        <button
          type="button"
          className="forgot-password-link"
          onClick={() => setShowForgot(!showForgot)}
        >
          Forgot old password?
        </button>

        {showForgot && (
          <form className="settings-form reset-form" onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" className="settings-secondary-btn">Send Reset Link</button>
          </form>
        )}
      </section>

      <section className="settings-card logout-section">
        <div className="settings-card-head">
          <span className="settings-card-icon danger"><FaSignOutAlt /></span>
          <div>
            <h3>Logout</h3>
            <p>End your current session on this device.</p>
          </div>
        </div>

        {showLogoutConfirm ? (
          <div className="logout-confirm">
            <p>Are you sure you want to logout?</p>
            <div className="logout-actions">
              <button type="button" onClick={handleLogout} className="confirm-btn">
                Yes, Logout
              </button>
              <button type="button" onClick={() => setShowLogoutConfirm(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setShowLogoutConfirm(true)} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        )}
      </section>
    </div>
  );
};

export default Settings;
