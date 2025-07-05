import MiniChart from "@/components/MiniChart";

export default function BroadcastCard({ pos, username, timeAgo }: {
  pos: any;
  username: string;
  timeAgo: string;
}) {
  return (
    <div className="flex flex-row items-stretch bg-white/5 border border-white/10 rounded-2xl p-0 overflow-hidden">
      {/* Left: Info box (50%) */}
      <div className="w-1/2 flex flex-col p-6 min-w-0">
        <div className="flex flex-row items-start gap-3">
          {/* Token logo top left */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
            {typeof pos.avatar === 'function'
              ? pos.avatar()
              : <img src={pos.avatar} alt={pos.symbol} className="w-6 h-6 object-contain" />
            }
          </div>
          {/* Name, time, token badge, long/short badge */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-row flex-wrap items-center gap-2">
              <span className="font-semibold text-white text-base truncate max-w-[120px]">{username}</span>
              <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-200 font-mono whitespace-nowrap">{pos.symbol}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${pos.side === 'Long' ? 'bg-green-700/60 text-green-300' : 'bg-red-700/80 text-red-300'}`}>{pos.side}</span>
            </div>
            {/* Entry, current, pnl, broadcast text below */}
            <div className="flex flex-row flex-wrap gap-6 mt-2">
              <div className="flex flex-col gap-0.5 min-w-[90px]">
                <span className="text-xs text-gray-400">Entry: <span className="text-gray-200 font-mono">${pos.entry.toFixed(2)}</span></span>
                <span className="text-xs text-gray-400">Current: <span className="text-gray-200 font-mono">${pos.current.toFixed(2)}</span></span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-[90px]">
                <span className={`text-xs font-bold ${pos.pnl().startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>PnL: {pos.pnl()}</span>
                <span className={`text-xs font-bold ${pos.pnl().startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>({pos.pnlPercent()})</span>
              </div>
            </div>
            <div className="text-gray-200 text-sm mt-2 break-words">{pos.side === 'Long' ? `Longed ${pos.symbol} for a breakout. 🚀` : `Shorted ${pos.symbol} for a quick scalp. 🔻`}</div>
          </div>
        </div>
      </div>
      {/* Right: Chart (50%) */}
      <div className="w-1/2 flex items-center justify-center h-44 bg-white/10 min-w-0">
        <MiniChart symbol={pos.symbol as string} side={pos.side as 'Long' | 'Short'} entry={pos.entry as number} current={pos.current as number} />
      </div>
    </div>
  );
} 