import { CandlestickData } from 'lightweight-charts';

export function generateSampleData(days: number = 30): CandlestickData[] {
  const data: CandlestickData[] = [];
  let basePrice = 50000; // Starting price for BTC
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate random price movement
    const change = (Math.random() - 0.5) * 0.1; // ±5% change
    const open = basePrice;
    const close = basePrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    
    data.push({
      time: Math.floor(date.getTime() / 1000) as any,
      open: open,
      high: high,
      low: low,
      close: close,
    });
    
    basePrice = close;
  }
  
  return data;
}

export function generateRealTimeData(lastPrice: number): CandlestickData {
  const change = (Math.random() - 0.5) * 0.02; // ±1% change
  const close = lastPrice * (1 + change);
  const high = Math.max(lastPrice, close) * (1 + Math.random() * 0.01);
  const low = Math.min(lastPrice, close) * (1 - Math.random() * 0.01);
  
  return {
    time: Math.floor(Date.now() / 1000) as any,
    open: lastPrice,
    high: high,
    low: low,
    close: close,
  };
} 