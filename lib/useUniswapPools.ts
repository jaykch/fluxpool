import { useState } from 'react';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloat(min: number, max: number, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function useUniswapPools() {
  const [pools, setPools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = async (limit: string = '5', networkId: string = 'mainnet') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/uniswap-pools?limit=${limit}&network_id=${networkId}`);
      const data = await response.json();
      let basePools = Array.isArray(data.data) ? data.data : [];
      // Mock liquidity, TVL, volume, txCount
      basePools = basePools.map((p: any) => ({
        ...p,
        liquidity: getRandomInt(1_000_000, 100_000_000),
        totalValueLockedUSD: getRandomFloat(1_000_000, 500_000_000),
        volumeUSD: getRandomFloat(100_000, 50_000_000),
        txCount: getRandomInt(1_000, 1_000_000),
      }));
      setPools(basePools);
    } catch (err: any) {
      setError(err.message || 'Error fetching pools');
    } finally {
      setLoading(false);
    }
  };

  return { pools, loading, error, fetchPools };
} 