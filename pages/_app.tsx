import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import React from "react";

function AuthRedirector() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  // Track previous authentication state
  const [wasAuthenticated, setWasAuthenticated] = React.useState(false);
  useEffect(() => {
    // Only redirect to /home if coming from the landing page or a public route
    if (ready && authenticated && (router.pathname === "/")) {
      router.replace("/home");
    }
    setWasAuthenticated(authenticated);
  }, [ready, authenticated, router]);
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>FluxPool</title>
        <meta name="description" content="FluxPool - Modern Web3 Trading Platform" />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
        }}
      >
        <AuthRedirector />
        <Component {...pageProps} />
      </PrivyProvider>
    </>
  );
}

export default MyApp;
