import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, Activity } from "lucide-react";

interface TokenInfoProps {
  symbol: string;
  name: string;
}

export default function TokenInfo({ symbol, name }: TokenInfoProps) {
  // Mock token data
  const tokenData = {
    price: 2450.50,
    change24h: 2.34,
    marketCap: "2.45B",
    volume24h: "156.7M",
    holders: "45.2K",
    transactions: "12.3K",
  };

  return (
    <Card className="border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">Token Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Price</span>
            <span className="text-white font-semibold">${tokenData.price.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            {tokenData.change24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-sm font-medium ${tokenData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {tokenData.change24h >= 0 ? '+' : ''}{tokenData.change24h}%
            </span>
            <span className="text-gray-400 text-sm">24h</span>
          </div>
        </div>

        {/* Market Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Market Cap</span>
            </div>
            <span className="text-white font-medium">${tokenData.marketCap}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Volume 24h</span>
            </div>
            <span className="text-white font-medium">${tokenData.volume24h}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Holders</span>
            </div>
            <span className="text-white font-medium">{tokenData.holders}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Transactions</span>
            </div>
            <span className="text-white font-medium">{tokenData.transactions}</span>
          </div>
        </div>

        {/* Token Details */}
        <div className="pt-3 border-t border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Symbol</span>
              <span className="text-white font-medium">{symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="text-white font-medium">{name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Network</span>
              <span className="text-white font-medium">Ethereum</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 