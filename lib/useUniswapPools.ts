import { useState } from 'react';

const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV';

export async function fetchSubgraphPoolData(poolAddresses: string[]) {
  if (!poolAddresses.length) return {};
  const query = `{
    pools(where: { id_in: [${poolAddresses.map(addr => `\"${addr}\"`).join(',')}] }) {
      id
      liquidity
      volumeUSD
      totalValueLockedUSD
      txCount
    }
  }`;
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const { data } = await res.json();
  // Map by id for easy merging
  const map: Record<string, any> = {};
  if (data && data.pools) {
    for (const pool of data.pools) {
      map[pool.id.toLowerCase()] = pool;
    }
  }
  return map;
}

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
      let basePools = Array.isArray(data.data) ? data.data : [];
      // Fetch subgraph data for these pools
      const poolAddresses = basePools.map((p: any) => p.pool.toLowerCase());
      const subgraphMap = await fetchSubgraphPoolData(poolAddresses);
      // Merge subgraph data into base pools
      basePools = basePools.map((p: any) => ({
        ...p,
        ...subgraphMap[p.pool.toLowerCase()],
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