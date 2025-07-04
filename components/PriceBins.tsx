import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAssetPrice } from "@/lib/useAssetPrice";

interface PriceBinsProps {
  symbol?: string;
}

export default function PriceBins({ symbol = 'ETH' }: PriceBinsProps) {
  const [range, setRange] = useState([20, 80]); // Default range 20% to 80%
  const { price: currentPrice, loading, error } = useAssetPrice(symbol);

  // Generate 100 thin bars with more varied stable values using useMemo
  const bars = useMemo(() => {
    if (loading || error) {
      return Array.from({ length: 100 }, (_, i) => ({
        priceMultiplier: (i / 100) * 10,
        price: 0,
        liquidity: 0,
        height: 4,
        id: i
      }));
    }

    return Array.from({ length: 100 }, (_, i) => {
      const priceMultiplier = (i / 100) * 10; // 0 to 10x
      const price = currentPrice * priceMultiplier; // Convert to actual price
      
      // Create more varied stable random values based on index
      const seed1 = i * 12345; // Primary seed
      const seed2 = i * 67890; // Secondary seed for more variation
      const seed3 = i * 11111; // Tertiary seed for additional randomness
      
      // Multiple random generators for more variation
      const random1 = ((seed1 * 9301 + 49297) % 233280) / 233280;
      const random2 = ((seed2 * 1103515245 + 12345) % 2147483648) / 2147483648;
      const random3 = ((seed3 * 1664525 + 1013904223) % 4294967296) / 4294967296;
      
      // Combine random values for more natural distribution
      const combinedRandom = (random1 + random2 + random3) / 3;
      
      // Add some clustering effects (whale-like behavior)
      const clusterEffect = Math.sin(i * 0.3) * 0.2 + Math.cos(i * 0.7) * 0.15;
      const finalRandom = Math.max(0, Math.min(1, combinedRandom + clusterEffect));
      
      const liquidity = finalRandom * 100;
      const height = Math.max(4, liquidity * 0.4); // Thinner bars, max height 40px
      
      return {
        priceMultiplier,
        price,
        liquidity,
        height,
        id: i // Stable ID to prevent re-rendering
      };
    });
  }, [currentPrice, loading, error]); // Add currentPrice as dependency

  // Calculate which bars are in range
  const barsInRange = bars.map(bar => ({
    ...bar,
    isInRange: bar.priceMultiplier >= (range[0] / 10) && bar.priceMultiplier <= (range[1] / 10)
  }));

  // Calculate legend data
  const minPrice = (currentPrice * (range[0] / 10)).toFixed(2);
  const maxPrice = (currentPrice * (range[1] / 10)).toFixed(2);
  const binsInRange = barsInRange.filter(bar => bar.isInRange).length;
  const totalBins = barsInRange.length;

  if (loading) {
    return (
      <Card className="border-gray-700">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Price Range</h4>
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
          <div className="h-12 bg-gray-800 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-gray-700">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Price Range</h4>
            <span className="text-xs text-red-400">Error loading price</span>
          </div>
          <div className="h-12 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-gray-400 text-sm">Failed to load price data</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-700">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">Price Range</h4>
          <span className="text-xs text-gray-400">
            ${minPrice} - ${maxPrice}
          </span>
        </div>
        
        {/* Thin Bars */}
        <div className="flex items-end justify-between h-12 space-x-px">
          {barsInRange.map((bar) => (
            <div 
              key={bar.id} 
              className={`flex-1 rounded-sm transition-colors ${
                bar.isInRange 
                  ? 'bg-green-500' 
                  : 'bg-gray-600'
              }`}
              style={{ 
                height: `${bar.height}px`,
                minHeight: '4px'
              }}
            />
          ))}
        </div>
        
        {/* Double-sided Slider */}
        <div className="space-y-2">
          <Slider
            value={range}
            onValueChange={setRange}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>${(currentPrice * 0).toFixed(2)}</span>
            <span>${(currentPrice * 2.5).toFixed(2)}</span>
            <span>${(currentPrice * 5).toFixed(2)}</span>
            <span>${(currentPrice * 7.5).toFixed(2)}</span>
            <span>${(currentPrice * 10).toFixed(2)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <div className="text-gray-400">Min</div>
              <div className="text-white font-medium">${minPrice}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Max</div>
              <div className="text-white font-medium">${maxPrice}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Bins</div>
              <div className="text-white font-medium">{binsInRange}/{totalBins}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 