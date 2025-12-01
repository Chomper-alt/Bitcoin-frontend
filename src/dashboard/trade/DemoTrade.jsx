import React, { useEffect, useRef, useState } from "react";
import "./DemoTrade.css";

export default function DemoTrade() {
  const canvasRef = useRef(null);

  // === STATE ===
  const [data, setData] = useState([]);
  const [balance, setBalance] = useState(() => {
    return parseFloat(localStorage.getItem("demoBalance")) || 10000;
  });
  const [activeTrade, setActiveTrade] = useState(null);
  const [history, setHistory] = useState([]);
  const [trades, setTrades] = useState([]);
  const [countdown, setCountdown] = useState(null);

  // User input
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeDuration, setTradeDuration] = useState("");

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

  // === Place Trade ===
  const placeTrade = (type) => {
    if (!tradeAmount || tradeAmount <= 0 || !tradeDuration) return;

    const currentCandle = data[data.length - 1];
    const trade = {
      type,
      amount: parseFloat(tradeAmount),
      entryPrice: currentCandle.close,
      startIndex: data.length - 1,
      expiresAt: Date.now() + tradeDuration * 1000,
    };

    setActiveTrade(trade);
    setTrades((prev) => [...prev, trade]);
  };

  // === Countdown + Resolve Trade ===
  useEffect(() => {
    if (!activeTrade) {
      setCountdown(null);
      return;
    }

    const timer = setInterval(() => {
      const timeLeft = Math.max(
        0,
        Math.floor((activeTrade.expiresAt - Date.now()) / 1000)
      );
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);

        // Close trade
        const exitPrice = data[data.length - 1]?.close || activeTrade.entryPrice;
        let result = 0;

        if (
          (activeTrade.type === "BUY" &&
            exitPrice > activeTrade.entryPrice) ||
          (activeTrade.type === "SELL" &&
            exitPrice < activeTrade.entryPrice)
        ) {
          result = activeTrade.amount; // +100% profit
          setBalance((b) => b + result);
        } else {
          result = -activeTrade.amount; // loss
          setBalance((b) => b + result);
        }

        setHistory((prev) => [
          ...prev,
          { ...activeTrade, exitPrice, result },
        ]);
        setActiveTrade(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTrade, data]);

  // === Price feed simulation ===
  useEffect(() => {
    let candles = [];
    let prevClose = 110000;

    const interval = setInterval(() => {
      const newCandle = generateCandle(prevClose);
      prevClose = newCandle.close;
      candles.push(newCandle);
      if (candles.length > 100) candles.shift();
      setData([...candles]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save balance persistently
  useEffect(() => {
    localStorage.setItem("demoBalance", balance);
  }, [balance]);

  // === Chart Drawing ===
  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const leftMargin = 60;
    const candleWidth = 8;
    const spacing = 2;
    const chartHeight = canvas.height * 0.7;
    const volumeHeight = canvas.height * 0.2;

    const maxPrice = Math.max(...data.map((c) => c.high));
    const minPrice = Math.min(...data.map((c) => c.low));
    const priceRange = maxPrice - minPrice;

    const scaleY = (price) =>
      chartHeight - ((price - minPrice) / priceRange) * chartHeight;

    // === Price Labels & Grid ===
    ctx.fillStyle = "#ccc";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const price = minPrice + (i / steps) * priceRange;
      const y = scaleY(price);
      ctx.fillText(`$${price.toFixed(0)}`, 5, y);
      ctx.strokeStyle = "#222";
      ctx.beginPath();
      ctx.moveTo(leftMargin, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // === Candles ===
    data.forEach((candle, i) => {
      const x = leftMargin + i * (candleWidth + spacing);
      const openY = scaleY(candle.open);
      const closeY = scaleY(candle.close);
      const highY = scaleY(candle.high);
      const lowY = scaleY(candle.low);

      ctx.strokeStyle = candle.close > candle.open ? "#0f0" : "#f00";
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, highY);
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      ctx.fillStyle = candle.close > candle.open ? "#0f0" : "#f00";
      ctx.fillRect(
        x,
        Math.min(openY, closeY),
        candleWidth,
        Math.abs(closeY - openY) || 1
      );
    });

    // === Volume Bars ===
    if (showVolume) {
      const maxVol = Math.max(...data.map((c) => c.volume));
      data.forEach((candle, i) => {
        const x = leftMargin + i * (candleWidth + spacing);
        const volHeight = (candle.volume / maxVol) * volumeHeight;
        ctx.fillStyle = "rgba(0, 150, 255, 0.5)";
        ctx.fillRect(
          x,
          canvas.height - volHeight,
          candleWidth,
          volHeight
        );
      });
    }

    // === EMA ===
    if (showEMA) {
      const ema = calculateEMA(data);
      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ema.forEach((value, i) => {
        const x = leftMargin + i * (candleWidth + spacing);
        const y =
          chartHeight - ((value - minPrice) / priceRange) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // === RSI ===
    if (showRSI) {
      const rsi = calculateRSI(data);
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      rsi.forEach((value, i) => {
        const x = leftMargin + (i + (data.length - rsi.length)) * (candleWidth + spacing);
        const y =
          chartHeight +
          volumeHeight -
          (value / 100) * volumeHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.fillStyle = "blue";
      ctx.fillText("RSI", 10, chartHeight + 10);
    }

    // === TRADE MARKERS ===
    trades.forEach((trade) => {
      const candleX = leftMargin + trade.startIndex * (candleWidth + spacing);
      const priceY = scaleY(trade.entryPrice);

      ctx.fillStyle = trade.type === "BUY" ? "lime" : "red";
      ctx.beginPath();

      if (trade.type === "BUY") {
        ctx.moveTo(candleX + candleWidth / 2, priceY - 12);
        ctx.lineTo(candleX + candleWidth / 2 - 6, priceY - 2);
        ctx.lineTo(candleX + candleWidth / 2 + 6, priceY - 2);
      } else {
        ctx.moveTo(candleX + candleWidth / 2, priceY + 12);
        ctx.lineTo(candleX + candleWidth / 2 - 6, priceY + 2);
        ctx.lineTo(candleX + candleWidth / 2 + 6, priceY + 2);
      }

      ctx.closePath();
      ctx.fill();
    });
  }, [data, showEMA, showRSI, showVolume, trades]);

  return (
    <div className="demo-trade">
      <div className="header">
        <h2>Demo Trading Simulator</h2>
        <div>
          <span className="balance">Balance: ${balance.toFixed(2)}</span>
          <button className="reset-btn" onClick={resetBalance}>
            Reset Balance
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="chart"></canvas>

      {/* === Trade Controls === */}
      <div className="trade-panel">
        <input
          type="number"
          placeholder="Amount"
          className="amount-input"
          value={tradeAmount}
          onChange={(e) => setTradeAmount(e.target.value)}
        />
        <select
          className="duration-select"
          value={tradeDuration}
          onChange={(e) => setTradeDuration(Number(e.target.value))}
        >
          <option value="">Duration</option>
          <option value={5}>5s</option>
          <option value={10}>10s</option>
          <option value={30}>30s</option>
          <option value={60}>1m</option>
          <option value={300}>5m</option>
        </select>

        <button onClick={() => placeTrade("BUY")} disabled={!!activeTrade}>
          Buy
        </button>
        <button onClick={() => placeTrade("SELL")} disabled={!!activeTrade}>
          Sell
        </button>

        {activeTrade && (
          <span className="countdown">⏳ {countdown}s left</span>
        )}
      </div>

      {/* === Toggles === */}
      <div className="toggle-panel">
        <label>
          <input
            type="checkbox"
            checked={showEMA}
            onChange={() => setShowEMA(!showEMA)}
          />
          Show EMA
        </label>
        <label>
          <input
            type="checkbox"
            checked={showRSI}
            onChange={() => setShowRSI(!showRSI)}
          />
          Show RSI
        </label>
        <label>
          <input
            type="checkbox"
            checked={showVolume}
            onChange={() => setShowVolume(!showVolume)}
          />
          Show Volume
        </label>
      </div>

      {/* === Trade History === */}
      <div className="history">
        <h3>Trade History</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr key={idx}>
                <td style={{ color: h.type === "BUY" ? "lime" : "red" }}>
                  {h.type}
                </td>
                <td>${h.amount}</td>
                <td>${h.entryPrice.toFixed(2)}</td>
                <td>${h.exitPrice.toFixed(2)}</td>
                <td style={{ color: h.result >= 0 ? "lime" : "red" }}>
                  {h.result >= 0 ? "+" : ""}
                  {h.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
