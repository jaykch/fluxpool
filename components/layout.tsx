import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Navbar from "./navbar";
import { useRouter } from "next/router";

type Props = {
  children?: React.ReactNode;
  accountId: string;
  appName: string;
  onTokenSelect?: (token: any) => void; // Add this
};

export default function Layout({
  children,
  accountId,
  appName,
  onTokenSelect,
}: Props) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <>
      <Navbar 
        onTokenSelect={onTokenSelect}
      />
      <div className="w-full">{children}</div>
    </>
  );
}
