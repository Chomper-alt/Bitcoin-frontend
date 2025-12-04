// src/pages/RequestSignalCode.jsx
import React, { useState, useEffect } from "react";
import api from "../utils/axiosInstance.js";
import "../styles/RequestSignalCode.css";

const RequestSignalCode = () => {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [vipLevel, setVipLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Read token from localStorage (AuthContext stores token under "token")
  const token = localStorage.getItem("token");

  // Map numeric vipLevel -> level name
  const vipMap = {
    0: "trial",
    1: "bronze",
    2: "silver",
    3: "gold",
    4: "diamond",
    5: "platinum",
  };

  // Allowed string-based levels order
  const levels = ["trial", "bronze", "silver", "gold", "diamond", "platinum"];

  // Fetch vipLevel from server to ensure we have the latest value
  useEffect(() => {
    const fetchVip = async () => {
      if (!token) {
        // no token -> keep default vipLevel 0
        console.warn("No token found in localStorage");
        return;
      }
      try {
        const res = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // res.data should include vipLevel or vipLevel string; normalize to number
        const serverVip = res.data?.vipLevel;
        // if server returns string label, try to map reverse
        if (typeof serverVip === "number") {
          setVipLevel(serverVip);
        } else if (typeof serverVip === "string") {
          // find index in vipMap values
          const idx = Object.values(vipMap).indexOf(serverVip);
          setVipLevel(idx >= 0 ? idx : 0);
        } else {
          setVipLevel(0);
        }
      } catch (err) {
        console.error("Failed to fetch current user/vipLevel", err.response?.data || err);
      }
    };

    fetchVip();
  }, [token]);

  const allowedLevel = vipMap[vipLevel] || "trial";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("❌ You must be logged in to request a signal code.");
      return;
    }

    if (!email) {
      setMessage("❌ Please enter a valid email.");
      return;
    }

    if (!type) {
      setMessage("❌ Please select a signal type.");
      return;
    }

    // prevent requesting higher level than allowed
    if (levels.indexOf(type) > levels.indexOf(allowedLevel)) {
      setMessage(`❌ You cannot request '${type}' signals — your current level is '${allowedLevel}'.`);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(
        "/api/signals/request",
        { email, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(res.data?.message || "✅ Request submitted");
      setEmail("");
      setType("");
    } catch (err) {
      console.error("Signal request error:", err.response?.data || err);
      setMessage(err.response?.data?.message || "Failed to submit signal request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signal-request-container">
      <div className="signal-request-card">
        <h2>Request Signal Code</h2>
        <p>Your current VIP level: <strong>{allowedLevel.toUpperCase()}</strong></p>

        <form onSubmit={handleSubmit}>
          <label>Enter Valid Email:</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Select Signal Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">-- Select Type --</option>
            {levels.map((lvl) => (
              <option
                key={lvl}
                value={lvl}
                disabled={levels.indexOf(lvl) > levels.indexOf(allowedLevel)}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Request Code"}
          </button>
        </form>

        {message && (
          <div className={`signal-message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestSignalCode;
