import Portal from "../components/graphics/portal";
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/trade", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
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

  return (
    <Layout 
      accountId={user?.id ?? ""} 
      appName="FluxPool" 
      navbarItems={[]}
    >
      <main className="flex-1 p-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Welcome to <span className="text-blue-400">FluxPool</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The next-generation Web3 trading platform with advanced liquidity protocols and real-time market insights.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Trading
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Target className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Market Cap</p>
                  <p className="text-white text-2xl font-bold">${marketData.totalMarketCap}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">24h Volume</p>
                  <p className="text-white text-2xl font-bold">${marketData.totalVolume24h}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Traders</p>
                  <p className="text-white text-2xl font-bold">{marketData.activeTraders}</p>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transactions</p>
                  <p className="text-white text-2xl font-bold">{marketData.totalTransactions}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Tokens */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Trending Tokens
            </h2>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trendingTokens.map((token) => (
              <Card key={token.id} className="border-gray-700 hover:border-gray-600 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{token.symbol}</h3>
                        <p className="text-gray-400 text-sm">{token.name}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-400" />
              Recent Activity
            </h2>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
          
          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'trade' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {activity.type === 'trade' ? (
                          <BarChart3 className="h-4 w-4 text-white" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">by {activity.user}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-medium">{activity.amount}</p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
