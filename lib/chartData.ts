import { CandlestickData } from 'lightweight-charts';

export function generateSampleData(tokenSymbol: string = 'BTC', days: number = 730): CandlestickData[] {
  const data: CandlestickData[] = [];
  
  // Different base prices and volatility for different tokens
  const tokenConfigs: { [key: string]: { basePrice: number; volatility: number; trend: number } } = {
    'BTC': { basePrice: 45000, volatility: 0.03, trend: 0.0001 },
    'ETH': { basePrice: 2800, volatility: 0.04, trend: 0.0002 },
    // 'SOL': { basePrice: 95, volatility: 0.06, trend: 0.0003 },
    'ADA': { basePrice: 0.45, volatility: 0.05, trend: -0.0001 },
    'DOT': { basePrice: 6.5, volatility: 0.05, trend: 0.0001 },
    'LINK': { basePrice: 14, volatility: 0.06, trend: 0.0002 },
    'UNI': { basePrice: 7.5, volatility: 0.05, trend: 0.0002 },
    'AVAX': { basePrice: 32, volatility: 0.07, trend: 0.0003 },
    'MATIC': { basePrice: 0.75, volatility: 0.08, trend: 0.0004 },
    'ATOM': { basePrice: 8.5, volatility: 0.05, trend: 0.0001 },
  };
  
  const config = tokenConfigs[tokenSymbol] || tokenConfigs['BTC'];
  let currentPrice = config.basePrice;
  const now = new Date();
  
  // Generate 2 years of daily data (730 days)
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Ensure smooth price transitions
    const dailyChange = (Math.random() - 0.5) * config.volatility;
    const open = currentPrice;
    const close = currentPrice * (1 + dailyChange);
    
    // Ensure close price is reasonable
    const finalClose = Math.max(close, currentPrice * 0.7);
    const finalClose2 = Math.min(finalClose, currentPrice * 1.5);
    
    // Generate high/low that are always between open and close, or slightly beyond
    const priceRange = Math.abs(finalClose2 - open) * 0.5;
    const high = Math.max(open, finalClose2) + (Math.random() * priceRange);
    const low = Math.min(open, finalClose2) - (Math.random() * priceRange);
    
    // Ensure low is never negative or too low
    const safeLow = Math.max(low, currentPrice * 0.5);
    
    // Add subtle market events
    let eventMultiplier = 1;
    if (i === 365) eventMultiplier = 0.9;
    if (i === 180) eventMultiplier = 1.1;
    if (i === 90) eventMultiplier = 0.95;
    if (i === 30) eventMultiplier = 1.05;
    
    const finalOpen = open * eventMultiplier;
    const finalClose3 = finalClose2 * eventMultiplier;
    const finalHigh = high * eventMultiplier;
    const finalLow = safeLow * eventMultiplier;
    
    // Ensure data integrity - high should be highest, low should be lowest
    const actualHigh = Math.max(finalOpen, finalClose3, finalHigh);
    const actualLow = Math.min(finalOpen, finalClose3, finalLow);
    
    data.push({
      time: Math.floor(date.getTime() / 1000) as any,
      open: finalOpen,
      high: actualHigh,
      low: actualLow,
      close: finalClose3,
    });
    
    // Update current price for next iteration
    currentPrice = finalClose3;
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