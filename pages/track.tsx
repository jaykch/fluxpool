import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Plus, Eye, Trash2, Bell, TrendingUp, X, CheckCircle2, User, MessageCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data helpers
const mockTrackedTrades = [
  { id: 1, token: 'ETH', side: 'Long', entry: 2450, current: 2510, pnl: '+$60', status: 'Open' },
  { id: 2, token: 'SOL', side: 'Short', entry: 98, current: 95, pnl: '+$3', status: 'Open' },
  { id: 3, token: 'BTC', side: 'Long', entry: 60000, current: 59800, pnl: '-$200', status: 'Closed' },
];
const mockWatchlist = [
  { symbol: 'ETH', name: 'Ethereum', price: 2510, change: '+2.1%' },
  { symbol: 'SOL', name: 'Solana', price: 95, change: '-1.3%' },
  { symbol: 'UNI', name: 'Uniswap', price: 7.85, change: '+0.5%' },
];
const mockAlerts = [
  { id: 1, token: 'ETH', condition: '>', value: 3000, status: 'Active' },
  { id: 2, token: 'BTC', condition: '<', value: 59000, status: 'Triggered' },
];
const mockTrackedTraders = [
  { id: 1, ens: 'diamondhandz.eth', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=diamondhandz', status: 'Active' },
  { id: 2, ens: 'ape4life.eth', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ape4life', status: 'Idle' },
  { id: 3, ens: 'rektwizard.eth', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=rektwizard', status: 'Trading' },
];

export default function TrackPage() {
  // State for tracked trades
  const [trackedTrades, setTrackedTrades] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [trackedTraders, setTrackedTraders] = useState<any[]>([]);
  // Modal states
  const [addTradeOpen, setAddTradeOpen] = useState(false);
  const [addWatchOpen, setAddWatchOpen] = useState(false);
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // Load from localStorage or use mock
  useEffect(() => {
    setTrackedTrades(JSON.parse(localStorage.getItem('tracked-trades') || 'null') || mockTrackedTrades);
    setWatchlist(JSON.parse(localStorage.getItem('track-watchlist') || 'null') || mockWatchlist);
    setAlerts(JSON.parse(localStorage.getItem('track-alerts') || 'null') || mockAlerts);
    setTrackedTraders(JSON.parse(localStorage.getItem('track-traders') || 'null') || mockTrackedTraders);
  }, []);
  // Save to localStorage
  useEffect(() => { localStorage.setItem('tracked-trades', JSON.stringify(trackedTrades)); }, [trackedTrades]);
  useEffect(() => { localStorage.setItem('track-watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('track-alerts', JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem('track-traders', JSON.stringify(trackedTraders)); }, [trackedTraders]);

  // Add/Remove handlers (mocked)
  const handleUntrackTrade = (id: number) => setTrackedTrades(trackedTrades.filter(t => t.id !== id));
  const handleRemoveWatch = (symbol: string) => setWatchlist(watchlist.filter(w => w.symbol !== symbol));
  const handleDeleteAlert = (id: number) => setAlerts(alerts.filter(a => a.id !== id));
  const handleUntrackTrader = (id: number) => setTrackedTraders(trackedTraders.filter(t => t.id !== id));

  return (
    <Layout accountId="" appName="Track" navbarItems={[]}> 
      <main className="flex flex-col gap-8 px-4 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tracked Traders (top left) */}
          <Card className="bg-transparent shadow-2xl border-0 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-white text-xl flex items-center gap-2"><User className="h-5 w-5 text-yellow-400" /> Tracked Traders</CardTitle>
            </div>
            <div className="flex flex-col gap-3">
              {trackedTraders.length === 0 && <div className="text-gray-400 text-sm">No traders being tracked.</div>}
              {trackedTraders.map(trader => (
                <div key={trader.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2">
                  <Link href={`/profile/${trader.ens}`} className="flex items-center gap-2 group flex-shrink-0">
                    <img src={trader.avatar} alt={trader.ens} className="w-8 h-8 rounded-full border-2 border-white/10 group-hover:border-violet-400 transition" />
                    <span className="text-white font-mono text-xs w-32 truncate group-hover:underline">{trader.ens}</span>
                  </Link>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${trader.status === 'Active' ? 'bg-green-700/60 text-green-300' : trader.status === 'Trading' ? 'bg-blue-700/60 text-blue-300' : 'bg-gray-700/60 text-gray-300'}`}>{trader.status}</span>
                  <Button size="icon" variant="ghost" className="ml-auto text-violet-400 hover:bg-violet-500/10" title="Message" onClick={() => setMsgOpen(trader.ens)}><MessageCircle className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/10" title="Untrack" onClick={() => handleUntrackTrader(trader.id)}><Trash2 className="h-4 w-4" /></Button>
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
                            className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-900 p-2 text-white"
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
          </Card>
          {/* Tracked Trades (top right) */}
          <Card className="bg-transparent shadow-2xl border-0 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-white text-xl flex items-center gap-2"><TrendingUp className="h-5 w-5 text-violet-400" /> Tracked Trades</CardTitle>
              <Button size="icon" variant="ghost" className="text-violet-400 hover:bg-violet-500/10" onClick={() => setAddTradeOpen(true)}><Plus className="h-5 w-5" /></Button>
            </div>
            <div className="flex flex-col gap-3">
              {trackedTrades.length === 0 && <div className="text-gray-400 text-sm">No trades being tracked.</div>}
              {trackedTrades.map(trade => (
                <div key={trade.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2">
                  <span className="text-white font-mono text-xs w-12">{trade.token}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${trade.side === 'Long' ? 'bg-green-700/60 text-green-300' : 'bg-red-700/80 text-red-300'}`}>{trade.side}</span>
                  <span className="text-xs text-gray-400">Entry: <span className="text-white font-mono">${trade.entry}</span></span>
                  <span className="text-xs text-gray-400">Current: <span className="text-white font-mono">${trade.current}</span></span>
                  <span className={`text-xs font-bold ${trade.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>PnL: {trade.pnl}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${trade.status === 'Open' ? 'bg-blue-700/60 text-blue-300' : 'bg-gray-700/60 text-gray-300'}`}>{trade.status}</span>
                  <Button size="icon" variant="ghost" className="ml-auto text-violet-400 hover:bg-violet-500/10" title="View"><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/10" title="Untrack" onClick={() => handleUntrackTrade(trade.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
          {/* Watchlist (bottom left) */}
          <Card className="bg-transparent shadow-2xl border-0 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-white text-xl flex items-center gap-2"><Eye className="h-5 w-5 text-blue-400" /> Watchlist</CardTitle>
              <Button size="icon" variant="ghost" className="text-blue-400 hover:bg-blue-500/10" onClick={() => setAddWatchOpen(true)}><Plus className="h-5 w-5" /></Button>
            </div>
            <div className="flex flex-col gap-3">
              {watchlist.length === 0 && <div className="text-gray-400 text-sm">No tokens in watchlist.</div>}
              {watchlist.map(w => (
                <div key={w.symbol} className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2">
                  <span className="text-white font-mono text-xs w-12">{w.symbol}</span>
                  <span className="text-gray-300 text-xs w-24 truncate">{w.name}</span>
                  <span className="text-white font-mono text-xs">${w.price}</span>
                  <span className={`text-xs font-bold ${w.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{w.change}</span>
                  <Button size="sm" variant="outline" className="ml-auto text-blue-400 border-blue-400/40" onClick={() => {}} title="Go to Trade">Trade</Button>
                  <Button size="icon" variant="ghost" className="text-red-400 hover:bg-red-500/10" title="Remove" onClick={() => handleRemoveWatch(w.symbol)}><X className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
          {/* Alerts (bottom right) */}
          <Card className="bg-transparent shadow-2xl border-0 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-white text-xl flex items-center gap-2"><Bell className="h-5 w-5 text-fuchsia-400" /> Alerts</CardTitle>
              <Button size="icon" variant="ghost" className="text-fuchsia-400 hover:bg-fuchsia-500/10" onClick={() => setAddAlertOpen(true)}><Plus className="h-5 w-5" /></Button>
            </div>
            <div className="flex flex-col gap-3">
              {alerts.length === 0 && <div className="text-gray-400 text-sm">No alerts set.</div>}
              {alerts.map(a => (
                <div key={a.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2">
                  <span className="text-white font-mono text-xs w-12">{a.token}</span>
                  <span className="text-gray-300 text-xs">{a.condition} ${a.value}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'Active' ? 'bg-fuchsia-700/60 text-fuchsia-200' : 'bg-gray-700/60 text-gray-300'}`}>{a.status}</span>
                  {a.status === 'Triggered' && <CheckCircle2 className="h-4 w-4 text-green-400 ml-1" />}
                  <Button size="icon" variant="ghost" className="ml-auto text-red-400 hover:bg-red-500/10" title="Delete" onClick={() => handleDeleteAlert(a.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        {/* Add Tracked Trade Modal */}
        <Dialog open={addTradeOpen} onOpenChange={setAddTradeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tracked Trade</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              {/* Simple mock form, not functional */}
              <input className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white" placeholder="Token (e.g. ETH)" />
              <select className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white">
                <option>Long</option>
                <option>Short</option>
              </select>
              <input className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white" placeholder="Entry Price" type="number" />
            </div>
            <DialogFooter>
              <Button onClick={() => setAddTradeOpen(false)}>Add</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Add Watchlist Modal */}
        <Dialog open={addWatchOpen} onOpenChange={setAddWatchOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <input className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white" placeholder="Token Symbol (e.g. ETH)" />
            </div>
            <DialogFooter>
              <Button onClick={() => setAddWatchOpen(false)}>Add</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Add Alert Modal */}
        <Dialog open={addAlertOpen} onOpenChange={setAddAlertOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Alert</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <input className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white" placeholder="Token (e.g. ETH)" />
              <select className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white">
                <option>&gt;</option>
                <option>&lt;</option>
              </select>
              <input className="rounded bg-white/10 border border-white/20 px-3 py-2 text-white" placeholder="Value (e.g. 3000)" type="number" />
            </div>
            <DialogFooter>
              <Button onClick={() => setAddAlertOpen(false)}>Add</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </Layout>
  );
} 