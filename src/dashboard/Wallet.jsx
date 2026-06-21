import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowDown, FaArrowUp, FaWallet } from "react-icons/fa";
import api from "../utils/axiosInstance.js";
import "./Wallet.css";
import AppLoader from "../components/AppLoader";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/wallet/balance", {
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
  }, [token]);

  if (loading) return <AppLoader label="Loading wallet..." compact />;

  return (
    <section className="wallet-container" aria-labelledby="wallet-title">
      <header className="wallet-hero-card">
        <span className="wallet-hero-icon" aria-hidden="true">
          <FaWallet />
        </span>
        <div>
          <p className="wallet-kicker">Available Balance</p>
          <h1 id="wallet-title">${(balance ?? 0).toFixed(2)}</h1>
        </div>
      </header>

      {error && <p className="wallet-error">{error}</p>}

      <div className="wallet-actions" aria-label="Wallet actions">
        <button
          type="button"
          className="wallet-action-card deposit-action"
          onClick={() => navigate("/wallet/deposit")}
        >
          <span className="wallet-action-icon" aria-hidden="true">
            <FaArrowDown />
          </span>
          <span>
            <strong>Deposit</strong>
            <small>Add funds</small>
          </span>
        </button>

        <button
          type="button"
          className="wallet-action-card withdraw-action"
          onClick={() => navigate("/wallet/withdraw")}
        >
          <span className="wallet-action-icon" aria-hidden="true">
            <FaArrowUp />
          </span>
          <span>
            <strong>Withdraw</strong>
            <small>Cash out</small>
          </span>
        </button>
      </div>
    </section>
  );
};

export default Wallet;
