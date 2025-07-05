import { ethers } from 'ethers';

// You can use a public provider or your own Infura/Alchemy key for production
const defaultProvider = new ethers.JsonRpcProvider('https://cloudflare-eth.com');

/**
 * Resolves an Ethereum address to its ENS name, or returns the address if no ENS is set.
 * Performs forward resolution verification per ENS best practices.
 * @param address The Ethereum address to resolve
 * @param provider Optional ethers.js provider (defaults to mainnet)
 */
export async function getENSorAddress(address: string, provider = defaultProvider): Promise<string> {
  try {
    const ens = await provider.lookupAddress(address);
    if (ens) {
      // Forward resolution: verify ENS resolves back to the address
      const resolved = await provider.resolveName(ens);
      if (resolved && resolved.toLowerCase() === address.toLowerCase()) {
        return ens;
      }
    }
    return address;
  } catch {
    return address;
  }
}

/**
 * Fetches a text record (e.g., avatar, twitter) for an ENS name.
 * @param ensName The ENS name (e.g., vitalik.eth)
 * @param key The text record key (e.g., 'avatar', 'com.twitter')
 * @param provider Optional ethers.js provider (defaults to mainnet)
 */
export async function getENSTextRecord(ensName: string, key: string, provider = defaultProvider): Promise<string | null> {
  try {
    const resolver = await provider.getResolver(ensName);
    if (!resolver) return null;
    const value = await resolver.getText(key);
    return value || null;
  } catch {
    return null;
  }
} 