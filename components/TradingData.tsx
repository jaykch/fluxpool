import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Users, Wallet, BarChart3, Trophy, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function TradingData() {
  const [tab, setTab] = useState("trades");

  // Mock data for trades
  const mockTrades = [
    { id: 1, amount: "0.245", price: "$2,450.00", time: "2 min ago", type: "buy", profit: "+$123.45" },
    { id: 2, amount: "1.023", price: "$2,448.50", time: "5 min ago", type: "sell", profit: "-$45.67" },
    { id: 3, amount: "0.567", price: "$2,452.30", time: "8 min ago", type: "buy", profit: "+$89.12" },
    { id: 4, amount: "2.100", price: "$2,447.80", time: "12 min ago", type: "sell", profit: "-$156.78" },
    { id: 5, amount: "0.890", price: "$2,451.20", time: "15 min ago", type: "buy", profit: "+$234.56" },
  ];

  // Mock data for spot positions
  const mockSpotPositions = [
    { symbol: "ETH/USDT", type: "Long", size: "2.45 ETH", entry: "$2,400.00", current: "$2,450.00", pnl: "+$122.50", pnlPercent: "+2.08%" },
    { symbol: "BTC/USDT", type: "Short", size: "0.15 BTC", entry: "$43,200.00", current: "$43,000.00", pnl: "+$30.00", pnlPercent: "+0.46%" },
    { symbol: "SOL/USDT", type: "Long", size: "25.0 SOL", entry: "$98.50", current: "$102.30", pnl: "+$95.00", pnlPercent: "+3.86%" },
  ];

  // Mock data for LP positions
  const mockLPPositions = [
    { pair: "ETH/USDT", liquidity: "$12,450.00", fees: "+$234.56", apr: "12.5%", status: "Active" },
    { pair: "BTC/USDT", liquidity: "$8,900.00", fees: "+$156.78", apr: "15.2%", status: "Active" },
    { pair: "SOL/USDT", liquidity: "$5,600.00", fees: "+$89.12", apr: "18.7%", status: "Active" },
  ];

  // Mock data for holders
  const mockHolders = [
    { rank: 1, address: "0x1234...5678", balance: "1,234.56 ETH", percentage: "12.34%", change: "+2.45%" },
    { rank: 2, address: "0xabcd...efgh", balance: "987.65 ETH", percentage: "9.87%", change: "-1.23%" },
    { rank: 3, address: "0x9876...5432", balance: "654.32 ETH", percentage: "6.54%", change: "+0.87%" },
    { rank: 4, address: "0xfedc...ba98", balance: "432.10 ETH", percentage: "4.32%", change: "+1.56%" },
    { rank: 5, address: "0x5678...1234", balance: "321.09 ETH", percentage: "3.21%", change: "-0.45%" },
  ];

  // Mock data for top traders
  const mockTopTraders = [
    { rank: 1, address: "0xalpha...beta", pnl: "+$45,678.90", winRate: "87.5%", trades: 156, volume: "$2.3M" },
    { rank: 2, address: "0xgamma...delta", pnl: "+$32,456.78", winRate: "82.3%", trades: 134, volume: "$1.8M" },
    { rank: 3, address: "0xepsilon...zeta", pnl: "+$28,901.23", winRate: "79.8%", trades: 98, volume: "$1.5M" },
    { rank: 4, address: "0xeta...theta", pnl: "+$24,567.89", winRate: "76.2%", trades: 87, volume: "$1.2M" },
    { rank: 5, address: "0xiota...kappa", pnl: "+$21,234.56", winRate: "73.9%", trades: 76, volume: "$980K" },
  ];

  return (
    <div className="w-full">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trades">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trades
          </TabsTrigger>
          <TabsTrigger value="spot">
            <BarChart3 className="h-4 w-4 mr-2" />
            Spot Positions
          </TabsTrigger>
          <TabsTrigger value="lp">
            <Wallet className="h-4 w-4 mr-2" />
            LP Positions
          </TabsTrigger>
          <TabsTrigger value="holders">
            <Users className="h-4 w-4 mr-2" />
            Holders
          </TabsTrigger>
          <TabsTrigger value="traders">
            <Trophy className="h-4 w-4 mr-2" />
            Top Traders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="mt-4">
          <div className="space-y-3">
            {mockTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Ξ</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{trade.amount} ETH</div>
                    <div className="text-gray-400 text-sm">{trade.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.profit}
                  </div>
                  <div className="text-gray-400 text-sm capitalize">{trade.type}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="spot" className="mt-4">
          <div className="space-y-3">
            {mockSpotPositions.map((position, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${position.type === 'Long' ? 'bg-green-500' : 'bg-red-500'}`}>
                    <span className="text-white text-xs font-bold">{position.type === 'Long' ? 'L' : 'S'}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{position.symbol}</div>
                    <div className="text-gray-400 text-sm">{position.size}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">{position.pnl}</div>
                  <div className="text-gray-400 text-sm">{position.pnlPercent}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lp" className="mt-4">
          <div className="space-y-3">
            {mockLPPositions.map((position, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💧</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{position.pair}</div>
                    <div className="text-gray-400 text-sm">{position.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">{position.fees}</div>
                  <div className="text-gray-400 text-sm">{position.apr} APR</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="holders" className="mt-4">
          <div className="space-y-3">
            {mockHolders.map((holder) => (
              <div key={holder.rank} className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{holder.rank}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{holder.address}</div>
                    <div className="text-gray-400 text-sm">Rank #{holder.rank}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{holder.balance}</div>
                  <div className={`text-sm ${holder.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {holder.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traders" className="mt-4">
          <div className="space-y-3">
            {mockTopTraders.map((trader) => (
              <div key={trader.rank} className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{trader.address}</div>
                    <div className="text-gray-400 text-sm">{trader.trades} trades</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">{trader.pnl}</div>
                  <div className="text-gray-400 text-sm">{trader.winRate} Win Rate</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 