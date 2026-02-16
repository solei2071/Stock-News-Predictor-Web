export function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

export function linearForecast(prices: number[], horizon: number): number {
  const n = prices.length;
  if (n < 3 || horizon <= 0) return 0;

  const ys = prices.map((p) => Math.log(p));
  const meanX = (n - 1) / 2;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let denom = 0;
  let numer = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - meanX;
    denom += dx * dx;
    numer += dx * (ys[i] - meanY);
  }
  if (denom === 0) return 0;

  const slope = numer / denom;
  const intercept = meanY - slope * meanX;

  const forecastX = n - 1 + horizon;
  const forecastLog = intercept + slope * forecastX;
  return (Math.exp(forecastLog - Math.log(prices[n - 1])) - 1.0) * 100.0;
}

export function volatility(prices: number[]): number {
  if (prices.length < 2) return 0.25;

  const rets: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i - 1] <= 0) continue;
    rets.push(Math.log(prices[i] / prices[i - 1]));
  }
  if (rets.length < 2) return 0.25;

  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((sum, r) => sum + (r - mean) ** 2, 0) / rets.length;
  return Math.sqrt(variance);
}

export function addTradingDays(base: Date, count: number): Date {
  const dt = new Date(base);
  let remain = count;
  while (remain > 0) {
    dt.setDate(dt.getDate() + 1);
    const day = dt.getDay();
    if (day !== 0 && day !== 6) remain--;
  }
  return dt;
}
