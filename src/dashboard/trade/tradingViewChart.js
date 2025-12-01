// utils/tradingViewChart.js
export default function drawTradingViewChart(ctx, width, height, candles) {
  ctx.clearRect(0, 0, width, height);

  // background
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, width, height);

  if (!candles || candles.length === 0) {
    ctx.fillStyle = "#888";
    ctx.font = "16px Arial";
    ctx.fillText("Loading chart...", width / 2 - 50, height / 2);
    return;
  }

  // grid
  ctx.strokeStyle = "#333";
  for (let i = 0; i < 5; i++) {
    let y = (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // price range
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = max - min || 1; // avoid divide by zero

  const candleWidth = Math.max(5, width / candles.length - 2);

  candles.forEach((candle, i) => {
    const x = i * (candleWidth + 2);
    const scaleY = (p) => height - ((p - min) / range) * height;

    const openY = scaleY(candle.open);
    const closeY = scaleY(candle.close);
    const highY = scaleY(candle.high);
    const lowY = scaleY(candle.low);

    const color = candle.close >= candle.open ? "#26a69a" : "#ef5350";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    // wick
    ctx.beginPath();
    ctx.moveTo(x + candleWidth / 2, highY);
    ctx.lineTo(x + candleWidth / 2, lowY);
    ctx.stroke();

    // body
    const bodyHeight = Math.abs(openY - closeY);
    ctx.fillRect(
      x,
      Math.min(openY, closeY),
      candleWidth,
      bodyHeight < 1 ? 1 : bodyHeight // guarantee visible body
    );
  });
}
