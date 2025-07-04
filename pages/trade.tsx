import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import WalletList from "../components/WalletList";
import Layout from "@/components/layout";
import TradingChart from '../components/TradingChart';
import { generateSampleData } from '../lib/chartData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}

export default function DashboardPage() {
  const [verifyResult, setVerifyResult] = useState();
  const router = useRouter();
  const {
    ready,
    authenticated,
    user,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  const [chartData, setChartData] = useState(generateSampleData());
  // Add this state for the selected token
  const [selectedToken, setSelectedToken] = useState({ symbol: 'BTC/USDT', name: 'Bitcoin' });

  // Add this function to handle token selection
  const handleTokenSelect = (token: any) => {
    setSelectedToken({
      symbol: `${token.symbol}/USDT`,
      name: token.name
    });
    
    // Generate new sample data for the selected token
    const newData = generateSampleData();
    setChartData(newData);
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  const googleSubject = user?.google?.subject || null;
  const twitterSubject = user?.twitter?.subject || null;
  const discordSubject = user?.discord?.subject || null;

  return (
    <Layout 
      accountId={user?.id ?? ""} 
      appName="Trade Now" 
      navbarItems={[]}
      onTokenSelect={handleTokenSelect}
    >
      <main className="flex flex-col min-h-screen">
        {ready && authenticated ? (
          <div className="flex flex-1">
            {/* Main Chart Area - 70% width */}
            <div className="w-[70%]">
              <TradingChart 
                symbol={selectedToken.symbol}
                data={chartData}
                height={600}
                width={800}
              />
            </div>
            
            {/* Sidebar - 30% width */}
            <div className="w-[30%] border-l border-gray-700 p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Trading Panel</h3>
                
                {/* Placeholder for future buttons */}
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Buy/Sell</h4>
                    <p className="text-xs text-gray-500">Trading buttons will go here</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Order Book</h4>
                    <p className="text-xs text-gray-500">Order book will go here</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Trades</h4>
                    <p className="text-xs text-gray-500">Recent trades will go here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
