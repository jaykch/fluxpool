import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import { useUniswapPools } from '../lib/useUniswapPools';
import { usePrivy } from '@privy-io/react-auth';
import { DataTable } from '@/components/data-table';
import { poolColumns } from '@/components/data-table-columns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NETWORKS = [
  { id: 'mainnet', label: 'Ethereum Mainnet' },
  { id: 'arbitrum-one', label: 'Arbitrum One' },
];

export default function DiscoverPage() {
  const { user } = usePrivy();
  const { pools, loading, error, fetchPools } = useUniswapPools();
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  useEffect(() => {
    fetchPools(10, selectedNetwork);
  }, [selectedNetwork]);

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
        {/* Chain Selector Tabs */}
        <div className="mb-4">
          <Tabs value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <TabsList>
              {NETWORKS.map((net) => (
                <TabsTrigger key={net.id} value={net.id}>
                  {net.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
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
          <DataTable columns={poolColumns} data={pools} caption={`Top Uniswap V3 Pools (${NETWORKS.find(n => n.id === selectedNetwork)?.label})`} />
        )}
      </main>
    </Layout>
  );
} 