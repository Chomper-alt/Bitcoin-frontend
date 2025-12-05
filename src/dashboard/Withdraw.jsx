// src/dashboard/Withdraw.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance.js";
import "./Withdraw.css";

const Withdraw = () => {
  const [activeCrypto, setActiveCrypto] = useState("BTC");
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletAddress || !amount) {
      setError("Please fill out all fields before confirming.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post(
        "/api/wallet/withdraw",
        { currency: activeCrypto, address: walletAddress, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="withdraw-page">
      <h1>Withdraw Funds</h1>
      <div className="withdraw-container">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="withdraw-form">
            <label>
              Select Currency
              <select
                value={activeCrypto}
                onChange={(e) => setActiveCrypto(e.target.value)}
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
              </select>
            </label>

            <label>
              {activeCrypto} Wallet Address
              <input
                type="text"
                placeholder={`Enter your ${activeCrypto} wallet address`}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </label>
            <p className="caution">
              ⚠️ Only enter a valid {activeCrypto} wallet address. Incorrect
              addresses may cause permanent loss of funds.
            </p>

            <label>
              Amount to Withdraw
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button
              type="submit"
              className="confirm-button"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Confirm Withdrawal"}
            </button>
          </form>
        ) : (
          <div className="confirmation-message">
            <h2>Withdrawal Request Submitted</h2>
            <p>
              You requested to withdraw <strong>{amount} {activeCrypto}</strong>{" "}
              to <strong>{walletAddress}</strong>.
            </p>
            <p className="note">
              Your request is pending admin approval. You will be notified once
              it is processed.
            </p>
          </div>
        )}
      </div>

      <Link to="/dashboard/wallet" className="back-button">
        ← Return to Dashboard
      </Link>
    </div>
  );
};

export default Withdraw;
