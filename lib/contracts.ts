import { COMMUNITY_CONTENT_HUB_ABI } from './abi/CommunityContentHub';
import { CONTENT_NFT_ABI } from './abi/ContentNFT';
import { CONTENT_HUB_TREASURY_ABI } from './abi/ContentHubTreasury';

/** Upload and mint fee in wei (0.00002 ETH / CELO). */
export const CONTENT_FEE_WEI = '20000000000000';

export const CONTRACTS = {
  base: {
    communityContentHub: {
      address: '0x5AB61B0191e19c7c435E67550f90A0F2E48a3450' as `0x${string}`,
      abi: COMMUNITY_CONTENT_HUB_ABI,
    },
    contentNFT: {
      address: '0xeE5Dd28E440A5cb51587fDbcb29b4b367fe87334' as `0x${string}`,
      abi: CONTENT_NFT_ABI,
    },
    contentHubTreasury: {
      // Deploy ContentHubTreasury.sol manually, then replace null with the Base address.
      address: null as `0x${string}` | null,
      abi: CONTENT_HUB_TREASURY_ABI,
    },
    uploadFee: CONTENT_FEE_WEI,
    mintFee: CONTENT_FEE_WEI,
  },
  celo: {
    communityContentHub: {
      address: '0x0bac169738f89689F8932A3E2663F1874D7CB92d' as `0x${string}`,
      abi: COMMUNITY_CONTENT_HUB_ABI,
    },
    contentNFT: {
      address: '0x11E07A42989212622306A0F293829888fe004828' as `0x${string}`,
      abi: CONTENT_NFT_ABI,
    },
    contentHubTreasury: {
      address: '0x2ff169744a28fE867aa52f29E8eF5080b7f45061' as `0x${string}`,
      abi: CONTENT_HUB_TREASURY_ABI,
    },
    uploadFee: CONTENT_FEE_WEI,
    mintFee: CONTENT_FEE_WEI,
  },
} as const;

/** Chain ID for Base mainnet. */
export const BASE_CHAIN_ID = 8453;

/** Chain ID for Celo mainnet. */
export const CELO_CHAIN_ID = 42220;

/** Chain ID for Celo Alfajores (Sepolia) testnet. */
export const CELO_SEPOLIA_CHAIN_ID = 44787;

export const NETWORK_NAMES = {
  [BASE_CHAIN_ID]: 'Base',
  [CELO_CHAIN_ID]: 'Celo',
  [CELO_SEPOLIA_CHAIN_ID]: 'Celo Alfajores',
} as const;

/** Alias for CELO_SEPOLIA_CHAIN_ID kept for backwards compatibility. */
export const CELO_ALFAJORES_CHAIN_ID = CELO_SEPOLIA_CHAIN_ID;

/** Returns the human-readable network name for a given chain ID, or 'Unknown'. */
export function getNetworkName(chainId: number): string {
  return (NETWORK_NAMES as Record<number, string>)[chainId] ?? 'Unknown';
}

/** Returns true when chainId is one of the supported networks. */
export function isSupportedChain(chainId: number): boolean {
  return chainId === BASE_CHAIN_ID || chainId === CELO_CHAIN_ID;
}

/** Returns the CONTRACTS entry for the given chainId, or throws for unsupported chains. */
export function getContractsForChain(chainId: number) {
  if (chainId === BASE_CHAIN_ID) return CONTRACTS.base;
  if (chainId === CELO_CHAIN_ID) return CONTRACTS.celo;
  throw new Error(`Unsupported chain ID: ${chainId}`);
}

/** Returns the block explorer base URL for the given chain ID. */
export function getExplorerUrl(chainId: number): string {
  if (chainId === BASE_CHAIN_ID) return 'https://basescan.org';
  if (chainId === CELO_CHAIN_ID) return 'https://celoscan.io';
  if (chainId === CELO_SEPOLIA_CHAIN_ID) return 'https://alfajores.celoscan.io';
  return '';
}

/** Returns a link to a transaction on the appropriate block explorer. */
export function getTxExplorerUrl(chainId: number, txHash: string): string {
  return `${getExplorerUrl(chainId)}/tx/${txHash.trim()}`;
}

/** Returns a link to a contract address on the appropriate block explorer. */
export function getAddressExplorerUrl(chainId: number, address: string): string {
  return `${getExplorerUrl(chainId)}/address/${address.trim()}`;
}

/** Returns true when chainId is Base mainnet. */
export function isBaseChain(chainId: number): boolean {
  return chainId === BASE_CHAIN_ID;
}

/** Returns true when chainId is Celo mainnet. */
export function isCeloChain(chainId: number): boolean {
  return chainId === CELO_CHAIN_ID;
}

/** Returns true when chainId is a supported testnet. */
export function isTestnet(chainId: number): boolean {
  return chainId === CELO_SEPOLIA_CHAIN_ID;
}

/** Returns the CONTRACTS key for a supported chain ID, or null for unknown chains. */
export function getChainKey(chainId: number): keyof typeof CONTRACTS | null {
  if (chainId === BASE_CHAIN_ID) return 'base';
  if (chainId === CELO_CHAIN_ID) return 'celo';
  return null;
}

/** Returns true when a ContentHubTreasury address has been configured for the chain. */
export function isTreasuryConfigured(chain: keyof typeof CONTRACTS): boolean {
  return CONTRACTS[chain].contentHubTreasury.address !== null;
}

/** Returns the configured ContentHubTreasury address for a chain, or null if not deployed yet. */
export function getTreasuryAddress(chain: keyof typeof CONTRACTS): `0x${string}` | null {
  return CONTRACTS[chain].contentHubTreasury.address;
}

/** Upload and mint fee in ETH/CELO units (human-readable). */
export const CONTENT_FEE_DISPLAY = '0.00002';

/**
 * Returns true if the given chain key is supported by CONTRACTS.
 * @param key - Chain key to check.
 */
export function isSupportedChainKey(key: string): key is keyof typeof CONTRACTS {
  return key in CONTRACTS
}

/**
 * Returns the upload fee for a given chain as a bigint.
 * @param chain - Chain key ('base' | 'celo').
 */
export function getUploadFee(chain: keyof typeof CONTRACTS): bigint {
  return BigInt(CONTRACTS[chain].uploadFee)
}

/**
 * Returns true if the fee amount is at least the required upload fee.
 * @param fee - Provided fee as bigint (in wei).
 * @param chain - Chain key to look up the required fee.
 */
export function isValidUploadFee(fee: bigint, chain: keyof typeof CONTRACTS = 'celo'): boolean {
  return fee >= getUploadFee(chain)
}

/**
 * Returns the full contract addresses for both communityContentHub and contentNFT
 * for a given chain key.
 * @param chain - Chain key ('base' | 'celo').
 */
export function getContractAddresses(chain: keyof typeof CONTRACTS): {
  communityContentHub: `0x${string}`
  contentNFT: `0x${string}`
  contentHubTreasury: `0x${string}` | null
} {
  return {
    communityContentHub: CONTRACTS[chain].communityContentHub.address,
    contentNFT: CONTRACTS[chain].contentNFT.address,
    contentHubTreasury: CONTRACTS[chain].contentHubTreasury.address,
  }
}
