// src/dashboard/trade/LiveTrade.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";   // ✅ IMPORT THEME
import "./LiveTrade.css";

export default function LiveTrade() {
  const { theme } = useTheme();  // ✅ MUST BE AT THE TOP

  const [selectedPair, setSelectedPair] = useState("BINANCE:BTCUSDT");
  const [timeframe, setTimeframe] = useState("60");

  const [walletBalance, setWalletBalance] = useState(0);
  const [activeTrade, setActiveTrade] = useState(null);
  const [history, setHistory] = useState([]);

  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradeDuration, setTradeDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api/livetrading",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  /** ---------------------------
   *  Fetch Wallet Balance
   --------------------------- */
  const fetchBalance = async () => {
    try {
      const res = await api.get("/balance");
      setWalletBalance(Number(res.data.balance || 0));
    } catch (err) {
      console.error("❌ Failed to fetch balance:", err);
    }
  };

  /** ---------------------------
   *  Fetch User Trades
   --------------------------- */
  const fetchTrades = async () => {
    try {
      const res = await api.get("/mytrades");
      const trades = res.data || [];
      setHistory(trades);

      const open = trades.find((t) => t.status === "open");
      if (open) {
        setActiveTrade(open);
        const createdAt = new Date(open.createdAt).getTime();
        const expiry = createdAt + Number(open.duration) * 1000;
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
    } catch (err) {
      console.error("❌ Failed to fetch trades:", err);
    }
  };

  /** ---------------------------
   *  Initial Load
   --------------------------- */
  useEffect(() => {
    fetchBalance();
    fetchTrades();
  }, []);

  /** ---------------------------
   *  Countdown Timer
   --------------------------- */
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(timer);
          handleAutoClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /** ---------------------------
   *  Mock price generator
   --------------------------- */
  const mockPriceForPair = (pair) => {
    const base = {
      "BINANCE:BTCUSDT": 112000,
      "BINANCE:ETHUSDT": 4800,
      "BINANCE:BNBUSDT": 1300,
      "BINANCE:SOLUSDT": 240,
    }[pair] ?? 112000;

    return base + (Math.random() - 0.5) * base * 0.01;
  };

  /** ---------------------------
   *  Start Trade
   --------------------------- */
  const placeTrade = async (direction) => {
    try {
      const amount = Number(tradeAmount);
      if (!amount || amount <= 0) return alert("Enter valid amount");

      const openPrice = mockPriceForPair(selectedPair);

      const payload = {
        capital: amount,
        pair: selectedPair.replace("BINANCE:", ""),
        direction,
        duration: Number(tradeDuration),
        openPrice,
      };

      const res = await api.post("/start", payload);
      const { trade, balance } = res.data;

      setActiveTrade(trade);
      setWalletBalance(balance);
      setHistory((prev) => [trade, ...prev]);
      setTimeLeft(Number(trade.duration));

    } catch (err) {
      console.error("❌ Error placing trade:", err);
      alert(err.response?.data?.message || "Failed to start trade");
    }
  };

  /** ---------------------------
   *  Manual Close
   --------------------------- */
  const closeTrade = async () => {
    if (!activeTrade) return;

    try {
      const closePrice = mockPriceForPair(activeTrade.pair);

      const res = await api.put(`/close/${activeTrade._id}`, {
        closePrice,
      });

      const { trade, balance } = res.data;

      setActiveTrade(null);
      setWalletBalance(balance);

      setHistory((prev) =>
        prev.map((t) => (t._id === trade._id ? trade : t))
      );

    } catch (err) {
      console.error("❌ Error closing trade:", err);
      alert(err.response?.data?.message || "Failed to close trade");
    }
  };

  /** ---------------------------
   *  Auto Close
   --------------------------- */
  const handleAutoClose = async () => {
    if (!activeTrade) return;

    try {
      const res = await api.put(`/close/${activeTrade._id}`);
      const { trade, balance } = res.data;

      setActiveTrade(null);
      setWalletBalance(balance);

      setHistory((prev) => [trade, ...prev]);

    } catch (err) {
      console.error("❌ Auto close error:", err);
    }
  };

  /** ---------------------------
   *  TradingView Chart (fixed)
   --------------------------- */
  const buildTVSrc = () =>
    `https://s.tradingview.com/widgetembed/?symbol=${selectedPair}&interval=${timeframe}&theme=${theme}&style=1&toolbarbg=0f0f0f`;

  /** ---------------------------
   *  UI RENDER
   --------------------------- */
  return (
    <div className="live-trade">
      <div className="chart-header">

        <div className="pair-selector">
          <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
            <option value="BINANCE:BTCUSDT">BTC/USDT</option>
            <option value="BINANCE:ETHUSDT">ETH/USDT</option>
            <option value="BINANCE:BNBUSDT">BNB/USDT</option>
            <option value="BINANCE:SOLUSDT">SOL/USDT</option>
          </select>
        </div>

        <div className="timeframes">
          {["1", "5", "15", "30", "60", "240", "D"].map((tf) => (
            <button
              key={tf}
              className={timeframe === tf ? "active" : ""}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="balance">
          <span style={{ color: "lime" }}>
            Balance: ${Number(walletBalance).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="chart-wrapper">
        <iframe
          title="tradingview"
          src={buildTVSrc()}
          className="chart-frame"
          frameBorder="0"
          allowtransparency="true"
          scrolling="no"
        />
      </div>

      <div className="trade-controls">
        <input
          type="number"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
          placeholder="Amount (USD)"
        />

        <select
          value={tradeDuration}
          onChange={(e) => setTradeDuration(parseInt(e.target.value))}
        >
          <option value={60}>1m</option>
          <option value={300}>5m</option>
          <option value={900}>15m</option>
        </select>

        <div style={{ display: "inline-flex", gap: 8 }}>
          <button className="buy-btn" onClick={() => placeTrade("buy")}>Buy</button>
          <button className="sell-btn" onClick={() => placeTrade("sell")}>Sell</button>
        </div>
      </div>

      {activeTrade ? (
        <div className="active-trade">
          <h4>Active Trade</h4>
          <p>{activeTrade.direction.toUpperCase()} {activeTrade.pair}</p>
          <p>Entry: ${activeTrade.openPrice.toFixed(2)}</p>
          <p>Amount: ${activeTrade.capital.toFixed(2)}</p>
          <p>Time Left: {timeLeft}s</p>
          <button onClick={closeTrade}>Close Trade</button>
        </div>
      ) : (
        <h3>No active trades</h3>
      )}

      <div className="trade-history">
        <h3>Trade History</h3>
        <table>
          <thead>
            <tr>
              <th>Pair</th>
              <th>Side</th>
              <th>Size</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>PnL</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h) => {
              const isClosed = h.status === "closed";
              const isProfit = h.result === "WIN";

              return (
                <tr
                  key={h._id}
                  className={isClosed ? (isProfit ? "green" : "red") : ""}
                >
                  <td>{h.pair}</td>
                  <td>{h.direction.toUpperCase()}</td>
                  <td>${h.capital.toFixed(2)}</td>
                  <td>${h.openPrice.toFixed(2)}</td>
                  <td>{h.closePrice ? `$${h.closePrice.toFixed(2)}` : "—"}</td>
                  <td className={isClosed ? (isProfit ? "profit" : "loss") : ""}>
                    {isClosed ? h.profitLoss.toFixed(2) : "—"}
                    <span className="result-tag">
                      {isClosed ? h.result : "OPEN"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
