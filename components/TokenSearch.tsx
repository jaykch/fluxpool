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
          className="pl-10 pr-10 w-64 bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/40 focus:bg-white/20 transition-all duration-200 rounded-xl shadow-md"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
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
        <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto rounded-xl border border-white/20 bg-black/80 backdrop-blur shadow-2xl">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <div
                key={token.symbol}
                onClick={() => handleTokenSelect(token)}
                className="flex items-center justify-between px-4 py-3 hover:bg-violet-600/30 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center shadow">
                    <span className="text-white text-xs font-bold">{token.symbol[0]}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${token.price.toLocaleString()}</div>
                  <div className={`text-sm ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change >= 0 ? '+' : ''}{token.change}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-400 text-center">
              No tokens found
            </div>
          )}
        </div>
      )}
    </div>
  );
} 