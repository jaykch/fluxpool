import { useState } from 'react';
import Layout from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Head from 'next/head';

const mockENS = 'myaccount.eth';
const mockAddress = '0x1234...abcd';
const mockProfile = {
  avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=myaccount.eth`,
  twitter: '@myaccount',
  description: 'This is your FluxPool account profile. You can manage your smart wallet and see your ENS info here.',
  website: 'https://fluxpool.xyz',
  email: 'me@fluxpool.xyz',
  location: 'Internet',
  github: 'myaccount',
  telegram: '@myaccount',
};

export default function AccountPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleGenerateWallet = () => {
    setLoading(true);
    setTimeout(() => {
      setWallet('0xFAKE1234...WALLET');
      setLoading(false);
    }, 1200);
  };
  return (
    <Layout accountId={mockENS} appName="My Account" navbarItems={[]}> 
      <Head>
        <title>My Account | FluxPool</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-6 p-8">
            <Avatar className="w-24 h-24">
              <AvatarImage src={mockProfile.avatar} alt={mockENS} />
              <AvatarFallback>{mockENS.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-2xl font-bold">{mockENS}</span>
              <Badge variant="secondary" className="text-xs">{mockAddress}</Badge>
            </div>
            <Separator className="my-2" />
            <div className="w-full space-y-2">
              <ProfileField label="Description" value={mockProfile.description} />
              <ProfileField label="Twitter" value={mockProfile.twitter} />
              <ProfileField label="Website" value={mockProfile.website} />
              <ProfileField label="Email" value={mockProfile.email} />
              <ProfileField label="Location" value={mockProfile.location} />
              <ProfileField label="GitHub" value={mockProfile.github} />
              <ProfileField label="Telegram" value={mockProfile.telegram} />
            </div>
            <Separator className="my-2" />
            <Button onClick={handleGenerateWallet} disabled={loading || !!wallet} className="w-full">
              {wallet ? 'Wallet Generated' : loading ? 'Generating...' : 'Generate Privy Smart Wallet'}
            </Button>
            {wallet && (
              <div className="w-full text-center mt-2">
                <span className="text-green-500 font-mono text-sm">{wallet}</span>
                <div className="text-xs text-muted-foreground mt-1">(Mock wallet address)</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
} 