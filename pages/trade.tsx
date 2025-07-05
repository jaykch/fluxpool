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
import TotalEarnings from '../components/TotalEarnings';

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

  // Update the state initialization
  const [chartData, setChartData] = useState(generateSampleData('BTC', 730)); // 2 years of data
  // Add this state for the selected token
  const [selectedToken, setSelectedToken] = useState({ symbol: 'BTC/USDT', name: 'Bitcoin' });

  // Update the token selection handler
  const handleTokenSelect = (token: any) => {
    setSelectedToken({
      symbol: `${token.symbol}/USDT`,
      name: token.name
    });
    
    // Generate 2 years of historical data for the selected token
    const newData = generateSampleData(token.symbol, 730);
    setChartData(newData);
  };

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  // If query params are present, set the selected token and chart
  useEffect(() => {
    if (router.isReady) {
      const { token0, token1 } = router.query;
      const t0 = typeof token0 === 'string' ? token0 : '';
      const t1 = typeof token1 === 'string' ? token1 : '';
      if (t0 && t1) {
        const symbol = `${t0}/${t1}`;
        setSelectedToken({ symbol, name: `${t0}/${t1} Pool` });
        setChartData(generateSampleData(t0, 730));
      }
    }
  }, [router.isReady, router.query.token0, router.query.token1]);

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
      accountId={user?.id ? String(user.id) : ""} 
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
              <TradingData />
            </div>
            
            {/* Sidebar - 30% width */}
            <div className="w-[30%] border-l border-gray-700 p-4 space-y-4">
              {/* Trading Panel */}
              <TradingPanel />

              {/* Total Earnings */}
              <TotalEarnings />

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
