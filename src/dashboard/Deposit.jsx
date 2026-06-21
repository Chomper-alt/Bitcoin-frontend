import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaCopy, FaQrcode } from "react-icons/fa";
import api from "../utils/axiosInstance.js";
import "./Deposit.css";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [activeCrypto, setActiveCrypto] = useState("BTC");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const walletAddresses = {
    BTC: "bc1qjx4f6shfwamsgmvx5jkrjyqltta5d7hnf2f3e5",
    ETH: "0x72d12c30Ea5e3410F5aC7b3F12E354a176afD9F6",
  };

  const qrImages = {
    BTC: "/images/bitcoinWallet-qr.jpg",
    ETH: "/images/ethereumWallet-qr.jpg",
  };

  const address = walletAddresses[activeCrypto];

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert(`${activeCrypto} address copied to clipboard!`);
    } catch {
      alert("Could not copy address. Please copy it manually.");
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post(
        "/api/wallet/deposit",
        { amount: depositAmount, currency: activeCrypto },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
      setDepositAmount("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit deposit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="deposit-page">
      <header className="wallet-flow-header">
        <Link to="/dashboard/wallet" className="wallet-back-action" aria-label="Back to Wallet">
          <FaArrowLeft />
          <span>Wallet</span>
        </Link>
        <h1>Deposit Funds</h1>
      </header>

      {!submitted ? (
        <section className="deposit-card" aria-label="Deposit form">
          <div className="deposit-select-row">
            <label htmlFor="depositCurrency">Select Currency</label>
            <select
              id="depositCurrency"
              value={activeCrypto}
              onChange={(e) => setActiveCrypto(e.target.value)}
            >
              {Object.keys(walletAddresses).map((crypto) => (
                <option key={crypto} value={crypto}>{crypto}</option>
              ))}
            </select>
          </div>

          <div className="crypto-box">
            <span className="deposit-qr-icon" aria-hidden="true"><FaQrcode /></span>
            <h2>{activeCrypto}</h2>
            <img src={qrImages[activeCrypto]} alt={`${activeCrypto} QR Code`} className="qrcode" />
            <p className="wallet-address">{address}</p>
            <button className="copy-button" onClick={copyAddress} type="button">
              <FaCopy aria-hidden="true" />
              <span>Copy Address</span>
            </button>
          </div>

          <div className="deposit-input">
            <input
              type="number"
              placeholder="Enter deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0"
              required
            />

            {error && <p className="error">{error}</p>}

            {depositAmount && (
              <div className="deposit-confirm-area">
                <p className="instruction">
                  Send exactly <strong>{depositAmount} {activeCrypto}</strong> to the address above.
                </p>

                <button className="confirm-deposit-button" onClick={handleDeposit} disabled={submitting} type="button">
                  {submitting ? "Processing..." : "Confirm Deposit"}
                </button>

                <p className="instruction caution">Only confirm after the deposit has been made.</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="confirmation-message wallet-flow-success">
          <FaCheckCircle aria-hidden="true" />
          <h2>Deposit Request Submitted</h2>
          <p>Your request is pending admin approval.</p>
        </section>
      )}
    </main>
  );
};

export default Deposit;
