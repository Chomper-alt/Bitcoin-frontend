import React, { useState, useEffect } from "react";
import api from "../../utils/axiosInstance.js";
import { FaChartLine, FaSignal, FaWallet } from "react-icons/fa";
import "./CopyTrade.css";

export default function CopyTrading() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [capital, setCapital] = useState("");
  const [signalCode, setSignalCode] = useState("");
  const [error, setError] = useState("");
  const [activeTrade, setActiveTrade] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [profitFlash, setProfitFlash] = useState(null);

  useEffect(() => {
    fetchWallet();
    fetchTrades();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data } = await api.get("/api/wallet/balance");
      setWalletBalance(data.balance);
    } catch (err) {
      console.error("Wallet fetch error:", err.response?.data || err);
    }
  };

  const fetchTrades = async () => {
    try {
      const { data } = await api.get("/api/copytrading/mytrades");
      setTrades(data.trades || []);
      const active = (data.trades || []).find((t) => t.status === "active");
      setActiveTrade(active || null);
    } catch (err) {
      console.error("Trade fetch error:", err.response?.data || err);
    }
  };

  const handleStartCopyTrade = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/copytrading/start", { capital, signalCode });
      if (data.trade) {
        setActiveTrade(data.trade);
        fetchWallet();
        setCapital("");
        setSignalCode("");
      } else {
        setError("No trade data returned");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrade = async () => {
    if (!activeTrade) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/api/copytrading/complete/${activeTrade._id}`);
      if (data.ok) {
        setWalletBalance(data.newBalance);
        setProfitFlash(data.netPayout);
        setTimeout(() => setProfitFlash(null), 3000);
        setActiveTrade(null);
        fetchTrades();
      } else {
        alert(data.message || "Trade completion failed.");
      }
    } catch (err) {
      console.error("Error completing trade:", err.response?.data || err);
      alert("Failed to complete trade. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num) =>
    Number(num || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatTimeLeft = (endAt) => {
    const now = new Date();
    const end = new Date(endAt);
    let diff = Math.max(0, end - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  useEffect(() => {
    let timer;
    if (activeTrade) {
      const update = () => setTimeLeft(formatTimeLeft(activeTrade.endAt));
      update();
      timer = setInterval(update, 60000);
    }
    return () => clearInterval(timer);
  }, [activeTrade]);

  const calcProgress = (trade) => {
    const start = new Date(trade.startAt).getTime();
    const end = new Date(trade.endAt).getTime();
    const now = Date.now();
    return Math.min(100, ((now - start) / (end - start)) * 100);
  };

  const isTradeDue = activeTrade && new Date(activeTrade.endAt) <= new Date();

  return (
    <div className="copy-trading">
     <div className="copy-trade-head">
        <div className="copy-trade-title">
          <FaChartLine aria-hidden="true" />
          <h2>Copy Trading</h2>
        </div>
        <p className="wallet-balance">
          <FaWallet aria-hidden="true" />
          Wallet Balance: ${formatCurrency(walletBalance)}
        </p>
      </div>

<div className="signal-action">
  <button
    className="request-signal-btn"
    onClick={() => (window.location.href = "/dashboard/request-signal")}
  >
    <FaSignal aria-hidden="true" />
    Request Signal Code
  </button>
</div>


      {profitFlash && (
        <div className="profit-flash">+${formatCurrency(profitFlash)} earned!</div>
      )}

      {/* Start Trade Form */}
      {!activeTrade && (
        <div className="trade-form">
          <input
            type="number"
            placeholder="Enter capital"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter signal code"
            value={signalCode}
            onChange={(e) => setSignalCode(e.target.value)}
          />
          <button onClick={handleStartCopyTrade} disabled={loading || !capital || !signalCode}>
            {loading ? "Starting..." : "Start Copy Trade"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {/* Active Trade */}
      {activeTrade && (
        <div className={`active-trade ${isTradeDue ? "ready-complete" : ""}`}>
          <h3><FaChartLine aria-hidden="true" /> Active Trade</h3>
          <p><strong>Level:</strong> {activeTrade.level}</p>
          <p><strong>Capital:</strong> ${formatCurrency(activeTrade.capital)}</p>
          <p><strong>Expected Profit:</strong> {activeTrade.expectedProfitPct}%</p>
          <p><strong>Commission:</strong> {activeTrade.commissionPct}%</p>
          <p><strong>Status:</strong> {activeTrade.status}</p>
          <p><strong>Time Left:</strong> {timeLeft}</p>

          <div className="progress-bar">
            <div className="progress" style={{ width: `${calcProgress(activeTrade)}%` }}></div>
          </div>

          {isTradeDue && (
            <button className="complete-btn" onClick={handleCompleteTrade} disabled={loading}>
              {loading ? "Processing..." : "Complete Trade"}
            </button>
          )}
        </div>
      )}

      {/* Trade History */}
      <h3 className="copy-history-title">My Trades</h3>
      <table className="copy-trades-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Capital</th>
            <th>Status</th>
            <th>Gross Profit</th>
            <th>Net Payout</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr key={t._id} className={t.status === "completed" ? "highlight-completed" : ""}>
              <td>{t.level}</td>
              <td>${formatCurrency(t.capital)}</td>
              <td>{t.status}</td>
              <td className={t.grossProfit > 0 ? "profit" : ""}>${formatCurrency(t.grossProfit)}</td>
              <td className={t.netPayout > 0 ? "profit" : ""}>${formatCurrency(t.netPayout)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="copy-trades-mobile-list">
        {trades.length === 0 ? (
          <div className="copy-mobile-empty">No copy trades yet.</div>
        ) : (
          trades.map((t) => (
            <article key={t._id} className={`copy-mobile-trade ${t.status === "completed" ? "completed" : ""}`}>
              <div>
                <span>Level</span>
                <strong>{t.level}</strong>
              </div>
              <div>
                <span>Capital</span>
                <strong>${formatCurrency(t.capital)}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{t.status}</strong>
              </div>
              <div>
                <span>Net Payout</span>
                <strong className={t.netPayout > 0 ? "profit" : ""}>${formatCurrency(t.netPayout)}</strong>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
