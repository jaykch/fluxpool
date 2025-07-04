import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ArrowUpRight, ArrowDownLeft, BarChart3, Clock } from "lucide-react";
import { useState } from "react";

// Reusable Order Component
function OrderComponent({ type }: { type: 'spot' | 'curve' | 'limit' }) {
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [liquidityRatio, setLiquidityRatio] = useState([50]);

  const getIcon = () => {
    switch (type) {
      case 'spot': return <BarChart3 className="h-4 w-4 text-white" />;
      case 'curve': return <ArrowUpRight className="h-4 w-4 text-white" />;
      case 'limit': return <Clock className="h-4 w-4 text-white" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'spot': return 'Spot Order';
      case 'curve': return 'Curve Order';
      case 'limit': return 'Limit Order';
    }
  };

  return (
    <Card className="border-gray-700">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          {getIcon()}
          <h4 className="text-sm font-medium text-white">{getTitle()}</h4>
        </div>

        {/* Liquidity Ratio Slider - Moved to top */}
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
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`amount-${type}`} className="text-gray-300 text-sm">Amount (ETH)</Label>
            <Input
              id={`amount-${type}`}
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {type !== 'spot' && (
            <div>
              <Label htmlFor={`price-${type}`} className="text-gray-300 text-sm">Price (USDT)</Label>
              <Input
                id={`price-${type}`}
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          )}

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
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Trading Panel</h3>
      
      <Tabs defaultValue="preset1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preset1">Preset 1</TabsTrigger>
          <TabsTrigger value="preset2">Preset 2</TabsTrigger>
          <TabsTrigger value="preset3">Preset 3</TabsTrigger>
        </TabsList>

        <TabsContent value="preset1" className="mt-4">
          <Tabs defaultValue="spot" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spot">Spot</TabsTrigger>
              <TabsTrigger value="curve">Curve</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>

            <TabsContent value="spot" className="mt-4">
              <OrderComponent type="spot" />
            </TabsContent>

            <TabsContent value="curve" className="mt-4">
              <OrderComponent type="curve" />
            </TabsContent>

            <TabsContent value="limit" className="mt-4">
              <OrderComponent type="limit" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="preset2" className="mt-4">
          <Tabs defaultValue="spot" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spot">Spot</TabsTrigger>
              <TabsTrigger value="curve">Curve</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>

            <TabsContent value="spot" className="mt-4">
              <OrderComponent type="spot" />
            </TabsContent>

            <TabsContent value="curve" className="mt-4">
              <OrderComponent type="curve" />
            </TabsContent>

            <TabsContent value="limit" className="mt-4">
              <OrderComponent type="limit" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="preset3" className="mt-4">
          <Tabs defaultValue="spot" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spot">Spot</TabsTrigger>
              <TabsTrigger value="curve">Curve</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>

            <TabsContent value="spot" className="mt-4">
              <OrderComponent type="spot" />
            </TabsContent>

            <TabsContent value="curve" className="mt-4">
              <OrderComponent type="curve" />
            </TabsContent>

            <TabsContent value="limit" className="mt-4">
              <OrderComponent type="limit" />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
} 