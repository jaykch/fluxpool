import Portal from "../components/graphics/portal";
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import { Logo } from "@/components/logo";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function HomePage() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>FluxPool - Web3 Trading Platform</title>
        <meta name="description" content="Next-generation Web3 trading platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center space-y-6 bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl rounded-2xl p-10 border-0">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            Welcome to <Logo />
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-2xl">
            The social trading platform for Web3. Connect, share, and trade with friends.
          </p>
          <button
            onClick={login}
            className="px-8 py-3 bg-violet-500/30 hover:bg-violet-500/50 text-white font-semibold rounded-lg transition-colors shadow-lg backdrop-blur-md border-0"
          >
            Get Started
          </button>
        </div>
      </main>
    </>
  );
}
