import { CandlestickData } from 'lightweight-charts';

export function generateSampleData(tokenSymbol: string = 'BTC', days: number = 730): CandlestickData[] {
  const data: CandlestickData[] = [];
  const tokenConfigs: { [key: string]: { basePrice: number; volatility: number; drift: number } } = {
    'BTC': { basePrice: 45000, volatility: 0.012, drift: 0.0002 },
    'ETH': { basePrice: 2800, volatility: 0.015, drift: 0.0003 },
    'ADA': { basePrice: 0.45, volatility: 0.018, drift: -0.0001 },
    'DOT': { basePrice: 6.5, volatility: 0.017, drift: 0.0001 },
    'LINK': { basePrice: 14, volatility: 0.018, drift: 0.0002 },
    'UNI': { basePrice: 7.5, volatility: 0.017, drift: 0.0002 },
    'AVAX': { basePrice: 32, volatility: 0.02, drift: 0.0003 },
    'MATIC': { basePrice: 0.75, volatility: 0.022, drift: 0.0004 },
    'ATOM': { basePrice: 8.5, volatility: 0.017, drift: 0.0001 },
  };
  const safeConfig = tokenConfigs[tokenSymbol] ?? tokenConfigs['BTC'] ?? { basePrice: 45000, volatility: 0.012, drift: 0.0002 };
  let currentPrice = safeConfig.basePrice;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Simulate a random walk with drift
    const drift = safeConfig.drift;
    let shock = (Math.random() - 0.5) * (safeConfig.volatility * 0.6); // Lower base volatility
    // Occasionally add a spike
    if (Math.random() < 0.02) {
      shock += (Math.random() - 0.5) * (safeConfig.volatility * 8);
    }
    const open = currentPrice;
    // Simulate close price with drift and shock
    let close = open * (1 + drift + shock);
    // Keep close price in a reasonable range
    close = Math.max(close, open * 0.97);
    close = Math.min(close, open * 1.03);
    // High/low are close to open/close, with small random wiggle
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    data.push({
      time: Math.floor(date.getTime() / 1000) as any,
      open,
      high,
      low,
      close,
    });
    currentPrice = close;
  }
  return data;
}

// Generate real-time data for live updates
export function generateRealTimeData(lastPrice: number, volatility: number = 0.01): CandlestickData {
  const change = (Math.random() - 0.5) * volatility;
  const close = lastPrice * (1 + change);
  const priceRange = Math.abs(close - lastPrice) * 0.3;
  const high = Math.max(lastPrice, close) + (Math.random() * priceRange);
  const low = Math.min(lastPrice, close) - (Math.random() * priceRange);
  
  return {
    time: Math.floor(Date.now() / 1000) as any,
    open: lastPrice,
    high: Math.max(lastPrice, close, high),
    low: Math.min(lastPrice, close, low),
    close: close,
  };
}

// Generate historical data for specific time periods
export function generateHistoricalData(tokenSymbol: string, period: '1D' | '1W' | '1M' | '3M' | '1Y' | '2Y'): CandlestickData[] {
  const periodDays: { [key: string]: number } = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '3M': 90,
    '1Y': 365,
    '2Y': 730,
  };
  
  return generateSampleData(tokenSymbol, periodDays[period]);
} 