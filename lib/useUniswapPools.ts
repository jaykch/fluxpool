import { useState } from 'react';

export function useUniswapPools() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async (limit: number = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/uniswap-pools?limit=${limit}`);
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setPools(data.data);
      } else {
        setPools([]);
        setError('No pools found');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching pools');
    } finally {
      setLoading(false);
    }
  };

  return { pools, loading, error, fetchPools };
} 