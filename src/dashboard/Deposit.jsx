import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosInstance.js";
import "./Deposit.css";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [activeCrypto, setActiveCrypto] = useState("BTC");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Wallet addresses
  const walletAddresses = {
    BTC: "bc1qjx4f6shfwamsgmvx5jkrjyqltta5d7hnf2f3e5",
    ETH: "0x72d12c30Ea5e3410F5aC7b3F12E354a176afD9F6",
  };

  // Map currency to uploaded QR image in public/images
  const qrImages = {
    BTC: "/images/bitcoinWallet-qr.jpg",
    ETH: "/images/ethereumWallet-qr.jpg",
  };

  const address = walletAddresses[activeCrypto];

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert(`${activeCrypto} address copied to clipboard!`);
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
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
    <div className="deposit-page">
      <h1>Deposit Funds</h1>

      {!submitted ? (
        <div className="deposit-card">
          <div className="deposit-header">
            <label>
              Select Currency:
              <select
                value={activeCrypto}
                onChange={(e) => setActiveCrypto(e.target.value)}
              >
                {Object.keys(walletAddresses).map((crypto) => (
                  <option key={crypto} value={crypto}>{crypto}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="deposit-body">
            <div className="crypto-box">
              <h2>{activeCrypto}</h2>
              <img
                src={qrImages[activeCrypto]}
                alt={`${activeCrypto} QR Code`}
                className="qrcode"
              />
              <p className="wallet-address">{address}</p>
              <button className="copy-button" onClick={copyAddress}>
                Copy Address
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
                <>
                  <p className="instruction">
                    Send exactly <strong>{depositAmount} {activeCrypto}</strong> to <strong>{address}</strong>.
                  </p>

                  <button
                    className="confirm-deposit-button"
                    onClick={handleDeposit}
                    disabled={submitting}
                  >
                    {submitting ? "Processing..." : "Confirm Deposit"}
                  </button>

                  <p className="instruction caution">
                    ⚠️ Only confirm after the deposit has been made.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="confirmation-message">
          <h2>Deposit Request Submitted</h2>
          <p>You requested to deposit <strong>{depositAmount} {activeCrypto}</strong>.</p>
          <p className="note">Your request is pending admin approval.</p>
        </div>
      )}

      <Link to="/dashboard/wallet" className="back-button">← Back to Wallet</Link>
    </div>
  );
};

export default Deposit;

