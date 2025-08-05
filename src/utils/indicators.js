// utils/indicators.js

// Simple Moving Average
export function calculateSMA(data, windowSize) {
  if (data.length < windowSize) return [];
  let sma = [];
  for (let i = windowSize - 1; i < data.length; i++) {
    const windowSlice = data.slice(i - windowSize + 1, i + 1);
    const avg = windowSlice.reduce((sum, d) => sum + d.price, 0) / windowSize;
    sma.push({ date: data[i].date, value: avg });
  }
  return sma;
}

// Exponential Moving Average
export function calculateEMA(data, windowSize) {
  if (data.length < windowSize) return [];
  const k = 2 / (windowSize + 1);
  let ema = [];
  // Start with SMA for first EMA value
  const smaInitial = data.slice(0, windowSize).reduce((sum, d) => sum + d.price, 0) / windowSize;
  ema[windowSize - 1] = { date: data[windowSize - 1].date, value: smaInitial };
  for (let i = windowSize; i < data.length; i++) {
    const value = data[i].price * k + ema[i - 1].value * (1 - k);
    ema.push({ date: data[i].date, value });
  }
  return ema;
}
