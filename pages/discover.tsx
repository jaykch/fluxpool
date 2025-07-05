import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import { useUniswapPools } from '../lib/useUniswapPools';
import { usePrivy } from '@privy-io/react-auth';
import { DataTable } from '@/components/data-table';
import { poolColumns } from '@/components/data-table-columns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function DiscoverPage() {
  const { user } = usePrivy();
  const { pools, loading, error, fetchPools } = useUniswapPools();
  const [rawTokenApi, setRawTokenApi] = useState<any>(null);
  const [fetchingRaw, setFetchingRaw] = useState(false);
  const [rawError, setRawError] = useState<string | null>(null);

  useEffect(() => {
    fetchPools(10); // Fetch 10 pools
  }, []);

  const fetchRawTokenApi = async () => {
    setFetchingRaw(true);
    setRawError(null);
    try {
      const res = await fetch('/api/uniswap-pools?limit=10');
      const data = await res.json();
      setRawTokenApi(data);
    } catch (err: any) {
      setRawError(err.message || 'Error fetching Token API data');
    } finally {
      setFetchingRaw(false);
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
        {/* Debug: Fetch and display raw Token API data */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-2">Test Token API Data</h2>
          <Button onClick={fetchRawTokenApi} disabled={fetchingRaw} className="mb-2">
            {fetchingRaw ? 'Fetching...' : 'Fetch Token API Data'}
          </Button>
          {rawError && <div className="text-red-500 mb-2">{rawError}</div>}
          {rawTokenApi && (
            <pre className="bg-gray-900 text-gray-200 text-xs p-2 rounded mb-4 overflow-x-auto max-h-64">
              {JSON.stringify(rawTokenApi, null, 2)}
            </pre>
          )}
        </div>
      </main>
    </Layout>
  );
} 