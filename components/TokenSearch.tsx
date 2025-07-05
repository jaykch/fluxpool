import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter } from 'next/router';

// Mock token data
const mockTokens = [
  { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change: -1.23 },
  // { symbol: 'SOL', name: 'Solana', price: 98.45, change: 5.67 },
  { symbol: 'ADA', name: 'Cardano', price: 0.52, change: -0.89 },
  { symbol: 'DOT', name: 'Polkadot', price: 7.23, change: 3.45 },
  { symbol: 'LINK', name: 'Chainlink', price: 15.67, change: -2.12 },
  { symbol: 'UNI', name: 'Uniswap', price: 8.90, change: 1.78 },
  { symbol: 'AVAX', name: 'Avalanche', price: 35.20, change: 4.56 },
  { symbol: 'MATIC', name: 'Polygon', price: 0.85, change: -1.34 },
  { symbol: 'ATOM', name: 'Cosmos', price: 9.45, change: 2.89 },
];

interface TokenSearchProps {
  onTokenSelect?: (token: any) => void;
}

// Token SVG icons (copied from home.tsx)
function EthereumLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
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
function SolanaLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
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
function BitcoinLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
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
function UniswapLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
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
function AdaLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#0033AD" />
      <g fill="#fff">
        <circle cx="16" cy="16" r="4" />
        <circle cx="16" cy="8" r="1.2" />
        <circle cx="16" cy="24" r="1.2" />
        <circle cx="8" cy="16" r="1.2" />
        <circle cx="24" cy="16" r="1.2" />
        <circle cx="11" cy="11" r="0.8" />
        <circle cx="21" cy="11" r="0.8" />
        <circle cx="11" cy="21" r="0.8" />
        <circle cx="21" cy="21" r="0.8" />
      </g>
    </svg>
  );
}
function AvaxLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#E84142" />
      <g>
        <path d="M13.5 21.5L16 17l2.5 4.5c.5.9-.1 2-1.1 2h-2.8c-1 0-1.6-1.1-1.1-2z" fill="#fff" />
        <path d="M16 7l5.5 9.5c.5.9-.1 2-1.1 2h-8.8c-1 0-1.6-1.1-1.1-2L16 7z" fill="#fff" />
      </g>
    </svg>
  );
}
function LinkLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#375BD2" />
      <g>
        <rect x="10" y="10" width="12" height="12" rx="3" fill="#fff" />
        <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#375BD2" />
      </g>
    </svg>
  );
}
function MaticLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#8247E5" />
      <g>
        <rect x="10" y="14" width="4" height="4" rx="1" fill="#fff" />
        <rect x="18" y="14" width="4" height="4" rx="1" fill="#fff" />
        <rect x="14" y="10" width="4" height="4" rx="1" fill="#fff" />
        <rect x="14" y="18" width="4" height="4" rx="1" fill="#fff" />
      </g>
    </svg>
  );
}
function DotLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#E6007A" />
      <g>
        <circle cx="16" cy="16" r="6" fill="#fff" />
        <circle cx="16" cy="16" r="2" fill="#E6007A" />
      </g>
    </svg>
  );
}
function AtomLogoSVG({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#2E3148" />
      <g>
        <ellipse cx="16" cy="16" rx="7" ry="2.5" fill="#fff" fillOpacity=".7" />
        <ellipse cx="16" cy="16" rx="2.5" ry="7" fill="#fff" fillOpacity=".7" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="2.5" ry="7" fill="#fff" fillOpacity=".7" transform="rotate(120 16 16)" />
        <circle cx="16" cy="16" r="1.5" fill="#2E3148" />
      </g>
    </svg>
  );
}

const tokenIcons: Record<string, (props: { className?: string }) => JSX.Element> = {
  ETH: (props) => <EthereumLogoSVG {...props} />, // Use SVG for ETH
  SOL: (props) => <SolanaLogoSVG {...props} />, // Use SVG for SOL
  BTC: (props) => <BitcoinLogoSVG {...props} />, // Use SVG for BTC
  UNI: (props) => <UniswapLogoSVG {...props} />, // Use SVG for UNI
  ADA: (props) => <AdaLogoSVG {...props} />, // Cardano
  AVAX: (props) => <AvaxLogoSVG {...props} />, // Avalanche
  LINK: (props) => <LinkLogoSVG {...props} />, // Chainlink
  MATIC: (props) => <MaticLogoSVG {...props} />, // Polygon
  DOT: (props) => <DotLogoSVG {...props} />, // Polkadot
  ATOM: (props) => <AtomLogoSVG {...props} />, // Cosmos
};

function DefaultTokenIcon({ className = "w-5 h-5" }: { className?: string }) {
  return <div className={className + " bg-gray-700 rounded-full flex items-center justify-center"}><span className="text-white text-xs font-bold">?</span></div>;
}

export default function TokenSearch({ onTokenSelect }: TokenSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTokens, setFilteredTokens] = useState(mockTokens);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = mockTokens.filter(token =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchTerm]);

  const handleTokenSelect = (token: any) => {
    setSearchTerm(token.symbol);
    setIsOpen(false);
    if (onTokenSelect) {
      onTokenSelect(token);
    }
    // Route to /trade?token=SYMBOL
    router.push(`/trade?token=${encodeURIComponent(token.symbol)}`);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-8 w-80 h-9 text-sm bg-white/10 dark:bg-black/20 backdrop-blur-lg border-0 text-white placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 focus:bg-white/20 transition-all duration-200 rounded-2xl shadow-2xl"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-white"
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <div
                key={token.symbol}
                onClick={() => handleTokenSelect(token)}
                className="flex items-center justify-between px-3 py-2 hover:bg-violet-600/20 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shadow bg-white/10">
                    {(() => {
                      const Icon = tokenIcons[token.symbol];
                      return Icon ? <Icon className="w-5 h-5" /> : <DefaultTokenIcon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{token.symbol}</div>
                    <div className="text-gray-400 text-xs">{token.name}</div>
                  </div>
                </div>
                <div className="text-right min-w-[70px]">
                  <div className="text-white font-medium text-xs">${token.price.toLocaleString()}</div>
                  <div className={`text-xs ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}> 
                    {token.change >= 0 ? '+' : ''}{token.change}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-center text-sm">
              No tokens found
            </div>
          )}
        </div>
      )}
    </div>
  );
} 