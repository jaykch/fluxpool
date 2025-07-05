import { GetServerSideProps } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Head from 'next/head';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { TrendingUp, UserPlus, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Share2, Pencil, CheckCircle2 } from 'lucide-react';

// --- Mock Data and Columns (reuse from TradingData) ---
function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
interface Trade {
  id: number;
  timestamp: Date;
  marketCap: string;
  amount: string;
  txHash: string;
  ens?: string;
  type: 'buy' | 'sell';
  price: string;
}
function randomTxHash() {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}
const tradeColumns: ColumnDef<Trade>[] = [
  { accessorKey: 'timestamp', header: () => 'Time', cell: ({ row }) => timeAgo(row.original.timestamp) },
  { accessorKey: 'type', header: () => 'Type', cell: ({ row }) => <span className={row.original.type === 'buy' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{row.original.type.toUpperCase()}</span> },
  { accessorKey: 'amount', header: () => 'Amount (ETH)' },
  { accessorKey: 'price', header: () => 'Price (USD)', cell: ({ row }) => `$${row.original.price}` },
  { accessorKey: 'marketCap', header: () => 'Market Cap' },
  { accessorKey: 'txHash', header: () => 'Transaction Hash', cell: ({ row }) => <span className="font-mono text-xs text-blue-400">{row.original.txHash.slice(0, 8) + '...' + row.original.txHash.slice(-6)}</span> },
];
function randomAmount() { return (Math.random() * 10).toFixed(3); }
function randomType() { return Math.random() > 0.5 ? 'buy' : 'sell'; }
function randomPrice() { return (2400 + Math.random() * 100).toFixed(2); }
function randomMarketCap() { const n = Math.floor(Math.random() * 100_000_000) + 1_000_000; return `$${n.toLocaleString()}`; }
function randomAddress() { return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''); }
const mockTrades: Trade[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 60 * 60 * 1000)),
  marketCap: randomMarketCap(),
  amount: randomAmount(),
  txHash: randomTxHash(),
  type: randomType() as 'buy' | 'sell',
  price: randomPrice(),
}));

function toFluxpoolENS(name: string) {
  // Remove .eth or any other suffix, then add .fluxpool.eth
  return name.replace(/\..*$/, '') + '.fluxpool.eth';
}
const mockTextRecords = (ens: string) => {
  const fluxpoolEns = toFluxpoolENS(ens);
  return {
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(fluxpoolEns)}`,
    twitter: `@${fluxpoolEns.replace('.fluxpool.eth', '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`,
    description: `This is a mock profile for ${fluxpoolEns}. ${fluxpoolEns} is a legendary onchain trader, meme connoisseur, and DeFi degen.`,
    website: `https://www.${fluxpoolEns.replace('.fluxpool.eth', '')}.xyz`,
    email: `${fluxpoolEns.replace('.fluxpool.eth', '')}@notareal.email`,
    location: 'Internet',
    github: `https://github.com/${fluxpoolEns.replace('.fluxpool.eth', '')}`,
    telegram: `t.me/${fluxpoolEns.replace('.fluxpool.eth', '')}`,
  };
};

// Add mock data for followers, following, and holdings
const mockFollowers = [
  { name: 'TheDevTzar', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=devtzar' },
  { name: 'tofushit888', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=tofushit888' },
  { name: 'Bull_Trap_', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=bulltrap' },
];
const mockHoldings = [
  { symbol: 'SOL', name: 'Solana', avatar: '/logos/solana.png', percent: 50.58 },
  { symbol: 'Ana', name: 'Ana', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=ana', percent: 46.05 },
  { symbol: 'W', name: 'W', avatar: '/logos/w.png', percent: 3.36 },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ens = ctx.params?.ens as string;
  return {
    props: {
      ens,
      records: mockTextRecords(ens),
    },
  };
};

export default function ProfilePage({ ens, records }: { ens: string; records: Record<string, string> }) {
  // Mock PnL and stats
  const pnl = Math.random() > 0.5 ? `+$${(Math.random() * 10000).toFixed(2)}` : `-$${(Math.random() * 10000).toFixed(2)}`;
  const followers = Math.floor(Math.random() * 1000);
  const following = Math.floor(Math.random() * 500);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const isOwnProfile = ens === 'myaccount.fluxpool.eth'; // Demo: replace with real user check
  const [statsTab, setStatsTab] = useState<'today' | 'week'>('today');
  const [mainTab, setMainTab] = useState<'broadcasts' | 'holdings'>('holdings');
  const fluxpoolEns = toFluxpoolENS(ens);
  const username = fluxpoolEns.replace('.fluxpool.eth', '');
  return (
    <Layout accountId={ens} appName="Profile" navbarItems={[]}>
      <Head>
        <title>{fluxpoolEns} | FluxPool Profile</title>
      </Head>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto min-h-screen py-12">
        {/* Left: Profile Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-6">
          {/* Profile Header */}
          <div className="w-full flex flex-col items-center md:items-start relative">
            {/* Edit/Share icons */}
            <div className="absolute right-0 top-0 flex gap-2">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Share2 className="h-5 w-5" /></button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Pencil className="h-5 w-5" /></button>
            </div>
            <Avatar className="w-24 h-24 mb-2 border-4 border-white/10 shadow-lg">
              <AvatarImage src={records.avatar} alt={fluxpoolEns} />
              <AvatarFallback>{fluxpoolEns.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-2">
              <h2 className="text-3xl font-bold text-white">{username}</h2>
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">{fluxpoolEns}</span>
            </div>
            <div className="flex items-center gap-6 mt-3">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-white">25</span>
                <span className="text-xs text-gray-400">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-white">22</span>
                <span className="text-xs text-gray-400">Followers</span>
              </div>
            </div>
            {/* Followed by avatars */}
            <div className="flex items-center gap-1 mt-3">
              {mockFollowers.map((f, i) => (
                <Avatar key={f.name} className="w-7 h-7 border-2 border-black -ml-2 first:ml-0">
                  <AvatarImage src={f.avatar} />
                  <AvatarFallback>{f.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              <span className="text-xs text-gray-400 ml-2">Followed by {mockFollowers.map(f => f.name).join(', ')}</span>
            </div>
            {/* Follow/Message buttons */}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex items-center gap-1"><UserPlus className="h-4 w-4" /> Follow</Button>
              <Button size="sm" variant="default" className="flex items-center gap-1" onClick={() => setMsgOpen(true)}><MessageCircle className="h-4 w-4" /> Message</Button>
            </div>
            {/* Message Dialog */}
            <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Message to {username}</DialogTitle>
                </DialogHeader>
                {msgSent ? (
                  <div className="text-green-400 text-center py-8">Message sent successfully!</div>
                ) : (
                  <>
                    <textarea
                      className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-900 p-2 text-white"
                      placeholder={`Write a message to ${username}...`}
                      value={msg}
                      onChange={e => setMsg(e.target.value)}
                    />
                    <DialogFooter>
                      <Button
                        onClick={() => { setMsgSent(true); setTimeout(() => { setMsgOpen(false); setMsgSent(false); setMsg(''); }, 1200); }}
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
            {/* Profile fields */}
            <Separator className="my-2 bg-muted" />
            <div className="w-full space-y-1">
              <ProfileField label="Description" value={records.description || ''} />
              <ProfileField label="Twitter" value={records.twitter || ''} />
              <ProfileField label="Website" value={records.website || ''} />
              <ProfileField label="Location" value={records.location || ''} />
              <ProfileField label="GitHub" value={records.github || ''} />
              <ProfileField label="Telegram" value={records.telegram || ''} />
            </div>
            {/* Stats Section (moved here) */}
            <div className="w-full max-w-xl mx-auto mt-4">
              <div className="flex justify-between gap-2 mb-2">
                <button onClick={() => setStatsTab('today')} className={`flex-1 py-2 rounded-lg font-semibold ${statsTab === 'today' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`}>Today</button>
                <button onClick={() => setStatsTab('week')} className={`flex-1 py-2 rounded-lg font-semibold ${statsTab === 'week' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300'}`}>This Week</button>
              </div>
              <div className="flex justify-between gap-2 mb-4">
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-400">Volume</span>
                  <span className="text-lg font-bold text-white">$0.00</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-400">P&L</span>
                  <span className="text-lg font-bold text-red-400">-1.50</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-400">Max Trade Size</span>
                  <span className="text-lg font-bold text-white">$0.00</span>
                </div>
              </div>
              <div className="flex justify-between gap-2 mb-6">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-1"><Trophy className="h-4 w-4 text-yellow-400" /><span className="text-xs text-gray-400">Best Ever P&L (Current)</span></div>
                  <span className="text-lg font-bold text-red-400">-42.26</span>
                </div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-1"><Trophy className="h-4 w-4 text-yellow-400" /><span className="text-xs text-gray-400">Current Week P&L</span></div>
                  <span className="text-lg font-bold text-red-400">-42.26</span>
                </div>
              </div>
            </div>
            <Separator className="my-2 bg-muted" />
            <div className="flex gap-4 text-xs text-gray-400">
              <span><b>{followers}</b> Followers</span>
              <span><b>{following}</b> Following</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-400">
              <span>PnL: <span className={pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{pnl}</span></span>
            </div>
          </div>
        </div>
        {/* Right: Stats, Tabs, and Transaction History */}
        <div className="w-full md:w-2/3 flex flex-col space-y-6">
          {/* Tabs Section */}
          <div className="w-full max-w-xl mx-auto mt-2">
            <Tabs value={mainTab} onValueChange={v => setMainTab(v as 'broadcasts' | 'holdings')} className="w-full">
              <TabsList className="w-full flex bg-white/10 rounded-xl mb-2">
                <TabsTrigger value="broadcasts" className="flex-1 text-white">Broadcasts</TabsTrigger>
                <TabsTrigger value="holdings" className="flex-1 text-white">Holdings</TabsTrigger>
              </TabsList>
              <TabsContent value="broadcasts">
                <div className="text-center text-gray-400 py-8">No broadcasts yet.</div>
              </TabsContent>
              <TabsContent value="holdings">
                <div className="divide-y divide-white/10">
                  {mockHoldings.map((h, i) => (
                    <div key={h.symbol} className="flex items-center py-3 gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={h.avatar} />
                        <AvatarFallback>{h.symbol[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium flex-1">{h.symbol}</span>
                      <span className="text-gray-300 font-mono text-sm">{h.percent.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          {/* Transaction History Table */}
          <Card className="w-full rounded-2xl mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-200">Trading Activity</h3>
              </div>
              <DataTable columns={tradeColumns} data={mockTrades} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between w-full text-sm text-gray-400">
      <span className="font-medium text-gray-400">{label}</span>
      <span className="truncate max-w-[60%] text-right text-gray-200">{value}</span>
    </div>
  );
} 