import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Megaphone } from "lucide-react";
import Layout from "@/components/layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useMemo } from "react";
// Import the MiniChart and SVG logos from the profile page
import MiniChart from "@/components/MiniChart";
import BroadcastCard from "@/components/BroadcastCard";
// Inline SVGs for ETH, SOL, BTC, UNI (copied from profile page)
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
};

const mockPositions = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    avatar: tokenLogos.ETH,
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
    avatar: tokenLogos.SOL,
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
    avatar: tokenLogos.BTC,
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
    avatar: tokenLogos.UNI,
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

const LOCAL_STORAGE_KEY = "fluxpool-messages";

const initialThreads = [
  {
    id: 1,
    sender: "trader123",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=trader123",
    preview: "Hey! Are you still holding SOL?",
    time: "2m ago",
    unread: true,
    messages: [
      { fromMe: false, text: "Hey! Are you still holding SOL?", time: "2m ago" },
      { fromMe: true, text: "Yeah, still holding. You?", time: "1m ago" },
      { fromMe: false, text: "Sold half, thinking of buying back.", time: "Just now" },
    ],
  },
  {
    id: 2,
    sender: "ape4life",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=ape4life",
    preview: "Check out this new pool!",
    time: "10m ago",
    unread: false,
    messages: [
      { fromMe: false, text: "Check out this new pool!", time: "10m ago" },
      { fromMe: true, text: "Link?", time: "9m ago" },
      { fromMe: false, text: "Sent on Discord!", time: "8m ago" },
    ],
  },
  {
    id: 3,
    sender: "diamondhandz",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=diamondhandz",
    preview: "Nice trade on ETH!",
    time: "1h ago",
    unread: true,
    messages: [
      { fromMe: false, text: "Nice trade on ETH!", time: "1h ago" },
      { fromMe: true, text: "Thanks! 🚀", time: "59m ago" },
      { fromMe: false, text: "What are you watching next?", time: "58m ago" },
    ],
  },
];

function getThreadsFromStorage() {
  if (typeof window === "undefined") return initialThreads;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return initialThreads;
  try {
    return JSON.parse(stored);
  } catch {
    return initialThreads;
  }
}

function saveThreadsToStorage(threads: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(threads));
}

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

import Link from "next/link";

export default function MessagesPage() {
  const [threads, setThreads] = useState<any[]>(getThreadsFromStorage());
  const [selectedId, setSelectedId] = useState<number>(threads[0]?.id || 1);
  const [reply, setReply] = useState("");
  const selectedThread = threads.find((t) => t.id === selectedId);

  // Keep threads in sync with localStorage
  useEffect(() => {
    saveThreadsToStorage(threads);
  }, [threads]);

  // Send message
  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    const now = new Date();
    const msg = {
      fromMe: true,
      text: reply,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setThreads((prev) => prev.map((t) =>
      t.id === selectedId ? { ...t, messages: [...t.messages, msg] } : t
    ));
    setReply("");
  }

  const randomBroadcasts = [
    "Longed ETH for a breakout. 🚀",
    "Shorted SOL for a quick scalp. 🔻",
    "Watching BTC for a reversal.",
    "Just closed a big trade on $ETH. Up 12% this week! 🚀",
    "Watching $SOL for a breakout. Who's in? 🔥",
    "New strategy: curve trading. Results soon. Stay tuned!",
    "Added liquidity to UNI/ETH pool.",
    "PnL update: +$1,200",
    "Sold half my AVAX, looking for re-entry.",
    "Broadcast: Market is heating up!"
  ];

  function handleSendBroadcast() {
    // Pick a random mock position for the broadcast
    const pos = mockPositions[Math.floor(Math.random() * mockPositions.length)];
    const now = new Date();
    const broadcastMsg = {
      fromMe: true,
      broadcast: true,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pos,
    };
    setThreads((prev) => prev.map((t) =>
      t.id === selectedId ? { ...t, messages: [...t.messages, broadcastMsg] } : t
    ));
  }

  return (
    <Layout accountId="" appName="Messages" navbarItems={[]}> 
      <div className="flex flex-row w-full min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] max-w-none gap-0">
        {/* Left: Message list */}
        <div className="w-full max-w-xs flex-shrink-0">
          <Card className="bg-white/5 border border-white/10 h-full flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <MessageCircle className="h-6 w-6 text-violet-500" />
              <CardTitle className="text-lg text-white">Messages</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-white/10 p-0 overflow-y-auto flex-1 h-full">
              {threads.map((msg) => {
                const profileUrl = `/profile/${msg.ens || msg.sender}`;
                return (
                  <button
                    key={msg.id}
                    className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-white/10 transition-colors text-left ${selectedId === msg.id ? 'bg-white/10' : ''}`}
                    onClick={() => setSelectedId(msg.id)}
                  >
                    <Link href={profileUrl} passHref legacyBehavior>
                      <a onClick={e => { e.stopPropagation(); }} className="flex items-center gap-2 group">
                        <Avatar className="w-10 h-10 group-hover:ring-2 group-hover:ring-violet-500">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>{msg.sender?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-white truncate max-w-[120px] group-hover:underline">{msg.sender}</span>
                      </a>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {msg.unread && <Badge variant="destructive" className="ml-1">Unread</Badge>}
                      </div>
                      <div className="text-gray-300 text-sm truncate max-w-xs">{msg.preview}</div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">{msg.time}</div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
        {/* Right: Conversation */}
        <div className="flex-1 flex flex-col">
          <Card className="bg-white/5 border border-white/10 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 pb-4">
              <Link href={`/profile/${selectedThread?.ens || selectedThread?.sender}`} className="flex items-center gap-2 group">
                <Avatar className="w-8 h-8 group-hover:ring-2 group-hover:ring-violet-500">
                  <AvatarImage src={selectedThread?.avatar} />
                  <AvatarFallback>{selectedThread?.sender?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-base text-white group-hover:underline">{selectedThread?.sender}</CardTitle>
              </Link>
              <Button size="sm" variant="outline" className="ml-auto" onClick={handleSendBroadcast}>
                <Megaphone className="h-4 w-4 mr-1" /> Send Broadcast
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-2 p-6 overflow-y-auto h-full">
              {(selectedThread?.messages ?? []).map((m: any, i: number) => {
                if (m.broadcast && m.pos) {
                  const pos = rehydratePos(m.pos);
                  return (
                    <div key={i} className="flex justify-center py-2">
                      <div className="w-full max-w-2xl">
                        <BroadcastCard pos={pos} username="You" timeAgo={m.time || "now"} />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={i} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`rounded-lg px-4 py-2 max-w-xs ${m.broadcast ? 'bg-yellow-500/90 text-black font-bold' : m.fromMe ? 'bg-gradient-to-br from-purple-500/60 via-purple-600/60 to-fuchsia-500/60 text-white border border-purple-400/40 shadow-lg backdrop-blur-md' : 'bg-white/10 text-gray-200'} shadow-sm`}> 
                        {m.text}
                        <div className="text-xs text-gray-400 mt-1 text-right">{m.time}</div>
                      </div>
                    </div>
                  );
                }
              })}
            </CardContent>
            <form className="flex items-center gap-2 p-4 border-t border-white/10 bg-white/5" onSubmit={handleSendMessage}>
              <input
                className="flex-1 rounded-lg bg-white/10 border border-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Type your reply..."
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
              <Button type="submit" size="icon" variant="default" disabled={!reply.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 