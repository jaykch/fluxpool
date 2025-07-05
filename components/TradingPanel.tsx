import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowUpRight, ArrowDownLeft, BarChart3, Clock } from "lucide-react";
import { useState } from "react";
import PriceBins from './PriceBins';

// Reusable Order Component
function OrderComponent({ type }: { type: 'spot' | 'curve' }) {
  const [amount, setAmount] = useState('');
  const [liquidityRatio, setLiquidityRatio] = useState([50]);
  const currentPrice = 2450.50;

  const getIcon = () => {
    switch (type) {
      case 'spot': return <BarChart3 className="h-4 w-4 text-white" />;
      case 'curve': return <ArrowUpRight className="h-4 w-4 text-white" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'spot': return 'Spot Order';
      case 'curve': return 'Curve Order';
    }
  };

  const handlePercentageClick = (percentage: number) => {
    const balance = 2.45;
    const calculatedAmount = (balance * percentage) / 100;
    setAmount(calculatedAmount.toFixed(4));
  };

  return (
    <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          {getIcon()}
          <h4 className="text-sm font-medium text-white">{getTitle()}</h4>
        </div>
        {/* Liquidity Ratio Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300 text-sm">Liquidity Ratio</Label>
            <span className="text-white text-sm font-medium">{liquidityRatio[0]}%</span>
          </div>
          <Slider
            value={liquidityRatio}
            onValueChange={setLiquidityRatio}
            max={100}
            step={1}
            className="w-full"
            trackClassName="bg-white/20"
            rangeClassName="bg-violet-500/70"
            thumbClassName="border-violet-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        {/* Price Bins (only for curve) */}
        {type === 'curve' && <PriceBins symbol="ETH" />}
        <div className="space-y-3">
          <div>
            <Label htmlFor={`amount-${type}`} className="text-gray-300 text-sm">Amount (ETH)</Label>
            <Input
              id={`amount-${type}`}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-violet-500/30 border-violet-500/20 text-white backdrop-blur-md shadow-inner"
            />
            {/* Percentage Buttons */}
            <div className="flex mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs bg-violet-500/30 border-violet-500/20 text-white hover:bg-violet-500/40 hover:text-white rounded-none border-r-0 backdrop-blur-md shadow"
                onClick={() => handlePercentageClick(10)}
              >
                10%
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs bg-violet-500/30 border-violet-500/20 text-white hover:bg-violet-500/40 hover:text-white rounded-none border-r-0 backdrop-blur-md shadow"
                onClick={() => handlePercentageClick(33)}
              >
                33%
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs bg-violet-500/30 border-violet-500/20 text-white hover:bg-violet-500/40 hover:text-white rounded-none border-r-0 backdrop-blur-md shadow"
                onClick={() => handlePercentageClick(50)}
              >
                50%
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs bg-violet-500/30 border-violet-500/20 text-white hover:bg-violet-500/40 hover:text-white rounded-none backdrop-blur-md shadow"
                onClick={() => handlePercentageClick(100)}
              >
                100%
              </Button>
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Buy
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Sell
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Trading Panel Component
export default function TradingPanel() {
  const [tab, setTab] = useState<'spot' | 'curve'>('spot');
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Trading Panel</h3>
      <Tabs value={tab} onValueChange={v => setTab(v as 'spot' | 'curve')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
          <TabsTrigger value="spot">Spot</TabsTrigger>
          <TabsTrigger value="curve">Curve</TabsTrigger>
        </TabsList>
        <TabsContent value="spot" className="mt-4">
          <OrderComponent type="spot" />
        </TabsContent>
        <TabsContent value="curve" className="mt-4">
          <OrderComponent type="curve" />
        </TabsContent>
      </Tabs>
    </div>
  );
} 