import { usePrivy } from "@privy-io/react-auth";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Activity,
  Star,
  Eye,
  Play,
  Target
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BroadcastCard from "@/components/BroadcastCard";
import { useState } from "react";

// Inline SVG logo components for tokens
function EthereumLogoSVG({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#23292F" />
      <g>
        <polygon points="16,5 16,22.5 25,16.5" fill="#8C8C8C" />
        <polygon points="16,5 7,16.5 16,22.5" fill="#343434" />
        <polygon points="16,24 16,27 25,18" fill="#8C8C8C" />
        <polygon points="16,27 16,24 7,18" fill="#343434" />
        <polygon points="16,22.5 25,16.5 16,19.5" fill="#3C3C3B" />
        <polygon points="16,19.5 7,16.5 16,22.5" fill="#8C8C8C" />
      </g>
    </svg>
  );
}
function SolanaLogoSVG({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#131313" />
      <linearGradient id="solana-gradient-1" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient id="solana-gradient-2" x1="6" y1="14" x2="26" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient id="solana-gradient-3" x1="6" y1="20" x2="26" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <g>
        <rect x="8" y="9" width="16" height="3" rx="1.5" fill="url(#solana-gradient-1)" />
        <rect x="8" y="15" width="16" height="3" rx="1.5" fill="url(#solana-gradient-2)" />
        <rect x="8" y="21" width="16" height="3" rx="1.5" fill="url(#solana-gradient-3)" />
      </g>
    </svg>
  );
}
function BitcoinLogoSVG({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <g>
        <path d="M16 7v18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 11h7a3 3 0 0 1 0 6h-7m0 0h7a3 3 0 0 1 0 6h-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
function UniswapLogoSVG({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#FF007A" />
      <g>
        <path d="M10 22c2-2 10-2 12-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="20" cy="13" rx="1.5" ry="2.5" fill="#fff" />
        <ellipse cx="12" cy="19" rx="1.5" ry="2.5" fill="#fff" />
      </g>
    </svg>
  );
}

const tokenLogos: Record<string, () => JSX.Element> = {
  ETH: () => <EthereumLogoSVG className="w-6 h-6" />, // Use SVG for ETH
  SOL: () => <SolanaLogoSVG className="w-6 h-6" />, // Use SVG for SOL
  BTC: () => <BitcoinLogoSVG className="w-6 h-6" />, // Use SVG for BTC
  UNI: () => <UniswapLogoSVG className="w-6 h-6" />, // Use SVG for UNI
};

export default function HomePage() {
  const { user, ready, authenticated } = usePrivy();

  // Mock market data
  const marketData = {
    totalMarketCap: "2.45T",
    totalVolume24h: "156.7B",
    activeTraders: "2.3M",
    totalTransactions: "45.2M"
  };

  // Mock trending tokens
  const trendingTokens = [
    {
      id: 1,
      symbol: "ETH",
      name: "Ethereum",
      price: 2450.50,
      change24h: 2.34,
      marketCap: "2.45B",
      volume24h: "156.7M"
    },
    {
      id: 2,
      symbol: "SOL",
      name: "Solana",
      price: 102.30,
      change24h: -1.25,
      marketCap: "1.23B",
      volume24h: "89.4M"
    },
    {
      id: 3,
      symbol: "UNI",
      name: "Uniswap",
      price: 7.85,
      change24h: 5.67,
      marketCap: "890M",
      volume24h: "45.2M"
    }
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: "trade",
      user: "0x1234...5678",
      action: "Bought 2.5 ETH",
      amount: "$6,125",
      time: "2 min ago"
    },
    {
      id: 2,
      type: "liquidity",
      user: "0xabcd...efgh",
      action: "Added liquidity to ETH/USDT",
      amount: "$12,450",
      time: "5 min ago"
    },
    {
      id: 3,
      type: "trade",
      user: "0x9876...4321",
      action: "Sold 15 SOL",
      amount: "$1,534",
      time: "8 min ago"
    }
  ];

  // Mock broadcast data (10 trending, 4 following)
  const mockBroadcastsTrending = [
    {
      pos: {
        symbol: 'ETH', name: 'Ethereum', avatar: tokenLogos.ETH, side: 'Long', entry: 2450.12, current: 2472.34, pnl: () => '+$22.22', pnlPercent: () => '+0.91%', time: new Date(Date.now() - 1000 * 60 * 5),
      }, username: 'diamondhandz', timeAgo: '5m ago',
    },
    {
      pos: {
        symbol: 'SOL', name: 'Solana', avatar: tokenLogos.SOL, side: 'Short', entry: 102.3, current: 99.8, pnl: () => '+$2.50', pnlPercent: () => '+2.45%', time: new Date(Date.now() - 1000 * 60 * 15),
      }, username: 'ape4life', timeAgo: '15m ago',
    },
    {
      pos: {
        symbol: 'BTC', name: 'Bitcoin', avatar: tokenLogos.BTC, side: 'Long', entry: 60000, current: 60250, pnl: () => '+$250.00', pnlPercent: () => '+0.42%', time: new Date(Date.now() - 1000 * 60 * 25),
      }, username: 'rektwizard', timeAgo: '25m ago',
    },
    {
      pos: {
        symbol: 'UNI', name: 'Uniswap', avatar: tokenLogos.UNI, side: 'Short', entry: 7.85, current: 7.12, pnl: () => '-$0.73', pnlPercent: () => '-9.30%', time: new Date(Date.now() - 1000 * 60 * 35),
      }, username: 'unicorn', timeAgo: '35m ago',
    },
    {
      pos: {
        symbol: 'ETH', name: 'Ethereum', avatar: tokenLogos.ETH, side: 'Short', entry: 2472.34, current: 2450.12, pnl: () => '-$22.22', pnlPercent: () => '-0.91%', time: new Date(Date.now() - 1000 * 60 * 45),
      }, username: 'whalehunter', timeAgo: '45m ago',
    },
    {
      pos: {
        symbol: 'SOL', name: 'Solana', avatar: tokenLogos.SOL, side: 'Long', entry: 99.8, current: 102.3, pnl: () => '+$2.50', pnlPercent: () => '+2.51%', time: new Date(Date.now() - 1000 * 60 * 55),
      }, username: 'solmaxi', timeAgo: '55m ago',
    },
    {
      pos: {
        symbol: 'BTC', name: 'Bitcoin', avatar: tokenLogos.BTC, side: 'Short', entry: 60250, current: 60000, pnl: () => '-$250.00', pnlPercent: () => '-0.42%', time: new Date(Date.now() - 1000 * 60 * 65),
      }, username: 'btcwhale', timeAgo: '1h 5m ago',
    },
    {
      pos: {
        symbol: 'UNI', name: 'Uniswap', avatar: tokenLogos.UNI, side: 'Long', entry: 7.12, current: 7.85, pnl: () => '+$0.73', pnlPercent: () => '+10.26%', time: new Date(Date.now() - 1000 * 60 * 75),
      }, username: 'defidude', timeAgo: '1h 15m ago',
    },
    {
      pos: {
        symbol: 'ETH', name: 'Ethereum', avatar: tokenLogos.ETH, side: 'Long', entry: 2450.12, current: 2472.34, pnl: () => '+$22.22', pnlPercent: () => '+0.91%', time: new Date(Date.now() - 1000 * 60 * 85),
      }, username: 'ethqueen', timeAgo: '1h 25m ago',
    },
    {
      pos: {
        symbol: 'SOL', name: 'Solana', avatar: tokenLogos.SOL, side: 'Short', entry: 102.3, current: 99.8, pnl: () => '+$2.50', pnlPercent: () => '+2.45%', time: new Date(Date.now() - 1000 * 60 * 95),
      }, username: 'solbro', timeAgo: '1h 35m ago',
    },
  ];
  const mockBroadcastsFollowing = [
    {
      pos: {
        symbol: 'UNI', name: 'Uniswap', avatar: tokenLogos.UNI, side: 'Long', entry: 7.12, current: 7.85, pnl: () => '+$0.73', pnlPercent: () => '+10.26%', time: new Date(Date.now() - 1000 * 60 * 30),
      }, username: 'rektwizard', timeAgo: '30m ago',
    },
    {
      pos: {
        symbol: 'ETH', name: 'Ethereum', avatar: tokenLogos.ETH, side: 'Short', entry: 2472.34, current: 2450.12, pnl: () => '-$22.22', pnlPercent: () => '-0.91%', time: new Date(Date.now() - 1000 * 60 * 50),
      }, username: 'diamondhandz', timeAgo: '50m ago',
    },
    {
      pos: {
        symbol: 'BTC', name: 'Bitcoin', avatar: tokenLogos.BTC, side: 'Long', entry: 60000, current: 60250, pnl: () => '+$250.00', pnlPercent: () => '+0.42%', time: new Date(Date.now() - 1000 * 60 * 70),
      }, username: 'btcwhale', timeAgo: '1h 10m ago',
    },
    {
      pos: {
        symbol: 'SOL', name: 'Solana', avatar: tokenLogos.SOL, side: 'Long', entry: 99.8, current: 102.3, pnl: () => '+$2.50', pnlPercent: () => '+2.51%', time: new Date(Date.now() - 1000 * 60 * 90),
      }, username: 'solmaxi', timeAgo: '1h 30m ago',
    },
  ];

  if (!ready || !authenticated) {
    return null;
  }

  return (
    <Layout 
      accountId={user?.id ?? ""} 
      appName="Home" 
      navbarItems={[]}
    >
      <main className="flex flex-col md:flex-row gap-8 p-6">
        {/* Main Content */}
        <div className="flex-1 flex flex-col space-y-6">
          {/* Trending Tokens */}
          <Card className="bg-white/5 border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Trending Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendingTokens.map((token) => (
                  <Card key={token.id} className="bg-white/10 border-0 rounded-xl p-4 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-violet-500/30 flex items-center justify-center mb-2">
                      <span className="text-white font-bold text-lg">{token.symbol}</span>
                    </div>
                    <div className="text-white font-semibold">{token.name}</div>
                    <div className="text-gray-400 text-xs">{token.symbol}</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">${token.price.toLocaleString()}</span>
                        <div className={`flex items-center ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change24h >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-4 w-4 mr-1" />
                          )}
                          <span className="font-medium">{Math.abs(token.change24h)}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Market Cap</span>
                          <p className="text-white">${token.marketCap}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Volume</span>
                          <p className="text-white">${token.volume24h}</p>
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Trade
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Recent Activity */}
          <Card className="bg-white/5 border border-white/10 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center">
                        <span className="text-white font-bold">{activity.user[2]}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{activity.action}</div>
                        <div className="text-gray-400 text-xs">{activity.time}</div>
                      </div>
                    </div>
                    <div className="text-white font-semibold">{activity.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Broadcasts Sidebar */}
        <aside className="w-full md:w-1/2 flex-shrink-0 mt-8 md:mt-0 px-0 md:pl-4">
          <div className="flex flex-col w-full">
            <div className="text-white text-lg font-semibold mb-2">Broadcasts</div>
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="w-full flex bg-white/10 rounded-xl mb-2 h-8">
                <TabsTrigger value="trending" className="flex-1 text-white text-xs py-1">Trending</TabsTrigger>
                <TabsTrigger value="following" className="flex-1 text-white text-xs py-1">Following</TabsTrigger>
              </TabsList>
              <TabsContent value="trending">
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {mockBroadcastsTrending.map((b, i) => (
                    <BroadcastCard key={i} pos={b.pos} username={b.username} timeAgo={b.timeAgo} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="following">
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {mockBroadcastsFollowing.map((b, i) => (
                    <BroadcastCard key={i} pos={b.pos} username={b.username} timeAgo={b.timeAgo} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </aside>
      </main>
    </Layout>
  );
}