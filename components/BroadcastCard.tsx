import MiniChart from "@/components/MiniChart";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

export default function BroadcastCard({ pos, username, timeAgo, message }: {
  pos: any;
  username: string;
  timeAgo: string;
  message?: string;
}) {
  // Mock likes/comments
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [showComments, setShowComments] = useState(false);
  const mockComments = [
    { user: "ape4life", text: "Nice trade! 🔥" },
    { user: "diamondhandz", text: "I was watching this too!" },
    { user: "bulltrapper", text: "Legendary entry." },
  ];
  const commentCount = mockComments.length;
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };
  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-row items-stretch bg-white/5 border border-white/10 rounded-2xl p-0 overflow-hidden shrink-0">
        {/* Left: Info box (50%) */}
        <div className="w-1/2 flex flex-col pl-2 pr-6 py-6 min-w-0">
          <div className="flex flex-row items-start gap-3">
            {/* ENS avatar above coin avatar, stacked in a column */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`}
                alt={username}
                className="w-8 h-8 rounded-full border-2 border-white bg-white"
              />
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                {typeof pos.avatar === 'function'
                  ? pos.avatar()
                  : <img src={pos.avatar} alt={pos.symbol} className="w-6 h-6 object-contain" />
                }
              </div>
            </div>
            {/* Name, time, token badge, long/short badge */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex flex-row flex-wrap items-center gap-2">
                <Link
                  href={`/profile/${username}`}
                  className="font-semibold text-white text-base truncate max-w-[120px] hover:underline focus:underline outline-none"
                >
                  {username}
                </Link>
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
              <div className="text-gray-200 text-sm mt-2 break-words">
                {message ? message : (pos.side === 'Long' ? `Longed ${pos.symbol} for a breakout. 🚀` : `Shorted ${pos.symbol} for a quick scalp. 🔻`)}
              </div>
              {/* Likes & Comments actions below message */}
              <div className="flex flex-row items-baseline gap-4 mt-2">
                <button
                  className={`flex items-center gap-1 text-sm font-semibold transition hover:text-pink-400 ${liked ? 'text-pink-400' : 'text-gray-300'}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-pink-400' : 'fill-transparent'}`} />
                  {likes}
                </button>
                <button
                  className="flex items-center gap-1 text-sm font-semibold text-gray-300 hover:text-blue-400 transition"
                  onClick={() => setShowComments((v) => !v)}
                >
                  <MessageCircle className="h-4 w-4" />
                  {commentCount}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Right: Chart (50%) */}
        <div className="w-1/2 flex items-center justify-center h-44 bg-white/10 min-w-0">
          <MiniChart symbol={pos.symbol as string} side={pos.side as 'Long' | 'Short'} entry={pos.entry as number} current={pos.current as number} />
        </div>
      </div>
      {/* Comments Section */}
      {showComments && (
        <div className="px-6 pb-4 pt-2 flex flex-col gap-2 animate-fade-in">
          {mockComments.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${c.user}`} alt={c.user} className="w-6 h-6 rounded-full border border-white/20" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">{c.user}</span>
                <span className="text-xs text-gray-300">{c.text}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 