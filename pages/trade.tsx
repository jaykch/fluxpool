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
      {/* Uniswap Pools Preview Section */}
      <div className="w-full mt-8 flex justify-center">
        <UniswapPoolsPreview />
      </div>
    </Layout>
  );
}

// --- UniswapPoolsPreview Component ---
// Removed graphql-request; using fetch to our own API route

type Pool = {
  pool: string;
  token0: { symbol: string; address: string; decimals: number };
  token1: { symbol: string; address: string; decimals: number };
  fee: number;
  protocol: string;
  network_id: string;
};

function UniswapPoolsPreview() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);

  const fetchPools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/uniswap-pools');
      const data = await response.json();
      setRawResponse(data); // Save the raw response for debugging
      if (Array.isArray(data.data)) {
        setPools(data.data.slice(0, 5));
      } else {
        setPools([]);
        setError(data); // Set the whole object as error
      }
      if (data.error) setError(data.error);
    } catch (err: any) {
      setError(err.message || 'Error fetching pools');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4 text-white">Top Uniswap V3 Pools (Token API)</h2>
      <button
        onClick={fetchPools}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch Pools'}
      </button>
      {rawResponse && (
        <pre className="bg-gray-800 text-gray-200 text-xs p-2 rounded mb-4 overflow-x-auto max-h-64">
          {JSON.stringify(rawResponse, null, 2)}
        </pre>
      )}
      {loading && <div className="text-gray-400">Loading...</div>}
      {error && (
        <div className="text-red-500">
          {typeof error === 'string'
            ? error
            : JSON.stringify(error)}
        </div>
      )}
      
      {!loading && !error && pools.length === 0 && (
        <div className="text-gray-400">No pools to display.</div>
      )}
    </div>
  );
}
