import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpRight } from "lucide-react";

export default function TotalEarnings() {
  const totalEarnings = 1234.56; // Mock data

  const handleClaimFees = () => {
    // Handle claim fees logic here
    console.log('Claiming fees...');
  };

  return (
    <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          <span>Total Earnings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Available to Claim</span>
          <span className="text-white font-semibold text-lg">${totalEarnings.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">This Week</span>
          <span className="text-green-400">+$234.56</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">This Month</span>
          <span className="text-green-400">+$1,234.56</span>
        </div>

        <Button 
          onClick={handleClaimFees}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Claim Fees
        </Button>
      </CardContent>
    </Card>
  );
} 