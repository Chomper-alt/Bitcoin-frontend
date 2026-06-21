import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowUpRight, BarChart3, Bitcoin, FlaskConical, LogOut, RotateCcw, Timer, TrendingUp, Waves, X } from "lucide-react";
import { GiNotebook } from "react-icons/gi";
import "./DemoTrade.css";

export default function DemoTrade() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // === STATE ===
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState(() => {
    return parseFloat(localStorage.getItem("demoBalance")) || 10000;
  });
  const [activeTrade, setActiveTrade] = useState(null);
  const [history, setHistory] = useState([]);
  const [trades, setTrades] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const dataRef = useRef([]);
  const activeTradeRef = useRef(null);

  // User input
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeDuration, setTradeDuration] = useState("5");
  const [selectedSide, setSelectedSide] = useState("BUY");

  // Toggles
  const [showEMA, setShowEMA] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  // Reset balance
  const resetBalance = () => {
    setBalance(10000);
    localStorage.setItem("demoBalance", 10000);
  };

  // === Candle generator ===
  const generateCandle = (prevClose) => {
    const high = 120000;
    const low = 100000;
    const close = prevClose + (Math.random() - 0.5) * 500;
    return {
      open: prevClose,
      close: Math.min(Math.max(close, low), high),
      high: Math.min(Math.max(close + Math.random() * 200, low), high),
      low: Math.min(Math.max(close - Math.random() * 200, low), high),
      volume: Math.random() * 1000,
    };
  };

  // === RSI calc ===
  const calculateRSI = (candles, period = 14) => {
    if (candles.length < period) return [];
    const rsi = [];
    for (let i = period; i < candles.length; i++) {
      let gains = 0,
        losses = 0;
      for (let j = i - period; j < i; j++) {
        const diff = candles[j + 1].close - candles[j].close;
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }
      const rs = gains / (losses || 1);
      rsi.push(100 - 100 / (1 + rs));
    }
    return rsi;
  };

  // === EMA calc ===
  const calculateEMA = (candles, period = 9) => {
    if (candles.length < period) return [];
    let k = 2 / (period + 1);
    let emaArray = [];
    let ema = candles[0].close;
    candles.forEach((candle) => {
      ema = candle.close * k + ema * (1 - k);
      emaArray.push(ema);
    });
    return emaArray;
  };

  const latestPrice = data[data.length - 1]?.close ?? 0;
  const startingBalance = 10000;
  const profitLoss = Number(balance || 0) - startingBalance;
  const profitPercent = startingBalance > 0 ? (profitLoss / startingBalance) * 100 : 0;
  const activePnL = activeTrade
    ? ((activeTrade.type === "BUY" ? latestPrice - activeTrade.entryPrice : activeTrade.entryPrice - latestPrice) / Math.max(activeTrade.entryPrice, 1)) * activeTrade.amount
    : 0;

  const quickAmounts = [100, 500, 1000, 5000];

  // === Place Trade ===
  const placeTrade = (type = selectedSide) => {
    const amount = Number(tradeAmount);
    const duration = Number(tradeDuration);
    const latestData = dataRef.current;
    const currentCandle = latestData[latestData.length - 1];

    if (!amount || amount <= 0 || !duration || !currentCandle) return;
    if (activeTradeRef.current) return;

    const trade = {
      id: `${Date.now()}-${type}`,
      type,
      amount,
      entryPrice: currentCandle.close,
      startIndex: latestData.length - 1,
      expiresAt: Date.now() + duration * 1000,
    };

    activeTradeRef.current = trade;
    setActiveTrade(trade);
    setCountdown(duration);
    setTrades((prev) => [...prev, trade]);
  };

  const resolveTrade = (trade) => {
    if (!trade) return;

    const latestData = dataRef.current;
    const exitPrice = latestData[latestData.length - 1]?.close ?? trade.entryPrice;
    const won =
      (trade.type === "BUY" && exitPrice > trade.entryPrice) ||
      (trade.type === "SELL" && exitPrice < trade.entryPrice);
    const result = won ? trade.amount : -trade.amount;

    setBalance((prev) => Math.max(0, Number(prev || 0) + result));
    setHistory((prev) => [...prev, { ...trade, exitPrice, result }]);
    setActiveTrade(null);
    activeTradeRef.current = null;
    setCountdown(null);
  };

  // === Countdown + Resolve Trade ===
  useEffect(() => {
    if (!activeTrade) {
      setCountdown(null);
      return undefined;
    }

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((activeTrade.expiresAt - Date.now()) / 1000));
      setCountdown(remaining);

      if (remaining <= 0) {
        window.clearInterval(timer);
        resolveTrade(activeTrade);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [activeTrade]);

  // === Price feed simulation ===
  useEffect(() => {
    let candles = [];
    let prevClose = 110000;

    const interval = setInterval(() => {
      const newCandle = generateCandle(prevClose);
      prevClose = newCandle.close;
      candles.push(newCandle);
      if (candles.length > 100) candles.shift();
      const nextCandles = [...candles];
      dataRef.current = nextCandles;
      setData(nextCandles);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save balance persistently
  useEffect(() => {
    localStorage.setItem("demoBalance", balance);
  }, [balance]);

  // === Chart Drawing: Terminal V3 ===
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(260, Math.floor(rect.height));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const isMobileCanvas = width <= 640;
    const pad = {
      left: isMobileCanvas ? 12 : 16,
      right: isMobileCanvas ? 54 : 66,
      top: 14,
      bottom: 16,
    };

    const plotW = Math.max(180, width - pad.left - pad.right);
    const plotH = Math.max(190, height - pad.top - pad.bottom);
    const mainH = Math.floor(plotH * 0.70);
    const volumeH = showVolume ? Math.floor(plotH * 0.16) : 0;
    const rsiH = showRSI ? Math.max(44, plotH - mainH - volumeH - 16) : 0;
    const volumeY = pad.top + mainH + 8;
    const rsiY = volumeY + volumeH + (showVolume ? 8 : 0);
    const mainY = pad.top;
    const chartRight = pad.left + plotW;

    const visibleTarget = isMobileCanvas ? 48 : 72;
    const visibleData = data.slice(-visibleTarget);
    const startIndex = Math.max(0, data.length - visibleData.length);
    const highs = visibleData.map((c) => c.high);
    const lows = visibleData.map((c) => c.low);
    const rawMax = Math.max(...highs);
    const rawMin = Math.min(...lows);
    const rawRange = Math.max(1, rawMax - rawMin);
    const maxPrice = rawMax + rawRange * 0.08;
    const minPrice = rawMin - rawRange * 0.08;
    const priceRange = Math.max(1, maxPrice - minPrice);
    const step = plotW / Math.max(visibleData.length, 1);
    const candleW = Math.max(3, Math.min(isMobileCanvas ? 7 : 9, step * 0.56));

    const priceY = (price) => mainY + ((maxPrice - price) / priceRange) * mainH;
    const candleX = (i) => pad.left + i * step + step / 2;
    const money = (value) => Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });

    // background
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, "#07131f");
    bg.addColorStop(1, "#050b12");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // subtle grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.10)";
    ctx.fillStyle = "rgba(226, 232, 240, 0.78)";
    ctx.font = isMobileCanvas ? "10px system-ui, -apple-system, Segoe UI" : "11px system-ui, -apple-system, Segoe UI";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = mainY + (i / gridLines) * mainH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();

      const value = maxPrice - (i / gridLines) * priceRange;
      ctx.fillStyle = "rgba(226, 232, 240, 0.70)";
      ctx.fillText(money(value), chartRight + 8, y);
    }

    const verticalLines = 4;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.055)";
    for (let i = 1; i < verticalLines; i++) {
      const x = pad.left + (i / verticalLines) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, mainY);
      ctx.lineTo(x, mainY + mainH + volumeH + rsiH + 16);
      ctx.stroke();
    }

    // volume zone divider
    if (showVolume) {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.10)";
      ctx.beginPath();
      ctx.moveTo(pad.left, volumeY);
      ctx.lineTo(chartRight, volumeY);
      ctx.stroke();
    }

    // RSI zone
    if (showRSI) {
      ctx.strokeStyle = "rgba(148, 163, 184, 0.10)";
      ctx.beginPath();
      ctx.moveTo(pad.left, rsiY);
      ctx.lineTo(chartRight, rsiY);
      ctx.stroke();
      ctx.fillStyle = "rgba(96, 165, 250, 0.82)";
      ctx.font = "10px system-ui, -apple-system, Segoe UI";
      ctx.fillText("RSI", pad.left, rsiY + 10);
    }

    // volume bars
    if (showVolume) {
      const maxVol = Math.max(1, ...visibleData.map((c) => c.volume));
      visibleData.forEach((candle, i) => {
        const x = candleX(i) - candleW / 2;
        const barH = Math.max(1, (candle.volume / maxVol) * (volumeH - 4));
        const up = candle.close >= candle.open;
        ctx.fillStyle = up ? "rgba(34, 197, 94, 0.28)" : "rgba(239, 68, 68, 0.25)";
        ctx.fillRect(x, volumeY + volumeH - barH, candleW, barH);
      });
    }

    // candles
    visibleData.forEach((candle, i) => {
      const x = candleX(i);
      const openY = priceY(candle.open);
      const closeY = priceY(candle.close);
      const highY = priceY(candle.high);
      const lowY = priceY(candle.low);
      const up = candle.close >= candle.open;
      const wick = up ? "rgba(34, 197, 94, 0.85)" : "rgba(239, 68, 68, 0.85)";
      const body = up ? "#22e065" : "#ff3b3b";
      const top = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(closeY - openY));

      ctx.strokeStyle = wick;
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      ctx.fillStyle = body;
      ctx.fillRect(x - candleW / 2, top, candleW, bodyH);
    });

    // EMA line
    if (showEMA) {
      const ema = calculateEMA(visibleData, 9);
      ctx.strokeStyle = "rgba(250, 204, 21, 0.95)";
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      ema.forEach((value, i) => {
        const x = candleX(i);
        const y = priceY(value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // RSI line in its own small zone
    if (showRSI && rsiH > 0) {
      const rsi = calculateRSI(visibleData, 14);
      const offset = visibleData.length - rsi.length;
      const rsiScaleY = (value) => rsiY + 4 + ((100 - value) / 100) * (rsiH - 8);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.95)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      rsi.forEach((value, i) => {
        const x = candleX(i + offset);
        const y = rsiScaleY(value);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // 70/30 guide lines
      ctx.strokeStyle = "rgba(96, 165, 250, 0.18)";
      [70, 30].forEach((level) => {
        const y = rsiScaleY(level);
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(chartRight, y);
        ctx.stroke();
      });
    }

    // current price marker
    const latest = visibleData[visibleData.length - 1];
    if (latest) {
      const y = priceY(latest.close);
      const markerColor = latest.close >= latest.open ? "#22c55e" : "#ef4444";
      ctx.strokeStyle = `${markerColor}99`;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      ctx.setLineDash([]);

      const label = `$${money(latest.close)}`;
      ctx.font = "10px system-ui, -apple-system, Segoe UI";
      const labelW = ctx.measureText(label).width + 12;
      ctx.fillStyle = markerColor;
      ctx.fillRect(chartRight + 4, y - 10, labelW, 20);
      ctx.fillStyle = "#03110a";
      ctx.textAlign = "center";
      ctx.fillText(label, chartRight + 4 + labelW / 2, y);
      ctx.textAlign = "left";
    }

    // trade markers
    trades.forEach((trade) => {
      if (trade.startIndex < startIndex) return;
      const idx = trade.startIndex - startIndex;
      if (idx < 0 || idx >= visibleData.length) return;
      const x = candleX(idx);
      const y = priceY(trade.entryPrice);
      const color = trade.type === "BUY" ? "#22c55e" : "#ef4444";
      ctx.fillStyle = color;
      ctx.beginPath();
      if (trade.type === "BUY") {
        ctx.moveTo(x, y - 13);
        ctx.lineTo(x - 6, y - 3);
        ctx.lineTo(x + 6, y - 3);
      } else {
        ctx.moveTo(x, y + 13);
        ctx.lineTo(x - 6, y + 3);
        ctx.lineTo(x + 6, y + 3);
      }
      ctx.closePath();
      ctx.fill();
    });

    // time labels
    ctx.fillStyle = "rgba(226, 232, 240, 0.65)";
    ctx.font = "10px system-ui, -apple-system, Segoe UI";
    ctx.textAlign = "center";
    const labelY = height - 8;
    const labelCount = 4;
    for (let i = 0; i <= labelCount; i++) {
      const x = pad.left + (i / labelCount) * plotW;
      const mins = 15 * i;
      ctx.fillText(`${String(10 + Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`, x, labelY);
    }
  }, [data, showEMA, showRSI, showVolume, trades]);

  return (
    <div className="demo-trade demo-terminal-v2">
      <section className="demo-account-card">
        <div className="demo-account-copy">
          <span className="demo-kicker"><FlaskConical size={16} /> Demo Account</span>
          <p>Balance</p>
          <strong>${Number(balance || 0).toFixed(2)}</strong>
        </div>
        <div className="demo-account-actions">
          <button className="terminal-action-btn" onClick={resetBalance} aria-label="Reset demo balance" title="Reset balance">
            <RotateCcw size={18} aria-hidden="true" />
            <span>Reset</span>
          </button>
          <button className="terminal-action-btn" onClick={() => navigate("/dashboard/trade")} aria-label="Exit demo trading" title="Exit">
            <LogOut size={18} aria-hidden="true" />
            <span>Exit</span>
          </button>
        </div>
      </section>

      <section className="demo-pair-card">
        <div className="demo-pair-left">
          <span className="demo-coin-icon"><Bitcoin size={22} /></span>
          <div>
            <strong>BTC/USDT</strong>
            <p>Bitcoin / Tether</p>
          </div>
        </div>
        <div className="demo-pair-price">
          <strong>${Number(latestPrice || 110000).toFixed(2)}</strong>
          <span><TrendingUp size={14} /> 24h +2.45%</span>
        </div>
      </section>

      <section className="demo-chart-card">
        <div className="demo-chart-tabs" aria-label="Timeframes">
          <span>1m</span>
          <span className="active">5m</span>
          <span>15m</span>
          <span>1H</span>
          <span>4H</span>
          <span>1D</span>
        </div>
        <canvas ref={canvasRef} className="chart"></canvas>
      </section>

      <section className="demo-ticket-card">
        <div className="side-switch" role="tablist" aria-label="Trade side">
          <button type="button" className={selectedSide === "BUY" ? "active buy" : ""} onClick={() => setSelectedSide("BUY")} disabled={!!activeTrade}>BUY</button>
          <button type="button" className={selectedSide === "SELL" ? "active sell" : ""} onClick={() => setSelectedSide("SELL")} disabled={!!activeTrade}>SELL</button>
        </div>

        <div className="ticket-fields">
          <label>
            <span>Amount (USDT)</span>
            <input
              type="number"
              placeholder="Amount"
              className="amount-input"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
            />
          </label>
          <label>
            <span>Duration</span>
            <select
              className="duration-select"
              value={tradeDuration}
              onChange={(e) => setTradeDuration(e.target.value)}
            >
              <option value="5">5 sec</option>
              <option value="10">10 sec</option>
              <option value="30">30 sec</option>
              <option value="60">1 min</option>
              <option value="300">5 min</option>
            </select>
          </label>
        </div>

        <div className="quick-amounts">
          {quickAmounts.map((amount) => (
            <button key={amount} type="button" className={Number(tradeAmount) === amount ? "active" : ""} onClick={() => setTradeAmount(String(amount))} disabled={!!activeTrade}>
              {amount.toLocaleString()}
            </button>
          ))}
          <button type="button" onClick={() => setTradeAmount(String(Math.floor(Number(balance || 0))))} disabled={!!activeTrade}>MAX</button>
        </div>

        <button className={`execute-trade ${selectedSide.toLowerCase()}`} onClick={() => placeTrade(selectedSide)} disabled={!!activeTrade}>
          Execute Trade ({selectedSide})
          <ArrowUpRight size={18} />
        </button>
      </section>

      <section className="indicator-pill-row" aria-label="Indicators">
        <button type="button" className={showEMA ? "active" : ""} onClick={() => setShowEMA(!showEMA)}><Activity size={16} /> EMA</button>
        <button type="button" className={showRSI ? "active" : ""} onClick={() => setShowRSI(!showRSI)}><Waves size={16} /> RSI</button>
        <button type="button" className={showVolume ? "active" : ""} onClick={() => setShowVolume(!showVolume)}><BarChart3 size={16} /> Volume</button>
      </section>

      {activeTrade && (
        <section className="open-trade-card">
          <div className="open-trade-head">
            <h3>Open Trade</h3>
            <span className={activeTrade.type === "BUY" ? "trade-badge buy" : "trade-badge sell"}>{activeTrade.type}</span>
          </div>
          <strong className="open-symbol">BTC/USDT</strong>
          <div className="open-trade-grid">
            <div><span>Entry</span><strong>${activeTrade.entryPrice.toFixed(2)}</strong></div>
            <div><span>Current</span><strong>${Number(latestPrice || activeTrade.entryPrice).toFixed(2)}</strong></div>
            <div><span>PnL</span><strong className={activePnL >= 0 ? "profit" : "loss"}>{activePnL >= 0 ? "+" : ""}${activePnL.toFixed(2)}</strong></div>
            <div><span>Time Left</span><strong><Timer size={14} /> {countdown ?? 0}s</strong></div>
          </div>
        </section>
      )}

      <section className="performance-card">
        <div className="performance-head">
          <h3>Performance</h3>
          <button
            type="button"
            className="history-icon-btn"
            onClick={() => setShowHistory(true)}
            aria-label="Open trade history"
            title="Trade history"
          >
            <GiNotebook aria-hidden="true" />
          </button>
        </div>
        <div className="performance-grid">
          <div><span>Starting Balance</span><strong>${startingBalance.toFixed(2)}</strong></div>
          <div><span>Current Balance</span><strong>${Number(balance || 0).toFixed(2)}</strong></div>
          <div><span>Profit / Loss</span><strong className={profitLoss >= 0 ? "profit" : "loss"}>{profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)} ({profitPercent.toFixed(2)}%)</strong></div>
        </div>
      </section>

      {showHistory && (
        <div className="history-modal-backdrop" role="presentation" onClick={() => setShowHistory(false)}>
          <section
            className="history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-trade-history-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="history-modal-head">
              <div>
                <span className="history-modal-kicker">Demo Trades</span>
                <h3 id="demo-trade-history-title">Trade History</h3>
              </div>
              <button type="button" className="history-close-btn" onClick={() => setShowHistory(false)} aria-label="Close trade history">
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {history.length === 0 ? (
              <p className="empty-history">No closed demo trades yet.</p>
            ) : (
              <div className="history-card-list">
                {history.slice().reverse().map((h, idx) => (
                  <article className="history-card" key={`${h.id}-${idx}`}>
                    <div><strong>{h.type}</strong><span>${Number(h.amount || 0).toLocaleString()}</span></div>
                    <div><span>Entry</span><strong>${Number(h.entryPrice || 0).toFixed(2)}</strong></div>
                    <div><span>Exit</span><strong>${Number(h.exitPrice || 0).toFixed(2)}</strong></div>
                    <div><span>Result</span><strong className={h.result >= 0 ? "profit" : "loss"}>{h.result >= 0 ? "+" : ""}${Number(h.result || 0).toLocaleString()}</strong></div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
