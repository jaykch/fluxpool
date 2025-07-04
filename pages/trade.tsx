import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import WalletList from "../components/WalletList";
import Layout from "@/components/layout";
import TradingChart from '../components/TradingChart';
import { generateSampleData } from '../lib/chartData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TradingData from '../components/TradingData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Wallet, BarChart3, Trophy } from "lucide-react";
import TokenInfo from '../components/TokenInfo';
import TradingPanel from '../components/TradingPanel';

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
            <div className="w-[70%] flex flex-col">
              <TradingChart 
                symbol={selectedToken.symbol}
                data={chartData}
                height={600}
              />
              
              {/* Trading Data Tabs */}
              <div className="p-4">
                <TradingData />
              </div>
            </div>
            
            {/* Sidebar - 30% width */}
            <div className="w-[30%] border-l border-gray-700 p-4 space-y-4">
              {/* Trading Panel */}
              <TradingPanel />

              {/* Token Info Section */}
              <TokenInfo 
                symbol={selectedToken.symbol.split('/')[0]} 
                name={selectedToken.name}
              />
            </div>
          </div>
        ) : null}
      </main>
    </Layout>
  );
}
