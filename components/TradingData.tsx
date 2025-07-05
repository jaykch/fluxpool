import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Users, Wallet, BarChart3, Trophy } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { getENSorAddress } from "@/lib/ens";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

// Helper for time ago
function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// Generate a random Ethereum address
function randomAddress() {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

// Generate a random market cap
function randomMarketCap() {
  const n = Math.floor(Math.random() * 100_000_000) + 1_000_000;
  return `$${n.toLocaleString()}`;
}

// Generate a random amount
function randomAmount() {
  return (Math.random() * 10).toFixed(3);
}

// Generate a random type
function randomType() {
  return Math.random() > 0.5 ? "buy" : "sell";
}

// Generate a random price
function randomPrice() {
  return (2400 + Math.random() * 100).toFixed(2);
}

// Trade type
interface Trade {
  id: number;
  timestamp: Date;
  marketCap: string;
  amount: string;
  address: string;
  ens?: string;
  type: "buy" | "sell";
  price: string;
}

const tradeColumns: ColumnDef<Trade>[] = [
  {
    accessorKey: "timestamp",
    header: () => "Time",
    cell: ({ row }) => timeAgo(row.original.timestamp),
  },
  {
    accessorKey: "type",
    header: () => "Type",
    cell: ({ row }) => (
      <span className={row.original.type === "buy" ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
        {row.original.type.toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: () => "Amount (ETH)",
    cell: ({ row }) => row.original.amount,
  },
  {
    accessorKey: "price",
    header: () => "Price (USD)",
    cell: ({ row }) => `$${row.original.price}`,
  },
  {
    accessorKey: "marketCap",
    header: () => "Market Cap",
    cell: ({ row }) => row.original.marketCap,
  },
  {
    accessorKey: "address",
    header: () => "Address",
    cell: ({ row }) => {
      const ens = row.original.ens;
      const address = row.original.address;
      return ens ? (
        <Link href={`/profile/${ens}`} className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">
          {ens}
        </Link>
      ) : (
        <span className="font-mono text-xs text-blue-400">{address.slice(0, 6) + "..." + address.slice(-4)}</span>
      );
    },
  },
];

// List of ridiculous and humorous fake ENS names
const fakeENSNames = [
  "rugpullmaster.eth", "rektwizard.eth", "notyourkeys.eth", "vitalikbuterinbutnot.eth", "sushiswapfan.eth", "defi_dj.eth", "gwei_boi.eth", "hodlmybeer.eth", "ape4life.eth", "fomo.soon.eth", "paperhands.eth", "diamondhandz.eth", "gasguzzler.eth", "ponziplay.eth", "exitliquidity.eth", "safemoonbag.eth", "yolotrader.eth", "gmgn.eth", "to_the_moon.eth", "rektagain.eth", "whalealert.eth"
];

// --- Spot, Curve, Limit Positions Columns ---
interface Position {
  id: number;
  symbol: string;
  type: string;
  size: string;
  entry: string;
  current: string;
  pnl: string;
  pnlPercent: string;
  curve?: string; // Add curve field
}
const spotColumns: ColumnDef<Position>[] = [
  { accessorKey: "symbol", header: () => "Symbol" },
  { accessorKey: "type", header: () => "Type" },
  { accessorKey: "size", header: () => "Size" },
  { accessorKey: "entry", header: () => "Entry" },
  { accessorKey: "current", header: () => "Current" },
  { accessorKey: "pnl", header: () => "PnL", cell: ({ row }) => <span className={row.original.pnl.startsWith("+") ? "text-green-400" : "text-red-400"}>{row.original.pnl}</span> },
  { accessorKey: "pnlPercent", header: () => "%" },
];
// Curve columns: add curve name as first column
const curveColumns: ColumnDef<Position>[] = [
  { accessorKey: "curve", header: () => "Curve" },
  ...spotColumns,
];

// --- Holders Columns ---
interface Holder {
  id: number;
  address: string;
  holding: string;
  avgBuy: string;
  avgSold: string;
  positionSize: string;
  ethBalance: string;
  pnl: string;
  soldPercent: number;
}
// Helper for colored progress bar
function ColoredProgress({ value, positive }: { value: number; positive: boolean }) {
  return (
    <div className="flex-1">
      <Progress
        value={value}
        className={`h-3 bg-white/20 border border-white/20 shadow-inner rounded-full`}
        style={{}}
        children={<div className={`h-full w-full flex-1 rounded-full ${positive ? 'bg-green-400' : 'bg-red-400'} bg-opacity-80 shadow-md transition-all`} style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />}
      />
    </div>
  );
}
const holdersColumns: ColumnDef<Holder>[] = [
  { accessorKey: "address", header: () => "Address", cell: ({ row }) => (
    <Link href={`/profile/${row.original.address}`} className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">
      {row.original.address}
    </Link>
  ) },
  { accessorKey: "avgBuy", header: () => "Avg Buy" },
  { accessorKey: "avgSold", header: () => "Avg Sold" },
  { accessorKey: "positionSize", header: () => "Position Size" },
  { accessorKey: "ethBalance", header: () => "ETH Balance" },
  { accessorKey: "pnl", header: () => "PnL", cell: ({ row }) => <span className={row.original.pnl.startsWith("+") ? "text-green-400" : "text-red-400"}>{row.original.pnl}</span> },
  { accessorKey: "soldPercent", header: () => "Sold %", cell: ({ row }) => (
    <div className="flex items-center space-x-2 w-40">
      <ColoredProgress value={row.original.soldPercent} positive={row.original.pnl.startsWith("+")} />
      <span className="text-xs text-gray-400 w-8 text-left">{row.original.positionSize}</span>
    </div>
  ) },
];

// --- Top Traders Columns ---
interface TopTrader {
  rank: number;
  wallet: string;
  balance: string;
  bought: string;
  sold: string;
  pnl: string;
  remaining: string;
  remainingPercent: number;
}
const topTradersColumns: ColumnDef<TopTrader>[] = [
  { accessorKey: "rank", header: () => "#" },
  { accessorKey: "wallet", header: () => "Wallet", cell: ({ row }) => (
    <Link href={`/profile/${row.original.wallet}`} className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">
      {row.original.wallet}
    </Link>
  ) },
  { accessorKey: "balance", header: () => "ETH Balance" },
  { accessorKey: "bought", header: () => "Bought (Avg Buy)" },
  { accessorKey: "sold", header: () => "Sold (Avg Sell)" },
  { accessorKey: "pnl", header: () => "PnL", cell: ({ row }) => <span className={row.original.pnl.startsWith("+") ? "text-green-400" : "text-red-400"}>{row.original.pnl}</span> },
  { accessorKey: "remainingPercent", header: () => "Remaining %", cell: ({ row }) => (
    <div className="flex items-center space-x-2 w-40">
      <span className="text-xs text-gray-400 w-8 text-right">{row.original.remaining}</span>
      <ColoredProgress value={row.original.remainingPercent} positive={row.original.pnl.startsWith("+")} />
      <span className="text-xs text-gray-400 w-8 text-left">{row.original.sold}</span>
    </div>
  ) },
];

// --- Mock Data ---
const mockSpotPositions: Position[] = [
  { id: 1, symbol: "ETH/USDT", type: "Long", size: "2.45 ETH", entry: "$2,400.00", current: "$2,450.00", pnl: "+$122.50", pnlPercent: "+2.08%" },
  { id: 2, symbol: "BTC/USDT", type: "Short", size: "0.15 BTC", entry: "$43,200.00", current: "$43,000.00", pnl: "+$30.00", pnlPercent: "+0.46%" },
  { id: 3, symbol: "UNI/USDT", type: "Long", size: "150 UNI", entry: "$6.50", current: "$7.85", pnl: "+$202.50", pnlPercent: "+20.77%" },
];
const mockCurveNames = ["Uniswap V3", "Curve.fi", "Balancer", "SushiSwap", "PancakeSwap"];
const mockCurvePositions = mockSpotPositions.map((p, i) => ({ ...p, type: "Curve", curve: mockCurveNames[i % mockCurveNames.length] }));

const mockHolders: Holder[] = Array.from({ length: 10 }, (_, i) => {
  const sold = Math.floor(Math.random() * 100);
  const holding = 100 - sold;
  const ens = fakeENSNames[Math.floor(Math.random() * fakeENSNames.length)] || `holder${i}.eth`;
  // Alternate positive/negative PnL for realism
  const isNegative = i % 3 === 0;
  return {
    id: i + 1,
    address: ens,
    holding: `${holding} ETH`,
    avgBuy: `$${(2000 + Math.random() * 1000).toFixed(2)}`,
    avgSold: `$${(2000 + Math.random() * 1000).toFixed(2)}`,
    positionSize: `${(Math.random() * 100).toFixed(2)} ETH`,
    ethBalance: `${(Math.random() * 100).toFixed(2)}`,
    pnl: (isNegative ? "-" : "+") + "$" + (Math.random() * 10000).toFixed(2),
    soldPercent: sold,
  };
});

const mockTopTraders: TopTrader[] = [
  { rank: 1, wallet: "BZh6x6...4MSk", balance: "431.7", bought: "$7.76K (683M / 1)", sold: "$62.2K (683M / 307)", pnl: "+$54.4K", remaining: "$2.1K (10%)", remainingPercent: 10 },
  { rank: 2, wallet: "4NHB6q...fAs7", balance: "100.4", bought: "$4.46K (56.6M / 3)", sold: "$11.9K (56.6M / 19)", pnl: "+$7.47K", remaining: "$0 (0%)", remainingPercent: 0 },
  { rank: 3, wallet: "5W99ZU...h317", balance: "100.3", bought: "$2.44K (47M / 1)", sold: "$7.68K (47M / 170)", pnl: "+$5.24K", remaining: "$1.2K (15%)", remainingPercent: 15 },
  { rank: 4, wallet: "3yXtHP...LyzR", balance: "49.99", bought: "$2.3K (7.68M / 58)", sold: "$7K (7.68M / 2)", pnl: "+$4.71K", remaining: "$0 (0%)", remainingPercent: 0 },
  { rank: 5, wallet: "6S4MnP...MzN9", balance: "42.02", bought: "$3.69K (11.4M / 82)", sold: "$7.25K (11.4M / 6)", pnl: "-$2.56K", remaining: "$0.5K (5%)", remainingPercent: 5 },
  { rank: 6, wallet: "48RwG8...gnDh", balance: "40.8", bought: "$3.6K (10.1M / 87)", sold: "$6.95K (10.1M / 2)", pnl: "-$1.35K", remaining: "$0 (0%)", remainingPercent: 0 },
  { rank: 7, wallet: "Fc76X5...6G3J", balance: "2.047", bought: "$432.03 (10.9M / 1)", sold: "$3.7K (10.9M / 3)", pnl: "+$3.27K", remaining: "$0.8K (20%)", remainingPercent: 20 },
];

export default function TradingData() {
  const [tab, setTab] = useState("trades");
  const [trades, setTrades] = useState<Trade[]>([]);
  const tradeId = useRef(1);

  // Helper to create a fake trade
  function createFakeTrade(id: number): Trade {
    const address = randomAddress();
    const type = randomType() as "buy" | "sell";
    let ens: string | undefined = undefined;
    if (Math.random() < 0.17) {
      ens = fakeENSNames[Math.floor(Math.random() * fakeENSNames.length)];
    }
    return {
      id,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 60 * 1000)), // up to 1 min ago
      marketCap: randomMarketCap(),
      amount: randomAmount(),
      address,
      type,
      price: randomPrice(),
      ens,
    };
  }

  useEffect(() => {
    // Prefill with 20 trades
    setTrades(Array.from({ length: 20 }, (_, i) => createFakeTrade(i + 1)).reverse());
    tradeId.current = 21;
  }, []);

  // Add a new fake trade every 1-3 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function addTrade() {
      const trade = createFakeTrade(tradeId.current++);
      setTrades((prev) => [trade, ...prev.slice(0, 49)]); // keep max 50
      timeout = setTimeout(addTrade, 1000 + Math.random() * 2000);
    }
    addTrade();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col flex-1">
      <Tabs value={tab} onValueChange={setTab} className="w-full flex flex-col flex-1 min-h-0">
        <TabsList className="grid w-full grid-cols-5 gap-1 text-xs h-9 bg-violet-500/30 backdrop-blur-lg shadow-2xl rounded-2xl text-white">
          <TabsTrigger value="trades" className="px-2 py-1 h-8 text-white hover:bg-violet-500/40 focus:bg-violet-500/50 rounded-xl transition-colors"> <TrendingUp className="h-3 w-3 mr-1" /> Trades </TabsTrigger>
          <TabsTrigger value="spot" className="px-2 py-1 h-8 text-white hover:bg-violet-500/40 focus:bg-violet-500/50 rounded-xl transition-colors"> <BarChart3 className="h-3 w-3 mr-1" /> Spot Positions </TabsTrigger>
          <TabsTrigger value="curve" className="px-2 py-1 h-8 text-white hover:bg-violet-500/40 focus:bg-violet-500/50 rounded-xl transition-colors"> <Wallet className="h-3 w-3 mr-1" /> Curve Positions </TabsTrigger>
          <TabsTrigger value="holders" className="px-2 py-1 h-8 text-white hover:bg-violet-500/40 focus:bg-violet-500/50 rounded-xl transition-colors"> <Users className="h-3 w-3 mr-1" /> Holders </TabsTrigger>
          <TabsTrigger value="traders" className="px-2 py-1 h-8 text-white hover:bg-violet-500/40 focus:bg-violet-500/50 rounded-xl transition-colors"> <Trophy className="h-3 w-3 mr-1" /> Top Traders </TabsTrigger>
        </TabsList>

        <TabsContent value="trades" className="mt-4 flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <DataTable columns={tradeColumns} data={trades} />
          </div>
        </TabsContent>
        <TabsContent value="spot" className="mt-4 flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <DataTable columns={spotColumns} data={mockSpotPositions} />
          </div>
        </TabsContent>
        <TabsContent value="curve" className="mt-4 flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <DataTable columns={curveColumns} data={mockCurvePositions} />
          </div>
        </TabsContent>
        <TabsContent value="holders" className="mt-4 flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <DataTable columns={holdersColumns} data={mockHolders} />
          </div>
        </TabsContent>
        <TabsContent value="traders" className="mt-4 flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <DataTable columns={topTradersColumns} data={mockTopTraders} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 