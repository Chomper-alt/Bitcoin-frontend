import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Wallet.css";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/wallet/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance ?? 0);
      } catch (err) {
        console.error(err);
        setError("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="wallet-container">Loading...</div>;

  return (
    <div className="wallet-container">
      <h2>My Wallet</h2>
      {error && <p className="error">{error}</p>}

      <div className="wallet-balance-card">
        <p>Total Balance</p>
        <h1>${(balance ?? 0).toFixed(2)}</h1>
      </div>

      <div className="wallet-actions">
        {/* Deposit */}
        <div className="wallet-card">
          <h3>Deposit Funds</h3>
          <button
            onClick={() => navigate("/wallet/deposit")}
            className="deposit-btn"
          >
            Go to Deposit Page
          </button>
        </div>

        {/* Withdraw (route to the new flow) */}
        <div className="wallet-card">
          <h3>Withdraw Funds</h3>
          <button
            onClick={() => navigate("/wallet/withdraw")}
            className="withdraw-btn"
          >
            Go to Withdraw Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
