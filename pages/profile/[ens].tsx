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
import { TrendingUp, UserPlus, MessageCircle, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trophy, Share2, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePrivy } from "@privy-io/react-auth";
import BroadcastCard from "@/components/BroadcastCard";
import React from 'react';

// --- SVG LOGOS AND TOKENLOGOS (MUST BE FIRST) ---
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
const tokenLogos: Record<string, string | (() => JSX.Element)> = {
  ETH: () => <EthereumLogoSVG className="w-6 h-6" />, // Use SVG for ETH
  SOL: () => <SolanaLogoSVG className="w-6 h-6" />, // Use SVG for SOL
  BTC: () => <BitcoinLogoSVG className="w-6 h-6" />, // Use SVG for BTC
  UNI: () => <UniswapLogoSVG className="w-6 h-6" />, // Use SVG for UNI
  LINK: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
};

// Fallback avatar SVG for missing tokens
function DefaultTokenLogo({ className = "w-6 h-6" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#444" /></svg>;
}

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
// Enhanced mock holdings with PnL, time held, amount, bought, sold
const mockHoldings = [
  {
    symbol: 'SOL', name: 'Solana', avatar: tokenLogos.SOL || (() => <DefaultTokenLogo />), percent: 50.58,
    amountHeld: 120,
    amountBought: 200,
    amountSoldProfit: 50,
    amountSoldLoss: 30,
    pnl: '+$1,250.00',
    pnlPercent: '+12.5%',
    timeHeld: 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 5, // 7d 5h
  },
  {
    symbol: 'ETH', name: 'Ethereum', avatar: tokenLogos.ETH || (() => <DefaultTokenLogo />), percent: 30.12,
    amountHeld: 10,
    amountBought: 15,
    amountSoldProfit: 2,
    amountSoldLoss: 3,
    pnl: '-$320.00',
    pnlPercent: '-2.1%',
    timeHeld: 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 8, // 2d 8h
  },
  {
    symbol: 'BTC', name: 'Bitcoin', avatar: tokenLogos.BTC || (() => <DefaultTokenLogo />), percent: 15.30,
    amountHeld: 0.5,
    amountBought: 1.2,
    amountSoldProfit: 0.4,
    amountSoldLoss: 0.3,
    pnl: '+$2,100.00',
    pnlPercent: '+5.8%',
    timeHeld: 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2, // 14d 2h
  },
  {
    symbol: 'UNI', name: 'Uniswap', avatar: tokenLogos.UNI || (() => <DefaultTokenLogo />), percent: 4.00,
    amountHeld: 300,
    amountBought: 500,
    amountSoldProfit: 120,
    amountSoldLoss: 80,
    pnl: '+$80.00',
    pnlPercent: '+1.2%',
    timeHeld: 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 12, // 1d 12h
  },
];

function formatTimeHeld(ms: number) {
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return `${d ? `${d}d ` : ''}${h}h`;
}

// Lightweight chart for broadcasts (dynamically import to avoid SSR issues)
const MiniChart = dynamic(() => import('@/components/MiniChart'), { ssr: false });

// Mock positions for the user (only tokens with a position can be broadcasted)
type Position = {
  symbol: string;
  name: string;
  avatar: string | (() => JSX.Element);
  side: 'Long' | 'Short';
  entry: number;
  current: number;
  pnl: () => string;
  pnlPercent: () => string;
  time: Date;
};
const mockPositions: Position[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    avatar: tokenLogos.ETH || (() => <DefaultTokenLogo />),
    side: Math.random() > 0.5 ? 'Long' : 'Short',
    entry: 2400 + Math.random() * 100,
    current: 2400 + Math.random() * 100,
    pnl: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
    },
    pnlPercent: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return ((diff / this.entry) * 100).toFixed(2) + '%';
    },
    time: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    avatar: tokenLogos.SOL || (() => <DefaultTokenLogo />),
    side: Math.random() > 0.5 ? 'Long' : 'Short',
    entry: 100 + Math.random() * 10,
    current: 100 + Math.random() * 10,
    pnl: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
    },
    pnlPercent: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return ((diff / this.entry) * 100).toFixed(2) + '%';
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    avatar: tokenLogos.BTC || (() => <DefaultTokenLogo />),
    side: Math.random() > 0.5 ? 'Long' : 'Short',
    entry: 60000 + Math.random() * 2000,
    current: 60000 + Math.random() * 2000,
    pnl: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
    },
    pnlPercent: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return ((diff / this.entry) * 100).toFixed(2) + '%';
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    avatar: tokenLogos.UNI || (() => <DefaultTokenLogo />),
    side: Math.random() > 0.5 ? 'Long' : 'Short',
    entry: 10 + Math.random() * 2,
    current: 10 + Math.random() * 2,
    pnl: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
    },
    pnlPercent: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return ((diff / this.entry) * 100).toFixed(2) + '%';
    },
    time: new Date(Date.now() - 1000 * 60 * 60 * 8),
  },
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

// Helper to rehydrate a broadcast pos object with methods if missing
function rehydratePos(pos: any) {
  if (!pos) return pos;
  // Only rehydrate if methods are missing
  if (typeof pos.pnl === 'function' && typeof pos.pnlPercent === 'function') return pos;
  return {
    ...pos,
    pnl: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return diff > 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
    },
    pnlPercent: function (): string {
      const diff = (this.current - this.entry) * (this.side === 'Long' ? 1 : -1);
      return ((diff / this.entry) * 100).toFixed(2) + '%';
    },
    avatar: tokenLogos[pos.symbol] || tokenLogos.ETH,
  };
}

// Follow button with animation and feedback
function FollowButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'followed'>('idle');
  const handleFollow = () => {
    setState('loading');
    setTimeout(() => setState('followed'), 900);
  };
  return (
    <Button
      size="sm"
      variant="outline"
      className="flex items-center gap-1 transition-all duration-200"
      disabled={state === 'loading' || state === 'followed'}
      onClick={handleFollow}
    >
      {state === 'idle' && (<><UserPlus className="h-4 w-4" /> Follow</>)}
      {state === 'loading' && (<Loader2 className="h-4 w-4 animate-spin" />)}
      {state === 'followed' && (<><Check className="h-4 w-4" /> Followed</>)}
    </Button>
  );
}

export default function ProfilePage({ ens, records }: { ens: string; records: Record<string, string> }) {
  // Mock PnL and stats
  const pnl = Math.random() > 0.5 ? `+$${(Math.random() * 10000).toFixed(2)}` : `-$${(Math.random() * 10000).toFixed(2)}`;
  const followers = Math.floor(Math.random() * 1000);
  const following = Math.floor(Math.random() * 500);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const { user } = usePrivy();
  const userEns = user?.wallet?.address ? toFluxpoolENS(user.wallet.address) : undefined;
  const isOwnProfile = userEns && ens && userEns.toLowerCase() === ens.toLowerCase();
  const [statsTab, setStatsTab] = useState<'today' | 'week'>('today');
  const [mainTab, setMainTab] = useState<'broadcasts' | 'holdings'>('broadcasts');
  const fluxpoolEns = toFluxpoolENS(ens);
  const username = fluxpoolEns.replace('.fluxpool.eth', '');
  // Winning trades progress bar: hardcoded to +12% (profitable)
  const winRate = 12;
  const profitable = true;
  // Load saved broadcasts from localStorage if this is the user's own profile
  const [savedBroadcasts, setSavedBroadcasts] = useState<any[]>([]);
  React.useEffect(() => {
    if (isOwnProfile) {
      try {
        const raw = localStorage.getItem('fluxpool-broadcasts');
        if (raw) {
          let arr = JSON.parse(raw);
          // Only show broadcasts for this user (by ENS if present)
          arr = arr.filter((b: any) => {
            // If b.ens exists, match to userEns; else, if no ENS, assume all are for this user (legacy)
            if (b.ens) return b.ens.toLowerCase() === userEns?.toLowerCase();
            return true;
          });
          // Rehydrate pos and add username if missing
          arr = arr.map((b: any) => ({
            ...b,
            pos: rehydratePos(b.pos),
            username: username,
          }));
          setSavedBroadcasts(arr);
        }
      } catch {}
    }
  }, [isOwnProfile, userEns, username]);

  // Dynamic stats for Today/This Week
  const stats = useMemo(() => {
    if (statsTab === 'today') {
      return {
        volume: `$${(Math.random() * 10000 + 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        pnl: Math.random() > 0.5 ? `+$${(Math.random() * 1000).toFixed(2)}` : `-$${(Math.random() * 1000).toFixed(2)}`,
        maxTrade: `$${(Math.random() * 5000 + 500).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      };
    } else {
      return {
        volume: `$${(Math.random() * 50000 + 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        pnl: Math.random() > 0.5 ? `+$${(Math.random() * 5000).toFixed(2)}` : `-$${(Math.random() * 5000).toFixed(2)}`,
        maxTrade: `$${(Math.random() * 20000 + 2000).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      };
    }
  }, [statsTab]);
  return (
    <Layout accountId={ens} appName="Profile" navbarItems={[]}>
      <Head>
        <title>{fluxpoolEns} | FluxPool Profile</title>
      </Head>
      <div className="flex flex-col md:flex-row gap-8 w-full min-h-screen py-10 px-4 md:px-16">
        {/* Left: Profile Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-6">
          {/* Profile Header */}
          <div className="w-full flex flex-col items-center md:items-start relative">
            {/* Share icon only */}
            <div className="absolute right-0 top-0 flex gap-2">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><Share2 className="h-5 w-5" /></button>
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
              <FollowButton />
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
                <button
                  onClick={() => setStatsTab('today')}
                  className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-200 border shadow-lg
                    ${statsTab === 'today'
                      ? 'bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-white border-violet-400/40 shadow-violet-500/20'
                      : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'}
                  `}
                >
                  Today
                </button>
                <button
                  onClick={() => setStatsTab('week')}
                  className={`flex-1 py-2 rounded-xl font-semibold transition-all duration-200 border shadow-lg
                    ${statsTab === 'week'
                      ? 'bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-white border-violet-400/40 shadow-violet-500/20'
                      : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20 hover:text-white'}
                  `}
                >
                  This Week
                </button>
              </div>
              <div className="flex justify-between gap-2 mb-4">
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-400">Volume</span>
                  <span className="text-lg font-bold text-white">{stats.volume}</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-400">P&L</span>
                  <span className={`text-lg font-bold ${stats.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stats.pnl}</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs text-gray-400">Max Trade Size</span>
                  <span className="text-lg font-bold text-white">{stats.maxTrade}</span>
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
        {/* Right: Stats, Tabs */}
        <div className="w-full md:w-2/3 flex flex-col">
          {/* Winning Trades Progress Bar (above tabs, larger and more prominent) */}
          <div className="w-full mt-2 mb-2">
            <div className="flex flex-col items-center mb-6">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-base font-semibold text-gray-200 tracking-wide">Winning Trades</span>
                <span className="text-base font-bold text-green-400">+12% Profitable</span>
              </div>
              <div className="w-full h-6 rounded-2xl bg-white/10 overflow-hidden shadow-lg border border-white/10">
                <div
                  className="h-full rounded-2xl transition-all duration-500 bg-green-500"
                  style={{ width: `12%` }}
                />
              </div>
            </div>
          </div>
          {/* Tabs Section */}
          <div className="w-full mt-0">
            <Tabs value={mainTab} onValueChange={v => setMainTab(v as 'broadcasts' | 'holdings')} className="w-full" defaultValue="broadcasts">
              <TabsList className="w-full flex bg-white/10 rounded-xl mb-2 h-8">
                <TabsTrigger value="broadcasts" className="flex-1 text-white text-xs py-1">Broadcasts</TabsTrigger>
                <TabsTrigger value="holdings" className="flex-1 text-white text-xs py-1">Holdings</TabsTrigger>
              </TabsList>
              <TabsContent value="broadcasts">
                <div className="flex flex-col gap-4 py-4">
                  {/* Show saved broadcasts first if own profile */}
                  {isOwnProfile && savedBroadcasts.length > 0 && savedBroadcasts.map((b, i) => (
                    <BroadcastCard
                      key={i + '-saved'}
                      pos={b.pos}
                      username={username}
                      timeAgo={timeAgo(new Date(b.time))}
                      message={b.message}
                    />
                  ))}
                  {/* Show mock positions as broadcasts */}
                  {mockPositions.map((pos: Position, i: number) => (
                    <BroadcastCard
                      key={pos.symbol}
                      pos={pos}
                      username={username}
                      timeAgo={timeAgo(pos.time)}
                    />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="holdings">
                <div className="divide-y divide-white/10">
                  {mockHoldings.map((h, i) => {
                    const heldPercent = h.amountBought > 0 ? (h.amountHeld / h.amountBought) * 100 : 0;
                    const soldProfitPercent = h.amountBought > 0 ? (h.amountSoldProfit / h.amountBought) * 100 : 0;
                    const soldLossPercent = h.amountBought > 0 ? (h.amountSoldLoss / h.amountBought) * 100 : 0;
                    return (
                      <div key={h.symbol} className="flex flex-col gap-1 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10">
                            {typeof h.avatar === 'function' ? h.avatar() : <img src={h.avatar} alt={h.symbol} className="w-6 h-6 object-contain" />}
                          </div>
                          <span className="text-white font-medium text-base w-16">{h.symbol}</span>
                          <span className="text-gray-300 font-mono text-xs">{h.percent.toFixed(2)}%</span>
                          <span className={`font-mono text-xs ${h.pnl.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{h.pnl} ({h.pnlPercent})</span>
                          <span className="text-xs text-gray-400">Held: <span className="text-white font-mono">{h.amountHeld}</span></span>
                          <span className="text-xs text-gray-400">Bought: <span className="text-white font-mono">{h.amountBought}</span></span>
                          <span className="text-xs text-blue-400">Sold (Profit): <span className="text-white font-mono">{h.amountSoldProfit}</span></span>
                          <span className="text-xs text-red-400">Sold (Loss): <span className="text-white font-mono">{h.amountSoldLoss}</span></span>
                          <span className="text-xs text-gray-400">Time: <span className="text-white font-mono">{formatTimeHeld(h.timeHeld)}</span></span>
                        </div>
                        {/* Bar visualization for held vs sold at profit/loss */}
                        <div className="w-full flex items-center gap-2 mt-1">
                          <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full bg-violet-500/80" style={{ width: `${heldPercent}%` }} />
                            <div className="absolute left-0 top-0 h-full bg-green-500/80" style={{ left: `${heldPercent}%`, width: `${soldProfitPercent}%` }} />
                            <div className="absolute left-0 top-0 h-full bg-red-500/70" style={{ left: `${heldPercent + soldProfitPercent}%`, width: `${soldLossPercent}%` }} />
                          </div>
                          <span className="text-xs text-violet-400">{heldPercent.toFixed(0)}% held</span>
                          <span className="text-xs text-green-400">{soldProfitPercent.toFixed(0)}% sold (profit)</span>
                          <span className="text-xs text-red-400">{soldLossPercent.toFixed(0)}% sold (loss)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* Trading Activity Section (full width, bottom) */}
      <div className="w-full mt-6 px-4 md:px-16">
        <Card className="w-full rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-200">Trading Activity</h3>
            </div>
            <DataTable columns={tradeColumns} data={mockTrades} />
          </CardContent>
        </Card>
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