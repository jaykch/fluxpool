import Layout from '@/components/layout';
import { Card, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, ArrowDownLeft, ArrowUpRight, DollarSign, TrendingUp, TrendingDown, Banknote, Gift, CreditCard, CheckCircle, Star, Plus, Share2, Copy, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import DepositModal from '@/components/DepositModal';

// --- SVG LOGOS AND TOKENLOGOS (copied from profile page) ---
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
const tokenLogos: Record<string, () => JSX.Element> = {
  ETH: () => <EthereumLogoSVG className="w-6 h-6" />, // Use SVG for ETH
  SOL: () => <SolanaLogoSVG className="w-6 h-6" />, // Use SVG for SOL
  BTC: () => <BitcoinLogoSVG className="w-6 h-6" />, // Use SVG for BTC
  UNI: () => <UniswapLogoSVG className="w-6 h-6" />, // Use SVG for UNI
};

// Holdings mock data using the same tokens as profile page
const holdings = [
  {
    symbol: 'SOL',
    name: 'Solana',
    avatar: tokenLogos.SOL,
    percent: 50.58,
    amountHeld: 120,
    amountBought: 200,
    amountSoldProfit: 50,
    amountSoldLoss: 30,
    pnl: '+$1,250.00',
    pnlPercent: '+12.5%',
    timeHeld: 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 5, // 7d 5h
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    avatar: tokenLogos.ETH,
    percent: 30.12,
    amountHeld: 10,
    amountBought: 15,
    amountSoldProfit: 2,
    amountSoldLoss: 3,
    pnl: '-$320.00',
    pnlPercent: '-2.1%',
    timeHeld: 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 8, // 2d 8h
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    avatar: tokenLogos.BTC,
    percent: 15.30,
    amountHeld: 0.5,
    amountBought: 1.2,
    amountSoldProfit: 0.4,
    amountSoldLoss: 0.3,
    pnl: '+$2,100.00',
    pnlPercent: '+5.8%',
    timeHeld: 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2, // 14d 2h
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    avatar: tokenLogos.UNI,
    percent: 4.00,
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

// Pie chart helper for allocation
function PortfolioPieChart({ data, size = 180 }: { data: { value: number; color: string; label: string }[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const center = size / 2;
  const radius = center - 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block mx-auto">
      {data.map((d, i) => {
        const startAngle = (cumulative / total) * 2 * Math.PI;
        const endAngle = ((cumulative + d.value) / total) * 2 * Math.PI;
        const x1 = center + radius * Math.sin(startAngle);
        const y1 = center - radius * Math.cos(startAngle);
        const x2 = center + radius * Math.sin(endAngle);
        const y2 = center - radius * Math.cos(endAngle);
        const largeArc = d.value / total > 0.5 ? 1 : 0;
        const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
        cumulative += d.value;
        return (
          <g key={i}>
            <path d={pathData} fill={d.color} opacity={0.92} style={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.12))' }} />
            <path d={pathData} fill="url(#glass)" opacity={0.18} />
          </g>
        );
      })}
      <defs>
        <radialGradient id="glass" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export default function PortfolioPage() {
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastToken, setBroadcastToken] = useState<string | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastConfirmed, setBroadcastConfirmed] = useState(false);

  const openBroadcast = (symbol: string) => {
    setBroadcastToken(symbol);
    setBroadcastOpen(true);
    setBroadcastMsg('');
    setBroadcastConfirmed(false);
  };
  const closeBroadcast = () => {
    setBroadcastOpen(false);
    setBroadcastToken(null);
    setBroadcastMsg('');
    setBroadcastConfirmed(false);
  };
  const handleBroadcast = () => {
    // Save to localStorage for parity with TradingData
    if (broadcastToken && broadcastMsg.trim()) {
      const prev = JSON.parse(localStorage.getItem('fluxpool-broadcasts') || '[]');
      prev.push({
        token: broadcastToken,
        message: broadcastMsg,
        time: new Date().toISOString(),
      });
      localStorage.setItem('fluxpool-broadcasts', JSON.stringify(prev));
      setBroadcastConfirmed(true);
      setTimeout(() => {
        closeBroadcast();
      }, 1500);
    }
  };

  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('Card');
  const [depositConfirmed, setDepositConfirmed] = useState(false);

  const openDeposit = () => {
    setDepositOpen(true);
    setDepositAmount('');
    setDepositMethod('Card');
    setDepositConfirmed(false);
  };
  const closeDeposit = () => {
    setDepositOpen(false);
    setDepositAmount('');
    setDepositMethod('Card');
    setDepositConfirmed(false);
  };
  const handleDeposit = () => {
    setDepositConfirmed(true);
    setTimeout(() => {
      closeDeposit();
    }, 1500);
  };

  return (
    <Layout accountId="" appName="Portfolio" navbarItems={[]}> 
      <main className="flex flex-col gap-8 px-4 py-8 w-full">
        {/* Portfolio Overview */}
        <Card className="bg-white/10 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <CardTitle className="text-white text-2xl mb-2">Portfolio Overview</CardTitle>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-gray-400 text-sm">Total Balance</div>
                <div className="text-white text-3xl font-bold">$12,345.67</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Lifetime PnL</div>
                <div className="text-green-400 text-xl font-bold flex items-center gap-1">
                  <TrendingUp className="h-5 w-5" /> +$2,345.67 (18.2%)
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">24h PnL</div>
                <div className="text-red-400 text-xl font-bold flex items-center gap-1">
                  <TrendingDown className="h-5 w-5" /> -$123.45 (-0.9%)
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-[220px]">
            <Button onClick={() => setDepositOpen(true)} className="w-full bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white font-semibold shadow flex items-center gap-2"><ArrowDownLeft className="h-4 w-4" /> Deposit</Button>
            <Button className="w-full bg-gradient-to-br from-fuchsia-500/60 to-violet-500/60 text-white font-semibold shadow flex items-center gap-2"><ArrowUpRight className="h-4 w-4" /> Withdraw</Button>
          </div>
        </Card>

        {/* Holdings Section - Profile Style */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <Card className="flex-1 bg-white/10 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-6">
            <CardTitle className="text-white text-xl mb-4">Holdings</CardTitle>
            <div className="divide-y divide-white/10">
              {holdings.map((h, i) => {
                const heldPercent = h.amountBought > 0 ? (h.amountHeld / h.amountBought) * 100 : 0;
                const soldProfitPercent = h.amountBought > 0 ? (h.amountSoldProfit / h.amountBought) * 100 : 0;
                const soldLossPercent = h.amountBought > 0 ? (h.amountSoldLoss / h.amountBought) * 100 : 0;
                return (
                  <div key={h.symbol} className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10">
                        {typeof h.avatar === 'function' ? h.avatar() : null}
                      </div>
                      <span className="text-white font-medium text-base w-16">{h.symbol}</span>
                      <span className="text-gray-300 font-mono text-xs">{h.percent.toFixed(2)}%</span>
                      <span className={`font-mono text-xs ${h.pnl.startsWith('+') ? 'text-green-400' : h.pnl.startsWith('-') ? 'text-red-400' : 'text-gray-300'}`}>{h.pnl} {h.pnlPercent !== '-' && `(${h.pnlPercent})`}</span>
                      <span className="text-xs text-gray-400">Held: <span className="text-white font-mono">{h.amountHeld}</span></span>
                      <span className="text-xs text-gray-400">Bought: <span className="text-white font-mono">{h.amountBought}</span></span>
                      <span className="text-xs text-green-400">Sold (Profit): <span className="text-white font-mono">{h.amountSoldProfit}</span></span>
                      <span className="text-xs text-red-400">Sold (Loss): <span className="text-white font-mono">{h.amountSoldLoss}</span></span>
                      <span className="text-xs text-gray-400">Time: <span className="text-white font-mono">{formatTimeHeld(h.timeHeld)}</span></span>
                      <Button size="sm" className="bg-violet-500/20 text-white ml-auto">Trade</Button>
                      <Button size="icon" variant="ghost" className="ml-2 text-white hover:bg-white/20" onClick={() => openBroadcast(h.symbol)}><Share2 className="h-4 w-4" /></Button>
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
          </Card>
          {/* Pie/Bar Chart Placeholder replaced with Pie Chart */}
          <Card className="w-full md:w-[340px] bg-white/10 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-6 flex flex-col items-center justify-center">
            <CardTitle className="text-white text-xl mb-4 flex items-center gap-2"><PieChart className="h-6 w-6 text-violet-400" /> Allocation</CardTitle>
            <div className="w-full flex flex-col items-center justify-center">
              <PortfolioPieChart
                data={[
                  { value: 48, color: '#8b5cf6', label: 'ETH' },
                  { value: 25, color: '#38bdf8', label: 'USDC' },
                  { value: 10, color: '#f472b6', label: 'UNI' },
                  { value: 17, color: '#a3e635', label: 'Other' },
                ]}
              />
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                <span className="flex items-center gap-1 text-xs text-white"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#8b5cf6' }} /> ETH 48%</span>
                <span className="flex items-center gap-1 text-xs text-white"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#38bdf8' }} /> USDC 25%</span>
                <span className="flex items-center gap-1 text-xs text-white"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#f472b6' }} /> UNI 10%</span>
                <span className="flex items-center gap-1 text-xs text-white"><span className="w-3 h-3 rounded-full inline-block" style={{ background: '#a3e635' }} /> Other 17%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="bg-white/10 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-6">
          <CardTitle className="text-white text-xl mb-4">Recent Activity</CardTitle>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="trades">Trades</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-white">Deposited $2,000 via Privy Fiat</span>
                  <span className="text-xs text-gray-400 ml-auto">2d ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Bought 1.2 ETH</span>
                  <span className="text-xs text-gray-400 ml-auto">1d ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="h-5 w-5 text-fuchsia-400" />
                  <span className="text-white">Withdrew $500</span>
                  <span className="text-xs text-gray-400 ml-auto">12h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Sold 0.5 BTC</span>
                  <span className="text-xs text-gray-400 ml-auto">10h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-white">Deposited $1,000 via Privy Fiat</span>
                  <span className="text-xs text-gray-400 ml-auto">8h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="h-5 w-5 text-fuchsia-400" />
                  <span className="text-white">Withdrew $250</span>
                  <span className="text-xs text-gray-400 ml-auto">6h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Bought 300 UNI</span>
                  <span className="text-xs text-gray-400 ml-auto">3h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Bought 50 SOL</span>
                  <span className="text-xs text-gray-400 ml-auto">1h ago</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="deposits">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-white">Deposited $2,000 via Privy Fiat</span>
                  <span className="text-xs text-gray-400 ml-auto">2d ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-white">Deposited $1,000 via Privy Fiat</span>
                  <span className="text-xs text-gray-400 ml-auto">8h ago</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="trades">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Bought 1.2 ETH</span>
                  <span className="text-xs text-gray-400 ml-auto">1d ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Sold 0.5 BTC</span>
                  <span className="text-xs text-gray-400 ml-auto">10h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Bought 300 UNI</span>
                  <span className="text-xs text-gray-400 ml-auto">3h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowUpRight className="h-5 w-5 text-violet-400" />
                  <span className="text-white">Bought 50 SOL</span>
                  <span className="text-xs text-gray-400 ml-auto">1h ago</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="withdrawals">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="h-5 w-5 text-fuchsia-400" />
                  <span className="text-white">Withdrew $500</span>
                  <span className="text-xs text-gray-400 ml-auto">12h ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="h-5 w-5 text-fuchsia-400" />
                  <span className="text-white">Withdrew $250</span>
                  <span className="text-xs text-gray-400 ml-auto">6h ago</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Fiat Onramp Section Only (Rewards removed) + Invite Friends */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Fiat Onramp */}
          <Card className="flex-1 bg-white/10 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-6 flex flex-col items-center justify-center">
            <CardTitle className="text-white text-xl mb-4 flex items-center gap-2"><Banknote className="h-6 w-6 text-green-400" /> Fiat Onramp</CardTitle>
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                <span className="text-white">Buy crypto with card</span>
              </div>
              <Button onClick={() => setDepositOpen(true)} className="w-full bg-gradient-to-br from-green-400/60 to-blue-400/60 text-white font-semibold shadow flex items-center gap-2"><Plus className="h-4 w-4" /> Add Funds</Button>
              <div className="text-xs text-gray-400 text-center">Powered by Privy Fiat Onramp. Your funds are securely processed.</div>
            </div>
          </Card>
          {/* Invite Friends Panel */}
          <Card className="flex-1 bg-white/10 backdrop-blur-lg shadow-2xl border-0 rounded-2xl p-6 flex flex-col items-center justify-center">
            <CardTitle className="text-white text-xl mb-4 flex items-center gap-2"><UserPlus className="h-6 w-6 text-violet-400" /> Invite Friends</CardTitle>
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2 w-full">
                <span className="text-gray-300 text-sm">Share your referral link and earn rewards when friends join Fluxpool!</span>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 w-full">
                  <span className="text-xs text-white font-mono truncate">https://fluxpool.xyz/ref/yourcode123</span>
                  <Button size="icon" variant="ghost" className="text-violet-400 hover:bg-violet-500/10" onClick={() => {navigator.clipboard.writeText('https://fluxpool.xyz/ref/yourcode123')}}><Copy className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="bg-gradient-to-br from-violet-500/70 to-fuchsia-500/70 text-white shadow border-0 transition-all hover:from-violet-400 hover:to-fuchsia-400" onClick={() => window.open('mailto:?subject=Join%20me%20on%20Fluxpool&body=Sign%20up%20with%20my%20referral%20link:%20https://fluxpool.xyz/ref/yourcode123', '_blank')}>Email</Button>
                  <Button size="sm" className="bg-gradient-to-br from-blue-500/70 to-cyan-400/70 text-white shadow border-0 transition-all hover:from-blue-400 hover:to-cyan-300" onClick={() => window.open('https://twitter.com/intent/tweet?text=Join%20me%20on%20Fluxpool!%20https://fluxpool.xyz/ref/yourcode123', '_blank')}>Twitter</Button>
                  <Button size="sm" className="bg-gradient-to-br from-green-400/70 to-blue-400/70 text-white shadow border-0 transition-all hover:from-green-300 hover:to-blue-300" onClick={() => window.open('https://t.me/share/url?url=https://fluxpool.xyz/ref/yourcode123', '_blank')}>Telegram</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        {/* Broadcast Modal */}
        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogContent className="bg-white/10 backdrop-blur-lg border-0 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2"><Share2 className="h-5 w-5" /> Share {broadcastToken} as Broadcast</DialogTitle>
            </DialogHeader>
            {broadcastConfirmed ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-green-400 text-2xl mb-2">Broadcast shared!</div>
                <div className="text-gray-300 text-sm">Your holding has been shared as a broadcast.</div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 mt-2">
                  <textarea
                    className="w-full rounded-lg bg-white/10 text-white p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none min-h-[80px]"
                    placeholder={`Share your thoughts about ${broadcastToken}...`}
                    value={broadcastMsg}
                    onChange={e => setBroadcastMsg(e.target.value)}
                    maxLength={240}
                    disabled={broadcastConfirmed}
                  />
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{broadcastMsg.length}/240</span>
                    <DialogClose asChild>
                      <Button variant="ghost" className="text-gray-400" disabled={broadcastConfirmed}>Cancel</Button>
                    </DialogClose>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleBroadcast} disabled={!broadcastMsg.trim() || broadcastConfirmed} className="bg-gradient-to-br from-violet-500/60 to-fuchsia-500/60 text-white font-semibold shadow">Share Broadcast</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        {/* Shared Deposit Modal */}
        <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
      </main>
    </Layout>
  );
} 