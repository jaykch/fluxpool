import { useState, useEffect } from 'react';

interface AssetPrice {
  price: number;
  change24h: number;
  loading: boolean;
  error: string | null;
}

export function useAssetPrice(symbol: string = 'ETH'): AssetPrice {
  const [price, setPrice] = useState<number>(2450.50); // Default fallback
  const [change24h, setChange24h] = useState<number>(2.34);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock API call - replace with actual API endpoint
        // For now, we'll simulate a real API call with some randomness
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        // Mock price data - replace this with actual API call
        const mockPrices: { [key: string]: { price: number; change: number } } = {
          'ETH': { price: 2450.50 + (Math.random() - 0.5) * 100, change: 2.34 + (Math.random() - 0.5) * 4 },
          'BTC': { price: 45000 + (Math.random() - 0.5) * 2000, change: 1.25 + (Math.random() - 0.5) * 3 },
          'SOL': { price: 102.30 + (Math.random() - 0.5) * 10, change: -1.25 + (Math.random() - 0.5) * 4 },
          'UNI': { price: 7.85 + (Math.random() - 0.5) * 1, change: 5.67 + (Math.random() - 0.5) * 3 },
          'LINK': { price: 14.20 + (Math.random() - 0.5) * 2, change: -0.89 + (Math.random() - 0.5) * 2 },
        };
        
        const assetData = mockPrices[symbol] || mockPrices['ETH'];
        setPrice(assetData.price);
        setChange24h(assetData.change);
        
      } catch (err) {
        setError('Failed to fetch price data');
        console.error('Error fetching asset price:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Set up interval to refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  return { price, change24h, loading, error };
} 