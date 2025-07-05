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
  address: string;
  ens?: string;
  type: 'buy' | 'sell';
  price: string;
}
const tradeColumns: ColumnDef<Trade>[] = [
  { accessorKey: 'timestamp', header: () => 'Time', cell: ({ row }) => timeAgo(row.original.timestamp) },
  { accessorKey: 'type', header: () => 'Type', cell: ({ row }) => <span className={row.original.type === 'buy' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{row.original.type.toUpperCase()}</span> },
  { accessorKey: 'amount', header: () => 'Amount (ETH)' },
  { accessorKey: 'price', header: () => 'Price (USD)', cell: ({ row }) => `$${row.original.price}` },
  { accessorKey: 'marketCap', header: () => 'Market Cap' },
  { accessorKey: 'address', header: () => 'Address', cell: ({ row }) => <span className="font-mono text-xs text-blue-400">{row.original.address.slice(0, 6) + '...' + row.original.address.slice(-4)}</span> },
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
  address: randomAddress(),
  type: randomType() as 'buy' | 'sell',
  price: randomPrice(),
}));

const mockTextRecords = (ens: string) => ({
  avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(ens)}`,
  twitter: `@${ens.replace('.eth', '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`,
  description: `This is a mock profile for ${ens}. ${ens} is a legendary onchain trader, meme connoisseur, and DeFi degen.`,
  website: `https://www.${ens.replace('.eth', '')}.xyz`,
  email: `${ens.replace('.eth', '')}@notareal.email`,
  location: 'Internet',
  github: `https://github.com/${ens.replace('.eth', '')}`,
  telegram: `t.me/${ens.replace('.eth', '')}`,
});

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
  const isOwnProfile = ens === 'myaccount.eth'; // Demo: replace with real user check
  return (
    <Layout accountId={ens} appName="Profile" navbarItems={[]}>
      <Head>
        <title>{ens} | FluxPool Profile</title>
      </Head>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto min-h-screen py-12">
        {/* Left: Profile Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-6">
          <Card className="w-full shadow-md">
            <CardContent className="flex flex-col items-center md:items-start space-y-4 p-6">
              <Avatar className="w-28 h-28 mb-2">
                <AvatarImage src={records.avatar} alt={ens} />
                <AvatarFallback>{ens.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-gray-200">{ens}</h2>
              <Badge variant="default">{records.email}</Badge>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1"><UserPlus className="h-4 w-4" /> Follow</Button>
                {!isOwnProfile && (
                  <Button size="sm" variant="default" className="flex items-center gap-1" onClick={() => setMsgOpen(true)}><MessageCircle className="h-4 w-4" /> Message</Button>
                )}
              </div>
              {/* Message Dialog */}
              <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Message to {ens}</DialogTitle>
                  </DialogHeader>
                  {msgSent ? (
                    <div className="text-green-400 text-center py-8">Message sent successfully!</div>
                  ) : (
                    <>
                      <textarea
                        className="w-full min-h-[80px] rounded border border-gray-700 bg-gray-900 p-2 text-white"
                        placeholder={`Write a message to ${ens}...`}
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
              <Separator className="my-2 bg-muted" />
              <div className="w-full space-y-1">
                <ProfileField label="Description" value={records.description || ''} />
                <ProfileField label="Twitter" value={records.twitter || ''} />
                <ProfileField label="Website" value={records.website || ''} />
                <ProfileField label="Location" value={records.location || ''} />
                <ProfileField label="GitHub" value={records.github || ''} />
                <ProfileField label="Telegram" value={records.telegram || ''} />
              </div>
              <Separator className="my-2 bg-muted" />
              <div className="flex gap-4 text-xs text-gray-400">
                <span><b>{followers}</b> Followers</span>
                <span><b>{following}</b> Following</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>PnL: <span className={pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{pnl}</span></span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right: Activity Feed */}
        <div className="w-full md:w-2/3 flex flex-col space-y-6">
          <Card className="w-full shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-200">Trading Activity</h3>
              </div>
              <DataTable columns={tradeColumns} data={mockTrades} />
            </CardContent>
          </Card>
          <Card className="w-full shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-200">Friends</h3>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=fakefriend${i}`} />
                      <AvatarFallback>FF{i+1}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs mt-1 text-gray-200">friend{i+1}.eth</span>
                  </div>
                ))}
              </div>
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