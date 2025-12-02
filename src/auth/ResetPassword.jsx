import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance.js";
import { toast } from "react-toastify";

const API_URL = "http://api.metaxtrader.com/api/users/settings";

const ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("❌ Passwords do not match");
    }

    try {
      await axios.post(`${API_URL}/password-reset/${token}`, {
        newPassword,
      });
      toast.success("✅ Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.msg || "❌ Failed to reset password");
    }
  };

  return (
    <div className="reset-password-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
