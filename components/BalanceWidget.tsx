import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import DepositModal from './DepositModal';

export default function BalanceWidget() {
  const [balance] = useState(2.45);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 px-3 py-2 rounded-full border-gray-600 hover:bg-gray-800/50 bg-transparent"
          >
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Ξ</span>
            </div>
            <span className="text-sm font-medium text-white">
              {balance.toFixed(4)} ETH
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl text-white">
          <DropdownMenuItem className="flex items-center space-x-2">
            <Wallet className="mr-2 h-4 w-4" />
            <span>Balance: {balance.toFixed(4)} ETH</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10 dark:bg-black/30" />
          <DropdownMenuItem 
            className="flex items-center space-x-2"
            onClick={() => setIsDepositModalOpen(true)}
          >
            <ArrowDownLeft className="mr-2 h-4 w-4 text-green-400" />
            <span>Deposit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center space-x-2">
            <ArrowUpRight className="mr-2 h-4 w-4 text-red-400" />
            <span>Withdraw</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
    </>
  );
} 