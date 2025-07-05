import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import Link from "next/link";

export type Pool = {
  pool: string;
  token0: { symbol: string; address: string; decimals: number };
  token1: { symbol: string; address: string; decimals: number };
  fee: number;
  protocol: string;
  network_id: string;
  block_num: number;
  datetime: string;
  liquidity?: string;
  volumeUSD?: string;
  totalValueLockedUSD?: string;
  txCount?: string;
};

function formatNumber(num?: string | number) {
  if (!num) return '-';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '-';
  if (n > 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n > 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n > 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toLocaleString();
}

export const poolColumns: ColumnDef<Pool>[] = [
  {
    accessorKey: "tokenPair",
    header: () => "Token Pair",
    cell: ({ row }) => {
      const pool = row.original;
      const href = `/trade?pool=${pool.pool}&token0=${pool.token0.symbol}&token1=${pool.token1.symbol}`;
      return (
        <Link href={href} legacyBehavior>
          <a className="text-blue-400 font-medium underline underline-offset-2 hover:text-blue-300 transition-colors">
            {pool.token0.symbol} / {pool.token1.symbol}
          </a>
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "fee",
    header: () => "Fee",
    cell: ({ row }) => `${row.original.fee / 10000}%`,
    enableSorting: false,
  },
  {
    accessorKey: "pool",
    header: () => "Pool Address",
    cell: ({ row }) => (
      <span className="text-xs text-blue-400 font-mono">
        {row.original.pool.slice(0, 8)}...{row.original.pool.slice(-4)}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "block_num",
    header: () => "Block",
    cell: ({ row }) => row.original.block_num,
    enableSorting: false,
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Updated" />
    ),
    cell: ({ row }) => row.original.datetime,
    enableSorting: true,
  },
  {
    accessorKey: "protocol",
    header: () => "Protocol",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">{row.original.protocol}</Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "network_id",
    header: () => "Network",
    cell: ({ row }) => row.original.network_id,
    enableSorting: false,
  },
  // --- Subgraph Data Columns ---
  {
    accessorKey: "liquidity",
    header: () => "Liquidity",
    cell: ({ row }) => formatNumber(row.original.liquidity),
    enableSorting: false,
  },
  {
    accessorKey: "totalValueLockedUSD",
    header: () => "TVL (USD)",
    cell: ({ row }) => '$' + formatNumber(row.original.totalValueLockedUSD),
    enableSorting: false,
  },
  {
    accessorKey: "volumeUSD",
    header: () => "Volume (USD)",
    cell: ({ row }) => '$' + formatNumber(row.original.volumeUSD),
    enableSorting: false,
  },
  {
    accessorKey: "txCount",
    header: () => "Tx Count",
    cell: ({ row }) => formatNumber(row.original.txCount),
    enableSorting: false,
  },
]; 