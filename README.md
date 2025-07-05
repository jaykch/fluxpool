# Fluxpool

Fluxpool is a next-generation Web3 social crypto trading platform, combining real-time trading, social feeds, transparent performance stats, and gamification in a beautiful, responsive interface.

## What is Fluxpool?

Fluxpool is a social trading platform built with Next.js and shadcn/ui. It leverages Privy for authentication, wallet abstraction, and MoonPay-powered fiat onramps, making it easy for anyone to onboard and fund their account using Apple Pay, Google Pay, or cards. Every user gets a unique ENS subname (like `username.fluxpool.eth`) as their onchain identity, which is used for tagging, social features, and connecting with other dApps.

The app fetches new token launches and trending data using The Graph’s Token API, and uses the Uniswap subgraph for historical and trading data. The platform brings together real-time trading, a social feed, transparent stats, and gamification in a seamless, modern web experience.

## Key Features

- **Privy Authentication & Wallets**: Simple login, wallet abstraction, and embedded wallets for all users.
- **Fiat Onramps**: Fund your account instantly with Apple Pay, Google Pay, or cards via MoonPay integration.
- **ENS Subnames**: Every user gets a unique ENS subname (e.g., `trader.fluxpool.eth`) for onchain identity and social features.
- **Social Feed**: Post, comment, and interact with other traders in a real-time, glassy social feed.
- **Live Trading & Analytics**: Trade tokens, view trending launches, and analyze pools with data from The Graph Token API and Uniswap subgraph.
- **Gamification**: Transparent performance stats, leaderboards, and social badges.
- **Modern UI/UX**: Built with Next.js, TypeScript, Tailwind, and shadcn/ui for a beautiful, responsive experience.

## Tech Stack

- **Next.js** (React, SSR, API routes)
- **TypeScript**
- **Tailwind CSS** & **shadcn/ui** (modern UI components)
- **Privy** (authentication, wallet abstraction, onramps)
- **MoonPay** (fiat onramps via Privy)
- **The Graph Token API** (token launches, trending data)
- **Uniswap Subgraph** (historical and trading data)
- **ENS** (subnames for user identity)

## Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/fluxpool.git
   cd fluxpool
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Privy, The Graph, and other API keys.
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

## License

MIT
