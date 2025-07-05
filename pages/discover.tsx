import { useEffect } from 'react';
import Layout from '@/components/layout';
import { useUniswapPools } from '../lib/useUniswapPools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePrivy } from '@privy-io/react-auth';

export default function DiscoverPage() {
  const { user } = usePrivy();
  const { pools, loading, error, fetchPools } = useUniswapPools();

  useEffect(() => {
    fetchPools(10); // Fetch 10 pools
  }, []);

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
        {loading && <div className="text-gray-400">Loading pools...</div>}
        {error && (
          <div className="text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools.map((pool) => (
            <Card key={pool.pool} className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg flex items-center space-x-2">
                  <span>{pool.token0.symbol} / {pool.token1.symbol}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">{pool.protocol}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-400">
                  Pool: {pool.pool.slice(0, 8)}...{pool.pool.slice(-4)}
                </div>
                <div className="text-xs text-gray-400">
                  Fee: {pool.fee / 10000}%
                </div>
                <div className="text-xs text-gray-500">
                  Network: {pool.network_id}
                </div>
                <div className="text-xs text-gray-500">
                  Block: {pool.block_num}
                </div>
                <div className="text-xs text-gray-500">
                  Last Updated: {pool.datetime}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {!loading && !error && pools.length === 0 && (
          <div className="text-gray-400 mt-4">No pools to display.</div>
        )}
      </main>
    </Layout>
  );
} 