import { usePrivy } from "@privy-io/react-auth";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Heart
} from "lucide-react";

export default function DiscoverPage() {
  const { user, ready, authenticated } = usePrivy();

  // Mock trending tokens data
  const trendingTokens = [
    {
      id: 1,
      symbol: "ETH",
      name: "Ethereum",
      price: 2450.50,
      change24h: 2.34,
      marketCap: "2.45B",
      volume24h: "156.7M",
      holders: "45.2K",
      isTrending: true,
      category: "DeFi"
    },
    {
      id: 2,
      symbol: "SOL",
      name: "Solana",
      price: 102.30,
      change24h: -1.25,
      marketCap: "1.23B",
      volume24h: "89.4M",
      holders: "32.1K",
      isTrending: true,
      category: "Layer 1"
    },
    {
      id: 3,
      symbol: "UNI",
      name: "Uniswap",
      price: 7.85,
      change24h: 5.67,
      marketCap: "890M",
      volume24h: "45.2M",
      holders: "28.9K",
      isTrending: true,
      category: "DEX"
    },
    {
      id: 4,
      symbol: "LINK",
      name: "Chainlink",
      price: 14.20,
      change24h: -0.89,
      marketCap: "756M",
      volume24h: "67.8M",
      holders: "41.3K",
      isTrending: false,
      category: "Oracle"
    }
  ];

  // Mock new projects
  const newProjects = [
    {
      id: 1,
      name: "FluxPool Protocol",
      description: "Next-generation liquidity protocol with advanced yield strategies",
      category: "DeFi",
      launchDate: "2024-01-15",
      initialPrice: 0.25,
      currentPrice: 0.42,
      change: 68,
      raised: "2.5M",
      participants: "1.2K"
    },
    {
      id: 2,
      name: "MetaVerse DAO",
      description: "Decentralized governance for virtual world assets",
      category: "DAO",
      launchDate: "2024-01-10",
      initialPrice: 1.00,
      currentPrice: 0.85,
      change: -15,
      raised: "1.8M",
      participants: "890"
    }
  ];

  return (
    <Layout 
      accountId={user?.id ?? ""} 
      appName="Discover" 
      navbarItems={[]}
    >
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Discover</h1>
            <p className="text-gray-400 mt-2">Explore trending tokens and new projects</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Eye className="h-4 w-4 mr-2" />
            Watchlist
          </Button>
        </div>

        {/* Trending Tokens */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Trending Tokens
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingTokens.map((token) => (
              <Card key={token.id} className="border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{token.symbol}</CardTitle>
                        <p className="text-gray-400 text-sm">{token.name}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {token.category}
                    </Badge>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {token.holders}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Trade
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* New Projects */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-400" />
            New Projects
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newProjects.map((project) => (
              <Card key={project.id} className="border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Launch Date</span>
                      <p className="text-white font-medium">{project.launchDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Raised</span>
                      <p className="text-white font-medium">${project.raised}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Initial Price</span>
                      <p className="text-white font-medium">${project.initialPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Current Price</span>
                      <p className="text-white font-medium">${project.currentPrice}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${project.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {project.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 mr-1" />
                      )}
                      <span className="font-medium">{Math.abs(project.change)}%</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {project.participants} participants
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
} 