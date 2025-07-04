import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, ArrowDownLeft } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    // Simulate deposit process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onClose();
    setAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowDownLeft className="h-5 w-5 text-green-400" />
            <span>Deposit ETH</span>
          </DialogTitle>
          <DialogDescription>
            Enter the amount of ETH you want to deposit into your trading account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-12"
                step="0.0001"
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
              <span className="font-medium">2.45 ETH</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ArrowDownLeft className="h-4 w-4" />
                <span>Deposit</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 