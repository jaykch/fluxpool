import { usePrivy } from "@privy-io/react-auth";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";

export default function PortfolioPage() {
  const { user, ready, authenticated } = usePrivy();

  // Mock portfolio data
  const portfolioStats = {
    totalValue: 12450.67,
    change24h: 234.56,
    changePercent: 1.92,
    totalPnL: 3456.78,
    totalPnLPercent: 38.45
  };

  // Mock holdings
  const holdings = [
    {
      id: 1,
      symbol: "ETH",
      name: "Ethereum",
      amount: 2.45,
      avgPrice: 2200.00,
      currentPrice: 2450.50,
      currentValue: 6003.73,
      pnl: 613.23,
      pnlPercent: 11.37,
      allocation: 48.2
    },
    {
      id: 2,
      symbol: "SOL",
      name: "Solana",
      amount: 25.0,
      avgPrice: 95.00,
      currentPrice: 102.30,
      currentValue: 2557.50,
      pnl: 182.50,
      pnlPercent: 7.68,
      allocation: 20.5
    },
    {
      id: 3,
      symbol: "UNI",
      name: "Uniswap",
      amount: 150.0,
      avgPrice: 6.50,
      currentPrice: 7.85,
      currentValue: 1177.50,
      pnl: 202.50,
      pnlPercent: 20.77,
      allocation: 9.5
    },
    {
      id: 4,
      symbol: "LINK",
      name: "Chainlink",
      amount: 85.0,
      avgPrice: 12.00,
      currentPrice: 14.20,
      currentValue: 1207.00,
      pnl: 187.00,
      pnlPercent: 18.33,
      allocation: 9.7
    }
  ];

  // Mock transactions
  const transactions = [
    {
      id: 1,
      type: "buy",
      symbol: "ETH",
      amount: 0.5,
      price: 2400.00,
      total: 1200.00,
      date: "2024-01-15 14:30",
      status: "completed"
    },
    {
      id: 2,
      type: "sell",
      symbol: "SOL",
      amount: 5.0,
      price: 105.00,
      total: 525.00,
      date: "2024-01-14 09:15",
      status: "completed"
    },
    {
      id: 3,
      type: "buy",
      symbol: "UNI",
      amount: 25.0,
      price: 7.20,
      total: 180.00,
      date: "2024-01-13 16:45",
      status: "completed"
    }
  ];

  return (
    <Layout 
      accountId={user?.id ?? ""} 
      appName="Portfolio" 
      navbarItems={[]}
    >
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Portfolio</h1>
            <p className="text-gray-400 mt-2">Track your investments and performance</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Value</p>
                  <p className="text-white text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
              <div className={`flex items-center mt-2 ${portfolioStats.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioStats.changePercent >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  ${Math.abs(portfolioStats.change24h).toFixed(2)} ({Math.abs(portfolioStats.changePercent)}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total P&L</p>
                  <p className="text-white text-2xl font-bold">${portfolioStats.totalPnL.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
              <div className="flex items-center mt-2 text-green-400">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{portfolioStats.totalPnLPercent}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Holdings</p>
                  <p className="text-white text-2xl font-bold">{holdings.length}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-gray-400 text-sm mt-2">Active positions</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Best Performer</p>
                  <p className="text-white text-2xl font-bold">UNI</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+20.77%</p>
            </CardContent>
          </Card>
        </div>

        {/* Holdings and Transactions */}
        <Tabs defaultValue="holdings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings" className="space-y-4">
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{holding.symbol[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{holding.symbol}</h3>
                          <p className="text-gray-400 text-sm">{holding.name}</p>
                          <p className="text-gray-400 text-sm">{holding.amount} tokens</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white font-medium">${holding.currentValue.toLocaleString()}</p>
                        <div className={`flex items-center ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.pnl >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-sm font-medium">
                            ${Math.abs(holding.pnl).toFixed(2)} ({Math.abs(holding.pnlPercent)}%)
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{holding.allocation}% of portfolio</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-3 w-3 mr-1" />
                          Buy
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Minus className="h-3 w-3 mr-1" />
                          Sell
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {tx.type === 'buy' ? (
                            <Plus className="h-4 w-4 text-white" />
                          ) : (
                            <Minus className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">{tx.type} {tx.symbol}</p>
                          <p className="text-gray-400 text-sm">{tx.date}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white font-medium">${tx.total.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">{tx.amount} @ ${tx.price}</p>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
} 