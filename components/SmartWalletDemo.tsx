import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SmartWalletDemo() {
  const { user } = usePrivy();
  const { client } = useSmartWallets();
  const smartWallet = user?.linkedAccounts?.find((a) => a.type === "smart_wallet");
  const [signing, setSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    if (!client) return;
    setSigning(true);
    setSignature(null);
    setSignError(null);
    try {
      const sig = await client.signMessage({ message: "Hello from FluxPool!" });
      setSignature(sig);
    } catch (err: any) {
      setSignError(err?.message || "Failed to sign message");
    } finally {
      setSigning(false);
    }
  };

  const handleSendTx = async () => {
    if (!client) return;
    setSending(true);
    setTxHash(null);
    setTxError(null);
    try {
      if (!smartWallet?.address) throw new Error("No smart wallet address");
      // Send 0 ETH to self as a demo
      const hash = await client.sendTransaction({
        to: smartWallet.address as `0x${string}`,
        value: 0n // 0 ETH
      });
      setTxHash(hash);
    } catch (err: any) {
      setTxError(err?.message || "Failed to send transaction");
    } finally {
      setSending(false);
    }
  };

  if (!client) {
    return <div className="text-gray-400 text-sm">Smart wallet client not ready.</div>;
  }

  return (
    <Card className="w-full max-w-xl shadow-md">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-200">Smart Wallet</span>
          {smartWallet ? (
            <Badge variant="default">Connected</Badge>
          ) : (
            <Badge variant="destructive">Not Connected</Badge>
          )}
        </div>
        <Separator className="my-2" />
        {smartWallet ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Address:</span>
              <span className="font-mono text-xs text-gray-200">{smartWallet.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Type:</span>
              <span className="text-xs text-gray-200">{smartWallet.type}</span>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={handleSignMessage} disabled={signing} variant="outline">
                {signing ? "Signing..." : "Sign Message"}
              </Button>
              <Button onClick={handleSendTx} disabled={sending} variant="outline">
                {sending ? "Sending..." : "Send Test Tx"}
              </Button>
            </div>
            {signature && (
              <div className="mt-2 text-xs text-green-400 break-all">Signature: {signature}</div>
            )}
            {signError && (
              <div className="mt-2 text-xs text-red-400">{signError}</div>
            )}
            {txHash && (
              <div className="mt-2 text-xs text-green-400 break-all">Tx Hash: {txHash}</div>
            )}
            {txError && (
              <div className="mt-2 text-xs text-red-400">{txError}</div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No smart wallet found for this user.</div>
        )}
      </CardContent>
    </Card>
  );
} 