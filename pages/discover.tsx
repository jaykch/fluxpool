import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import { useUniswapPools, fetchSubgraphPoolData } from '../lib/useUniswapPools';
import { usePrivy } from '@privy-io/react-auth';
import { DataTable } from '@/components/data-table';
import { poolColumns } from '@/components/data-table-columns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Example known Arbitrum Uniswap V3 pool address (replace with a real one if needed)
const KNOWN_ARBITRUM_POOL = '0x905dfcd5649217c42684f23958568e533c711aa3';

export default function DiscoverPage() {
  const { user } = usePrivy();
  const { pools, loading, error, fetchPools } = useUniswapPools();
  const [rawSubgraph, setRawSubgraph] = useState<any>(null);
  const [fetchingRaw, setFetchingRaw] = useState(false);
  const [rawError, setRawError] = useState<string | null>(null);
  const [lastAddresses, setLastAddresses] = useState<string[]>([]);
  const [testKnown, setTestKnown] = useState<any>(null);
  const [fetchingKnown, setFetchingKnown] = useState(false);
  const [knownError, setKnownError] = useState<string | null>(null);

  useEffect(() => {
    fetchPools(10); // Fetch 10 pools
  }, []);

  const fetchRawSubgraph = async () => {
    setFetchingRaw(true);
    setRawError(null);
    try {
      const poolAddresses = pools.map((p: any) => p.pool.toLowerCase());
      setLastAddresses(poolAddresses);
      const data = await fetchSubgraphPoolData(poolAddresses);
      setRawSubgraph(data);
    } catch (err: any) {
      setRawError(err.message || 'Error fetching subgraph data');
    } finally {
      setFetchingRaw(false);
    }
  };

  const fetchKnownSubgraph = async () => {
    setFetchingKnown(true);
    setKnownError(null);
    try {
      setLastAddresses([KNOWN_ARBITRUM_POOL]);
      const data = await fetchSubgraphPoolData([KNOWN_ARBITRUM_POOL]);
      setTestKnown(data);
    } catch (err: any) {
      setKnownError(err.message || 'Error fetching known pool from subgraph');
    } finally {
      setFetchingKnown(false);
    }
  };

  return (
    <Layout
      accountId={user?.id ?? ""}
      appName="Discover"
      navbarItems={[]}
    >
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Discover Uniswap V3 Pools</h1>
        </div>
        {loading && pools.length === 0 && (
          <div className="flex justify-center py-12">
            <Button variant="ghost" size="icon" className="animate-spin" disabled>
              <Loader2 className="h-8 w-8 text-gray-400" />
            </Button>
          </div>
        )}
        {error && (
          <div className="text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
        )}
        {/* Only show table when not loading or when pools are present */}
        {(!loading || pools.length > 0) && (
          <DataTable columns={poolColumns} data={pools} caption="Top Uniswap V3 Pools" />
        )}
        {/* Debug: Fetch and display raw Subgraph data */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-2">Test Subgraph Data</h2>
          <div className="flex gap-2 mb-2">
            <Button onClick={fetchRawSubgraph} disabled={fetchingRaw || pools.length === 0}>
              {fetchingRaw ? 'Fetching...' : 'Fetch Subgraph Data for Table Pools'}
            </Button>
            <Button onClick={fetchKnownSubgraph} disabled={fetchingKnown} variant="secondary">
              {fetchingKnown ? 'Fetching...' : 'Test Known Arbitrum Pool'}
            </Button>
          </div>
          <div className="mb-2 text-xs text-gray-400">
            <span>Addresses sent to subgraph:</span>
            <pre className="bg-gray-900 text-gray-200 p-2 rounded max-h-24 overflow-x-auto overflow-y-auto">
              {JSON.stringify(lastAddresses, null, 2)}
            </pre>
          </div>
          {rawError && <div className="text-red-500 mb-2">{rawError}</div>}
          {rawSubgraph && (
            <pre className="bg-gray-900 text-gray-200 text-xs p-2 rounded mb-4 overflow-x-auto max-h-64">
              {JSON.stringify(rawSubgraph, null, 2)}
            </pre>
          )}
          {knownError && <div className="text-red-500 mb-2">{knownError}</div>}
          {testKnown && (
            <div>
              <div className="text-xs text-gray-400 mb-1">Known Arbitrum Pool Response:</div>
              <pre className="bg-gray-900 text-gray-200 text-xs p-2 rounded mb-4 overflow-x-auto max-h-64">
                {JSON.stringify(testKnown, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
} 