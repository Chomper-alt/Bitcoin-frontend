import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyPhone.css";

const VerifyPhone = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPhone, setNewPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `/api/users/settings/phone-verify/${token}`,
        { newPhone, confirmPhone }
      );
      setMessage(res.data.msg);
      setTimeout(() => navigate("/login"), 2000); // redirect after success
    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-phone-container">
      <form className="verify-phone-form" onSubmit={handleSubmit}>
        <h2>Verify Phone Change</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <input
          type="tel"
          placeholder="Enter new phone number"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Confirm new phone number"
          value={confirmPhone}
          onChange={(e) => setConfirmPhone(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Confirm Phone Change"}
        </button>
      </form>
    </div>
  );
};

export default VerifyPhone;
