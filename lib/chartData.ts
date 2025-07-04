import { CandlestickData } from 'lightweight-charts';

export function generateSampleData(tokenSymbol: string = 'BTC'): CandlestickData[] {
  const data: CandlestickData[] = [];
  
  // Different base prices for different tokens
  const basePrices: { [key: string]: number } = {
    'BTC': 50000,
    'ETH': 3000,
    'SOL': 100,
    'ADA': 0.5,
    'DOT': 7,
    'LINK': 15,
    'UNI': 8,
    'AVAX': 35,
    'MATIC': 0.8,
    'ATOM': 9,
  };
  
  let basePrice = basePrices[tokenSymbol] || 100;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.5) * 0.1;
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