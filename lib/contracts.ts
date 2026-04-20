import { COMMUNITY_CONTENT_HUB_ABI } from './abi/CommunityContentHub';
import { CONTENT_NFT_ABI } from './abi/ContentNFT';

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
    uploadFee: CONTENT_FEE_WEI,
    mintFee: CONTENT_FEE_WEI,
  },
} as const;

/** Chain ID for Base mainnet. */
export const BASE_CHAIN_ID = 8453;

/** Chain ID for Celo mainnet. */
export const CELO_CHAIN_ID = 42220;

export const NETWORK_NAMES = {
  [BASE_CHAIN_ID]: 'Base',
  [CELO_CHAIN_ID]: 'Celo',
} as const;

/** Chain ID for Celo Alfajores (Sepolia) testnet. */
export const CELO_SEPOLIA_CHAIN_ID = 44787;

/** Returns the human-readable network name for a given chain ID, or 'Unknown'. */
export function getNetworkName(chainId: number): string {
  return (NETWORK_NAMES as Record<number, string>)[chainId] ?? 'Unknown';
}

/** Returns true when chainId is one of the supported networks. */
export function isSupportedChain(chainId: number): boolean {
  return chainId === BASE_CHAIN_ID || chainId === CELO_CHAIN_ID;
}
