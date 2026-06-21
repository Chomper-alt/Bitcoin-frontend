// src/dashboard/trade/LiveTrade.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, BarChart3, BookOpen, LogOut, TrendingDown, TrendingUp, Wallet, X } from "lucide-react";
import api from "../../utils/axiosInstance";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import "./LiveTrade.css";

const safeNumber = (value, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};

const formatMoney = (value) => safeNumber(value).toFixed(2);

const pairLabel = (pair = "BINANCE:BTCUSDT") => pair.replace("BINANCE:", "").replace("USDT", "/USDT");

const pairMeta = {
  "BINANCE:BTCUSDT": { symbol: "BTCUSDT", cgId: "bitcoin", coinbase: "BTC-USD", fallback: 64000 },
  "BINANCE:ETHUSDT": { symbol: "ETHUSDT", cgId: "ethereum", coinbase: "ETH-USD", fallback: 3500 },
  "BINANCE:BNBUSDT": { symbol: "BNBUSDT", cgId: "binancecoin", coinbase: null, fallback: 650 },
  "BINANCE:SOLUSDT": { symbol: "SOLUSDT", cgId: "solana", coinbase: "SOL-USD", fallback: 150 },
};

const getPairMeta = (pair = "BINANCE:BTCUSDT") => pairMeta[pair] || pairMeta["BINANCE:BTCUSDT"];

const fetchJsonWithTimeout = async (url, timeoutMs = 2400) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    window.clearTimeout(timeout);
  }
};

export default function LiveTrade() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();

  const [selectedPair, setSelectedPair] = useState("BINANCE:BTCUSDT");
  const [timeframe] = useState("60");

  const [walletBalance, setWalletBalance] = useState(0);
  const walletBalanceRef = useRef(0);

  const [activeTrade, setActiveTrade] = useState(null);
  const activeTradeRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradeDuration, setTradeDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(null);
  const initialMarket = getPairMeta("BINANCE:BTCUSDT").fallback;
  const [marketPrice, setMarketPrice] = useState(initialMarket);
  const marketPriceRef = useRef(initialMarket);
  const [marketStats, setMarketStats] = useState({
    price: initialMarket,
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
  });
  const [showHistory, setShowHistory] = useState(false);
  const isClosingRef = useRef(false);

  const applyWalletBalance = useCallback((value) => {
    const next = safeNumber(value, walletBalanceRef.current);
    walletBalanceRef.current = next;
    setWalletBalance(next);
  }, []);

  const applyActiveTrade = useCallback((trade) => {
    activeTradeRef.current = trade || null;
    setActiveTrade(trade || null);
  }, []);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await api.get("/api/wallet/balance");
      applyWalletBalance(res.data?.balance);
      return safeNumber(res.data?.balance, walletBalanceRef.current);
    } catch (err) {
      console.error("❌ Failed to fetch balance:", err.response?.data || err.message);
      return walletBalanceRef.current;
    }
  }, [applyWalletBalance]);

  const fetchTrades = useCallback(async () => {
    try {
      const res = await api.get("/api/livetrading/mytrades");
      const trades = Array.isArray(res.data) ? res.data : [];
      setHistory(trades);

      const open = trades.find((t) => t.status === "open");
      if (open) {
        applyActiveTrade(open);
        const createdAt = new Date(open.createdAt).getTime();
        const expiry = createdAt + safeNumber(open.duration) * 1000;
        const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
        setTimeLeft(remaining);
      } else {
        applyActiveTrade(null);
        setTimeLeft(null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch trades:", err.response?.data || err.message);
    }
  }, [applyActiveTrade]);

  useEffect(() => {
    fetchBalance();
    fetchTrades();
  }, [fetchBalance, fetchTrades]);

  const cleanSymbol = useCallback((pair = selectedPair) => pair.replace("BINANCE:", ""), [selectedPair]);

  const applyMarketPrice = useCallback((value) => {
    const fallback = marketPriceRef.current || getPairMeta(selectedPair).fallback;
    const next = safeNumber(value, fallback);
    if (next > 0) {
      marketPriceRef.current = next;
      setMarketPrice(next);
      return next;
    }
    return fallback;
  }, [selectedPair]);

  const getSafeTradePrice = useCallback((pair = selectedPair) => {
    const last = safeNumber(marketPriceRef.current, 0);
    if (last > 0) return last;

    const fallback = getPairMeta(pair).fallback;
    marketPriceRef.current = fallback;
    setMarketPrice(fallback);
    return fallback;
  }, [selectedPair]);

  const fetchRealMarketPrice = useCallback(async (pair = selectedPair) => {
    const meta = getPairMeta(pair);
    const currentFallback = marketPriceRef.current || meta.fallback;

    // Primary: CoinGecko is generally browser/WebView friendly.
    try {
      const data = await fetchJsonWithTimeout(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(meta.cgId)}&vs_currencies=usd&include_24hr_change=true`,
        2200
      );
      const row = data?.[meta.cgId];
      const price = safeNumber(row?.usd, currentFallback);
      if (price > 0) {
        const prev = marketPriceRef.current || price;
        applyMarketPrice(price);
        const change = price - prev;
        setMarketStats({
          price,
          change,
          changePercent: prev > 0 ? (change / prev) * 100 : safeNumber(row?.usd_24h_change),
          high: 0,
          low: 0,
        });
        return price;
      }
    } catch (err) {
      console.warn("⚠ CoinGecko price fetch failed:", err.message);
    }

    // Secondary: Coinbase spot price for supported pairs.
    if (meta.coinbase) {
      try {
        const data = await fetchJsonWithTimeout(`https://api.coinbase.com/v2/prices/${meta.coinbase}/spot`, 1800);
        const price = safeNumber(data?.data?.amount, currentFallback);
        if (price > 0) {
          const prev = marketPriceRef.current || price;
          applyMarketPrice(price);
          const change = price - prev;
          setMarketStats({
            price,
            change,
            changePercent: prev > 0 ? (change / prev) * 100 : 0,
            high: 0,
            low: 0,
          });
          return price;
        }
      } catch (err) {
        console.warn("⚠ Coinbase price fetch failed:", err.message);
      }
    }

    // Final fallback: keep the last valid price. Never return 0/NaN to trading logic.
    const fallback = currentFallback || meta.fallback;
    applyMarketPrice(fallback);
    return fallback;
  }, [applyMarketPrice, selectedPair]);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      const price = await fetchRealMarketPrice(selectedPair);
      if (!isMounted || !price) return;
    };

    refresh();
    const ticker = window.setInterval(refresh, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(ticker);
    };
  }, [fetchRealMarketPrice, selectedPair]);

  const settleTrade = useCallback(
    async (tradeToClose, options = {}) => {
      const trade = tradeToClose || activeTradeRef.current;
      if (!trade || isClosingRef.current) return;

      isClosingRef.current = true;
      try {
        const closePrice = safeNumber(options.closePrice, getSafeTradePrice(trade.pair ? `BINANCE:${trade.pair}` : selectedPair));
        const res = await api.put(`/api/livetrading/close/${trade._id}`, { closePrice });
        const closedTrade = res.data?.trade || res.data;

        const nextBalance = res.data?.balance ?? res.data?.walletBalance;
        if (nextBalance !== undefined && nextBalance !== null) {
          applyWalletBalance(nextBalance);
        } else {
          await fetchBalance();
        }

        applyActiveTrade(null);
        setTimeLeft(null);
        await fetchCurrentUser?.();

        if (closedTrade?._id) {
          setHistory((prev) => {
            const exists = prev.some((item) => item._id === closedTrade._id);
            if (exists) {
              return prev.map((item) => (item._id === closedTrade._id ? closedTrade : item));
            }
            return [closedTrade, ...prev];
          });
        } else {
          await fetchTrades();
        }
      } catch (err) {
        console.error(options.auto ? "❌ Auto close error:" : "❌ Error closing trade:", err.response?.data || err.message);
        if (!options.auto) alert(err.response?.data?.message || "Failed to close trade");
      } finally {
        isClosingRef.current = false;
      }
    },
    [applyActiveTrade, applyWalletBalance, fetchBalance, fetchCurrentUser, fetchTrades, fetchRealMarketPrice, selectedPair]
  );

  useEffect(() => {
    if (!activeTrade || timeLeft === null) return undefined;

    if (timeLeft <= 0) {
      settleTrade(activeTrade, { auto: true });
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, safeNumber(prev) - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [activeTrade, timeLeft, settleTrade]);

  const placeTrade = async (direction) => {
    try {
      const amount = safeNumber(tradeAmount);
      if (!amount || amount <= 0) return alert("Enter valid amount");
      if (activeTradeRef.current) return alert("Close your active trade first");

      const openPrice = getSafeTradePrice(selectedPair);
      fetchRealMarketPrice(selectedPair).catch(() => null);
      const payload = {
        capital: amount,
        pair: selectedPair.replace("BINANCE:", ""),
        direction,
        duration: safeNumber(tradeDuration, 60),
        openPrice,
      };

      const res = await api.post("/api/livetrading/start", payload);
      const trade = res.data?.trade || res.data;

      if (!trade?._id) throw new Error("Trade start response did not include a valid trade");

      applyActiveTrade(trade);
      const nextBalance = res.data?.balance ?? res.data?.walletBalance;
      if (nextBalance !== undefined && nextBalance !== null) {
        applyWalletBalance(nextBalance);
      } else {
        await fetchBalance();
      }
      setHistory((prev) => [trade, ...prev.filter((item) => item._id !== trade._id)]);
      setTimeLeft(safeNumber(trade.duration, safeNumber(tradeDuration, 60)));
    } catch (err) {
      console.error("❌ Error placing trade:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to start trade");
    }
  };

  const closeTrade = async () => settleTrade(activeTradeRef.current, { closePrice: getSafeTradePrice(activeTradeRef.current?.pair ? `BINANCE:${activeTradeRef.current.pair}` : selectedPair) });

  const buildTVSrc = () =>
    `https://s.tradingview.com/widgetembed/?symbol=${selectedPair}&interval=${timeframe}&theme=${theme}&style=1&toolbarbg=0f0f0f`;

  const closedTrades = useMemo(() => history.filter((item) => item.status === "closed"), [history]);
  const totalPnl = useMemo(
    () => closedTrades.reduce((sum, item) => sum + safeNumber(item.profitLoss), 0),
    [closedTrades]
  );
  const activeExposure = safeNumber(activeTrade?.capital);
  const selectedLabel = pairLabel(selectedPair);
  const changeDirection = safeNumber(marketStats.change) >= 0 ? "up" : "down";

  return (
    <div className="live-trade live-terminal-v2">
      <header className="live-terminal-head">
        <div className="live-account-card">
          <div className="live-account-topline">
            <span className="live-eyebrow">Live Account</span>
            <button className="exit-trade-btn" onClick={() => navigate("/dashboard/trade")} aria-label="Exit live trading">
              <LogOut size={17} aria-hidden="true" />
              <span>Exit</span>
            </button>
          </div>

          <div className="live-balance-main">
            <Wallet size={22} aria-hidden="true" />
            <div>
              <small>Available Balance</small>
              <strong>${formatMoney(walletBalance)}</strong>
            </div>
          </div>

          <div className="live-account-metrics">
            <div>
              <small>Open Exposure</small>
              <b>${formatMoney(activeExposure)}</b>
            </div>
            <div>
              <small>Closed P/L</small>
              <b className={totalPnl >= 0 ? "profit" : "loss"}>${formatMoney(totalPnl)}</b>
            </div>
            <button className="live-history-icon" type="button" onClick={() => setShowHistory(true)} aria-label="Open live trade history">
              <BookOpen size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="live-market-card live-market-compact">
          <div className="pair-selector live-pair-selector">
            <label htmlFor="live-pair">Market</label>
            <select id="live-pair" value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)} disabled={!!activeTrade}>
              <option value="BINANCE:BTCUSDT">BTC/USDT</option>
              <option value="BINANCE:ETHUSDT">ETH/USDT</option>
              <option value="BINANCE:BNBUSDT">BNB/USDT</option>
              <option value="BINANCE:SOLUSDT">SOL/USDT</option>
            </select>
          </div>
          <div className="live-market-mini">
            <span className={changeDirection === "up" ? "profit" : "loss"}>
              {changeDirection === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {formatMoney(marketStats.change)} ({safeNumber(marketStats.changePercent).toFixed(2)}%)
            </span>
          </div>
        </div>
      </header>

      <section className="chart-wrapper live-chart-card" aria-label="Live TradingView chart">
        <div className="live-chart-head">
          <span><BarChart3 size={16} /> TradingView Chart</span>
          <b>{selectedLabel}</b>
        </div>
        <iframe title="tradingview" src={buildTVSrc()} className="chart-frame" frameBorder="0" scrolling="no" />
      </section>

      <section className="trade-controls live-ticket-card" aria-label="Live trade ticket">
        <div className="live-ticket-head">
          <span>Trade Ticket</span>
          <small>{activeTrade ? "Close active trade first" : "Ready"}</small>
        </div>

        <div className="live-ticket-grid">
          <label>
            <span>Amount</span>
            <input type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} placeholder="Amount (USD)" />
          </label>
          <label>
            <span>Duration</span>
            <select value={tradeDuration} onChange={(e) => setTradeDuration(parseInt(e.target.value, 10))}>
              <option value={60}>1m</option>
              <option value={300}>5m</option>
              <option value={900}>15m</option>
            </select>
          </label>
        </div>

        <div className="live-quick-amounts" aria-label="Quick trade amounts">
          {[100, 500, 1000, 5000].map((amount) => (
            <button type="button" key={amount} onClick={() => setTradeAmount(amount)} disabled={!!activeTrade}>${amount}</button>
          ))}
          <button type="button" onClick={() => setTradeAmount(Math.max(0, Math.floor(walletBalance)))} disabled={!!activeTrade}>MAX</button>
        </div>

        <div className="live-action-buttons">
          <button className="buy-btn" onClick={() => placeTrade("buy")} disabled={!!activeTrade}>
            <Activity size={16} /> Buy
          </button>
          <button className="sell-btn" onClick={() => placeTrade("sell")} disabled={!!activeTrade}>
            <Activity size={16} /> Sell
          </button>
        </div>
      </section>

      {activeTrade ? (
        <section className="active-trade live-position-card">
          <div className="live-position-head">
            <span>Open Position</span>
            <b className={String(activeTrade.direction || "").toLowerCase() === "buy" ? "profit" : "loss"}>
              {String(activeTrade.direction || "").toUpperCase()} {activeTrade.pair}
            </b>
          </div>
          <div className="live-position-grid">
            <div><small>Entry</small><b>${formatMoney(activeTrade.openPrice)}</b></div>
            <div><small>Current</small><b>${formatMoney(marketPrice)}</b></div>
            <div><small>Amount</small><b>${formatMoney(activeTrade.capital)}</b></div>
            <div><small>Time Left</small><b>{timeLeft ?? 0}s</b></div>
          </div>
          <button className="live-close-position" onClick={closeTrade} disabled={isClosingRef.current}>Close Trade</button>
        </section>
      ) : (
        <section className="live-empty-position">
          <span>No open position</span>
          <small>Choose amount, duration, then Buy or Sell.</small>
        </section>
      )}

      {showHistory && (
        <div className="live-history-modal" role="dialog" aria-modal="true" aria-label="Live trade history">
          <button className="live-history-backdrop" type="button" aria-label="Close history" onClick={() => setShowHistory(false)} />
          <div className="live-history-sheet">
            <div className="live-history-sheet-head">
              <div>
                <span>Live History</span>
                <small>{history.length} trades</small>
              </div>
              <button type="button" onClick={() => setShowHistory(false)} aria-label="Close live trade history">
                <X size={18} />
              </button>
            </div>
            <div className="live-history-list">
              {history.length === 0 ? (
                <div className="live-history-empty">No live trades yet.</div>
              ) : (
                history.map((h) => {
                  const isClosed = h.status === "closed";
                  const isProfit = h.result === "WIN" || safeNumber(h.profitLoss) >= 0;
                  return (
                    <article key={h._id} className={`live-history-card ${isClosed ? (isProfit ? "green" : "red") : ""}`}>
                      <div className="live-card-top">
                        <strong>{h.pair}</strong>
                        <span>{isClosed ? h.result : "OPEN"}</span>
                      </div>
                      <div className="live-card-grid">
                        <div><small>Side</small><b>{String(h.direction || "").toUpperCase()}</b></div>
                        <div><small>Size</small><b>${formatMoney(h.capital)}</b></div>
                        <div><small>Entry</small><b>${formatMoney(h.openPrice)}</b></div>
                        <div><small>PnL</small><b className={isClosed ? (isProfit ? "profit" : "loss") : ""}>{isClosed ? formatMoney(h.profitLoss) : "—"}</b></div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
