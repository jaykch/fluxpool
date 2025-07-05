import { usePrivy } from "@privy-io/react-auth";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  Bell,
  Users,
  Activity,
  Target
} from "lucide-react";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';

export default function TrackPage() {
  const { user, ready, authenticated } = usePrivy();

  // Mock tracked traders
  const trackedTraders = [
    { ens: 'diamondhandz.eth', address: '0x1234...abcd', status: 'Active' },
    { ens: 'ape4life.eth', address: '0x5678...efgh', status: 'Idle' },
    { ens: 'rektwizard.eth', address: '0x9abc...def0', status: 'Trading' },
  ];
  const [msgOpen, setMsgOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // Mock watchlist data
  const watchlist = [
    {
      id: 1,
      symbol: "ETH",
      name: "Ethereum",
      price: 2450.50,
      change24h: 2.34,
      marketCap: "2.45B",
      volume24h: "156.7M",
      alert: "price_above_2500"
    },
    {
      id: 3,
      symbol: "UNI",
      name: "Uniswap",
      price: 7.85,
      change24h: 5.67,
      marketCap: "890M",
      volume24h: "45.2M",
      alert: null
    }
  ];

  // Mock alerts
  const alerts = [
    {
      id: 1,
      type: "price_above",
      symbol: "ETH",
      condition: "Price above $2,500",
      triggered: true,
      time: "2 min ago",
      value: 2450.50
    },
    {
      id: 3,
      type: "price_drop",
      symbol: "LINK",
      condition: "Price drops below $14",
      triggered: false,
      time: "1 hour ago",
      value: 14.20
    }
  ];

  // Mock market movers
  const marketMovers = [
    {
      id: 1,
      symbol: "AVAX",
      name: "Avalanche",
      price: 32.45,
      change24h: 12.34,
      volume24h: "234.5M",
      reason: "Partnership announcement"
    },
    {
      id: 2,
      symbol: "MATIC",
      name: "Polygon",
      price: 0.85,
      change24h: -8.76,
      volume24h: "156.7M",
      reason: "Network upgrade"
    },
    {
      id: 3,
      symbol: "ATOM",
      name: "Cosmos",
      price: 8.95,
      change24h: 6.54,
      volume24h: "89.2M",
      reason: "New validator set"
    }
  ];

  return (
    <Layout 
      accountId={user?.id ?? ""} 
      appName="Track" 
      navbarItems={[]}
    >
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Track</h1>
            <p className="text-gray-400 mt-2">Monitor markets and set alerts</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Alert
          </Button>
        </div>

        {/* Tracked Traders Section */}
        <Card className="border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Traders You're Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {trackedTraders.map((trader) => (
                <div key={trader.ens} className="flex items-center gap-4">
                  <Link href={`/profile/${trader.ens}`} className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors text-lg font-semibold">
                    {trader.ens}
                  </Link>
                  <Badge variant="secondary" className="text-xs">{trader.status}</Badge>
                  <Button size="sm" variant="outline" onClick={() => setMsgOpen(trader.ens)}>
                    Message
                  </Button>
                  {/* Message Dialog */}
                  <Dialog open={msgOpen === trader.ens} onOpenChange={open => setMsgOpen(open ? trader.ens : null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to {trader.ens}</DialogTitle>
                      </DialogHeader>
                      {msgSent && msgOpen === trader.ens ? (
                        <div className="text-green-400 text-center py-8">Message sent successfully!</div>
                      ) : (
                        <>
                          <textarea
                            className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-900 p-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder={`Write a message to ${trader.ens}...`}
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                          />
                          <DialogFooter>
                            <Button
                              onClick={() => { setMsgSent(true); setTimeout(() => { setMsgOpen(null); setMsgSent(false); setMsg(''); }, 1200); }}
                              disabled={!msg.trim()}
                            >Send</Button>
                            <DialogClose asChild>
                              <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tokens, addresses, or watchlists..."
            className="pl-10 bg-gray-800 border-gray-600 text-white"
          />
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Alerts</p>
                  <p className="text-white text-2xl font-bold">{alerts.filter(a => a.triggered).length}</p>
                </div>
                <Bell className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-gray-400 text-sm mt-2">Triggered today</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Watchlist</p>
                  <p className="text-white text-2xl font-bold">{watchlist.length}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mt-2">Tokens tracked</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Top Gainer</p>
                  <p className="text-white text-2xl font-bold">AVAX</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+12.34%</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Top Loser</p>
                  <p className="text-white text-2xl font-bold">MATIC</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-400 text-sm mt-2">-8.76%</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="watchlist" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="movers">Market Movers</TabsTrigger>
          </TabsList>

          <TabsContent value="watchlist" className="space-y-4">
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Your Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchlist.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{token.symbol[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{token.symbol}</h3>
                          <p className="text-gray-400 text-sm">{token.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-white font-medium">${token.price.toLocaleString()}</p>
                        <div className={`flex items-center justify-center ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change24h >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-sm font-medium">{Math.abs(token.change24h)}%</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white text-sm">${token.marketCap}</p>
                        <p className="text-gray-400 text-sm">${token.volume24h}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        {token.alert && (
                          <Badge variant="destructive" className="text-xs">
                            Alert
                          </Badge>
                        )}
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Bell className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Price Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                      alert.triggered ? 'border-red-500 bg-red-500/10' : 'border-gray-700'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          alert.triggered ? 'bg-red-500' : 'bg-gray-600'
                        }`}>
                          <Bell className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{alert.symbol} - {alert.condition}</p>
                          <p className="text-gray-400 text-sm">{alert.time}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white font-medium">${alert.value}</p>
                        <Badge variant={alert.triggered ? "destructive" : "secondary"} className="text-xs">
                          {alert.triggered ? "Triggered" : "Active"}
                        </Badge>
                      </div>
                      
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="movers" className="space-y-4">
            <Card className="border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Market Movers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketMovers.map((mover) => (
                    <div key={mover.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{mover.symbol[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{mover.symbol}</h3>
                          <p className="text-gray-400 text-sm">{mover.name}</p>
                          <p className="text-gray-400 text-xs">{mover.reason}</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-white font-medium">${mover.price}</p>
                        <div className={`flex items-center justify-center ${mover.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {mover.change24h >= 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-sm font-medium">{Math.abs(mover.change24h)}%</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white text-sm">${mover.volume24h}</p>
                        <p className="text-gray-400 text-sm">Volume</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Target className="h-3 w-3" />
                        </Button>
                      </div>
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