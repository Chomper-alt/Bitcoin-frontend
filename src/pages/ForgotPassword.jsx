import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Auth.css";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(
        res?.data?.message ||
          res?.message ||
          "If that email exists, we sent a reset link."
      );
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error sending reset email");
    } finally {
      setLoading(false);
    }
  };

  const isError = msg.toLowerCase().includes("error");

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your account email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {msg && (
          <p className={`info ${isError ? "error" : "success"}`}>{msg}</p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}

