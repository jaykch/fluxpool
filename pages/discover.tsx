import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import { useUniswapPools } from '../lib/useUniswapPools';
import { usePrivy } from '@privy-io/react-auth';
import { DataTable } from '@/components/data-table';
import { poolColumns } from '@/components/data-table-columns';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { topTradersColumns, mockTopTraders } from '@/components/TradingData';
import MiniChart from '@/components/MiniChart';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

const NETWORKS = [
  { id: 'mainnet', label: 'Ethereum Mainnet' },
  { id: 'arbitrum-one', label: 'Arbitrum One' },
];

export default function DiscoverPage() {
  const { user } = usePrivy();
  const { pools, loading, error, fetchPools } = useUniswapPools();
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  useEffect(() => {
    fetchPools("10", selectedNetwork);
  }, [selectedNetwork]);

  return (
    <Layout
      accountId={user?.id ?? ""}
      appName="Discover"
      navbarItems={[]}
    >
      <main className="flex flex-col md:flex-row gap-8 w-full px-4 py-8 md:py-12 min-h-[80vh]">
        {/* Main Feed (70%) */}
        <div className="flex-1 md:w-[70%] flex flex-col gap-4">
          {/* Top Traders */}
          <div className="p-2">
            <h2 className="text-lg font-bold text-white mb-1">Top Traders</h2>
            <DataTable columns={topTradersColumns} data={mockTopTraders} caption="Top Traders" />
          </div>
          {/* For You / Recommendations */}
          <div className="p-2">
            <h2 className="text-lg font-bold text-white mb-1">For You</h2>
            <div className="flex flex-col gap-3">
              {/* Mock personalized trader cards */}
              <div className="bg-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=ape4life" alt="ape4life" className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white truncate">ape4life.fluxpool.eth</div>
                    <span className="bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-1">Trending Broadcasts</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-green-400 font-bold text-sm">+$2,300</span>
                    <span className="text-green-400 font-bold text-xs">(+18.2%)</span>
                    <span className="text-gray-400 text-xs">1.2k followers</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1">Top trader this week. Most copied trades. </div>
                </div>
                <Link href="/profile/ape4life.fluxpool.eth" className="px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white text-xs font-semibold shadow hover:from-violet-600/80 hover:to-fuchsia-600/80 transition">View</Link>
              </div>
              <div className="bg-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=diamondhandz" alt="diamondhandz" className="w-12 h-12 rounded-full bg-white/10 border border-white/20" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white truncate">diamondhandz.fluxpool.eth</div>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-green-400 font-bold text-sm">+$1,120</span>
                    <span className="text-green-400 font-bold text-xs">(+9.7%)</span>
                    <span className="text-gray-400 text-xs">800 followers</span>
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-1">Consistent profits. Focused on ETH and UNI. </div>
                </div>
                <Link href="/profile/diamondhandz.fluxpool.eth" className="px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white text-xs font-semibold shadow hover:from-violet-600/80 hover:to-fuchsia-600/80 transition">View</Link>
              </div>
              {/* Token and pool cards as before */}
              <div className="bg-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=ETH" alt="ETH" className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                <div className="flex-1">
                  <div className="font-semibold text-white">ETH/USDT</div>
                  <div className="text-xs text-gray-400">Trending token. 24h volume up 32%. Most watched this week.</div>
                </div>
                <a href="/trade?token0=ETH&token1=USDT" className="px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white text-xs font-semibold shadow hover:from-violet-600/80 hover:to-fuchsia-600/80 transition">Trade</a>
              </div>
              <div className="bg-white/10 rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=Uniswap" alt="Uniswap" className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                <div className="flex-1">
                  <div className="font-semibold text-white">Uniswap V3 Pool</div>
                  <div className="text-xs text-gray-400">High-yield pool. APY 18%. Join with one click.</div>
                </div>
                <a href="/trade?pool=uniswapv3&token0=UNI&token1=ETH" className="px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white text-xs font-semibold shadow hover:from-violet-600/80 hover:to-fuchsia-600/80 transition">Join</a>
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar: Latest Tokens (30%) */}
        <aside className="w-full md:w-[30%] min-w-[320px] max-w-[400px] md:sticky md:top-24 flex flex-col gap-4 h-full flex-1">
          <div className="p-0 flex flex-col h-full flex-grow">
            <div className="flex items-center justify-between mb-2 px-2 pt-2">
              <h1 className="text-xl font-bold text-white">Latest Tokens</h1>
            </div>
            {/* Chain Selector Tabs - glassy, purple, rounded, shadow */}
            <div className="mb-2 px-2">
              <Tabs value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <TabsList className="mb-3 bg-transparent shadow-none border-none p-0">
                  {NETWORKS.map((net) => (
                    <TabsTrigger
                      key={net.id}
                      value={net.id}
                      className="px-4 py-2 rounded-xl transition-colors data-[state=active]:bg-white/10 data-[state=active]:backdrop-blur-lg data-[state=active]:shadow data-[state=active]:text-white"
                    >
                      {net.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="p-2 max-h-[90vh] h-full flex-1 overflow-y-auto">
              {loading && pools.length === 0 && (
                <div className="flex justify-center py-8">
                  <Button variant="ghost" size="icon" className="animate-spin" disabled>
                    <Loader2 className="h-8 w-8 text-gray-400" />
                  </Button>
                </div>
              )}
              {error && (
                <div className="text-red-500">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
              )}
              {/* Custom Latest Tokens list with more data */}
              {(!loading || pools.length > 0) && (
                <div className="flex flex-col gap-4">
                  {pools.map((pool) => (
                    <div key={pool.pool} className="flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 shadow-md">
                      {/* Token logo and info */}
                      <div className="flex items-center gap-3 w-full md:w-1/2">
                        <img
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${pool.token0.symbol}`}
                          alt={pool.token0.symbol}
                          className="w-10 h-10 rounded-full bg-white/10 border border-white/20"
                        />
                        <div>
                          <div className="font-semibold text-white text-base">{pool.token0.symbol} / {pool.token1.symbol}</div>
                          <div className="text-xs text-gray-400">Fee: {pool.fee / 10000}%</div>
                          <div className="text-xs text-gray-400">Protocol: {pool.protocol}</div>
                          <div className="text-xs text-gray-400">Block: <span className="text-white">{pool.block_num}</span></div>
                          <div className="text-xs text-gray-400">Last Updated: <span className="text-white">{pool.datetime}</span></div>
                          <div className="text-xs text-gray-400">Network: <span className="text-white">{pool.network_id}</span></div>
                        </div>
                      </div>
                      {/* Stats and actions */}
                      <div className="flex flex-col gap-1 w-full md:w-1/2 items-end">
                        <div className="text-xs text-gray-400">TVL: <span className="text-white">${pool.totalValueLockedUSD ? parseFloat(pool.totalValueLockedUSD).toLocaleString() : '-'}</span></div>
                        <div className="text-xs text-gray-400">Volume: <span className="text-white">${pool.volumeUSD ? parseFloat(pool.volumeUSD).toLocaleString() : '-'}</span></div>
                        <div className="text-xs text-gray-400">Liquidity: <span className="text-white">{pool.liquidity ? parseFloat(pool.liquidity).toLocaleString() : '-'}</span></div>
                        <a href={`/trade?pool=${pool.pool}&token0=${pool.token0.symbol}&token1=${pool.token1.symbol}`} className="mt-2 px-3 py-1 rounded-lg bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white text-xs font-semibold shadow hover:from-violet-600/80 hover:to-fuchsia-600/80 transition">Trade</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </main>
      {/* Onboarding/Education full-width at the bottom with shadcn elements */}
      <div className="w-full flex justify-center px-6 mb-8">
        <Card className="w-full max-w-[1600px] bg-white/10 rounded-xl py-6 px-4 md:px-8 flex flex-col gap-y-6 gap-x-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-8">
            <h2 className="text-2xl font-bold text-white">Onboarding & Education</h2>
            <Button className="bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white font-semibold shadow hover:from-violet-600/80 hover:to-fuchsia-600/80 transition">View Full Guide</Button>
          </div>
          {/* Stepper */}
          <div className="flex flex-col md:flex-row gap-x-12 items-center justify-center">
            <div className="flex flex-row gap-x-12 w-full max-w-3xl justify-center">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-violet-500/80 flex items-center justify-center text-white font-bold text-lg mb-2">1</div>
                <div className="text-white font-semibold">Connect Wallet</div>
                <div className="text-xs text-gray-400 text-center mt-1">Start by connecting your wallet to access all features.</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-violet-500/80 flex items-center justify-center text-white font-bold text-lg mb-2">2</div>
                <div className="text-white font-semibold">Explore & Follow</div>
                <div className="text-xs text-gray-400 text-center mt-1">Discover top traders, tokens, and pools. Follow your favorites.</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-violet-500/80 flex items-center justify-center text-white font-bold text-lg mb-2">3</div>
                <div className="text-white font-semibold">Trade & Broadcast</div>
                <div className="text-xs text-gray-400 text-center mt-1">Start trading, join pools, and share your moves with the community.</div>
              </div>
            </div>
          </div>
          {/* Callout/info card */}
          <div className="flex items-center gap-x-3 bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
            <Info className="h-6 w-6 text-violet-400" />
            <div className="text-white text-sm">Need help? Check out our <span className="underline underline-offset-2">FAQ</span> or join the community for support.</div>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 