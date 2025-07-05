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
import { Wallet, ArrowDownLeft, Apple, CreditCard, BadgeDollarSign } from "lucide-react";
import { useFundWallet, usePrivy } from '@privy-io/react-auth';
import { mainnet } from 'viem/chains';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  // Remove custom isLoading, rely on Privy modal
  const { user } = usePrivy();
  const { fundWallet } = useFundWallet();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    // setIsLoading(true); // This line is removed as per the edit hint
    // Simulate deposit process
    await new Promise(resolve => setTimeout(resolve, 2000));
    // setIsLoading(false); // This line is removed as per the edit hint
    handleClose();
  };

  const handleClose = () => {
    setAmount('');
    // setIsLoading(false); // This line is removed as per the edit hint
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                className="pr-10 h-8 rounded-md bg-purple-500/20 backdrop-blur-md border border-purple-400/40 shadow-sm text-sm text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                step="0.0001"
                min="0"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 bg-purple-500/70 backdrop-blur-md rounded-full flex items-center justify-center shadow">
                  <span className="text-white text-xs font-bold">Ξ</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-500/20 backdrop-blur-md border border-purple-400/40 rounded-md px-3 py-2 shadow-sm flex items-center justify-between text-xs text-white mb-1">
            <span className="opacity-80">Available:</span>
            <span className="font-semibold">2.45 ETH</span>
          </div>

          {/* Card/Apple Pay/Google Pay Option via Privy */}
          <div className="flex flex-col items-center pt-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium shadow-sm border border-gray-600 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={async () => {
                if (!user?.wallet?.address || !amount || parseFloat(amount) <= 0) return;
                try {
                  await fundWallet(user.wallet.address, {
                    chain: mainnet, // Ethereum mainnet
                    amount: amount.toString(),
                  });
                  handleClose();
                } catch (e) {
                  const msg = e instanceof Error ? e.message : String(e);
                  alert('Funding failed: ' + msg);
                }
              }}
              disabled={!user?.wallet?.address || !amount || parseFloat(amount) <= 0}
            >
              <Apple className="h-4 w-4 mr-1" />
              <CreditCard className="h-4 w-4 mr-1" />
              <span>Fund with Card / Apple Pay / Google Pay</span>
            </button>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="rounded-md px-4 py-2 text-sm font-medium bg-white/10 border border-gray-500/30 text-white backdrop-blur-md shadow-sm hover:bg-white/20 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="rounded-md px-4 py-2 text-sm font-semibold bg-gradient-to-br from-purple-500/60 via-purple-600/60 to-fuchsia-500/60 text-white border border-purple-400/40 shadow-lg backdrop-blur-md hover:from-purple-500/80 hover:to-fuchsia-500/80 hover:scale-[1.03] active:scale-100 transition-all flex items-center gap-2"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Deposit</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 