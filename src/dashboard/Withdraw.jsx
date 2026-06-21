// src/dashboard/Withdraw.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import api from "../utils/axiosInstance.js";
import "./Deposit.css";
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
    <main className="withdraw-page">
      <header className="wallet-flow-header">
        <Link to="/dashboard/wallet" className="wallet-back-action" aria-label="Back to Wallet">
          <FaArrowLeft />
          <span>Wallet</span>
        </Link>
        <h1>Withdraw Funds</h1>
      </header>

      <section className="withdraw-container">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="withdraw-form">
            <label>
              <span>Select Currency</span>
              <select value={activeCrypto} onChange={(e) => setActiveCrypto(e.target.value)}>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
              </select>
            </label>

            <label>
              <span>{activeCrypto} Wallet Address</span>
              <input
                type="text"
                placeholder={`Enter your ${activeCrypto} wallet address`}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </label>

            <p className="caution">
              <FaExclamationTriangle aria-hidden="true" />
              <span>Only enter a valid {activeCrypto} wallet address. Incorrect addresses may cause permanent loss of funds.</span>
            </p>

            <label>
              <span>Amount to Withdraw</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="confirm-button" disabled={submitting}>
              {submitting ? "Processing..." : "Confirm Withdrawal"}
            </button>
          </form>
        ) : (
          <div className="confirmation-message wallet-flow-success">
            <FaCheckCircle aria-hidden="true" />
            <h2>Withdrawal Request Submitted</h2>
            <p>Your request is pending admin approval. You will be notified once it is processed.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Withdraw;
