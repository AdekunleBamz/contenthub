import { COMMUNITY_CONTENT_HUB_ABI } from './abi/CommunityContentHub';
import { CONTENT_NFT_ABI } from './abi/ContentNFT';

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
    uploadFee: '20000000000000', // 0.00002 ETH in wei
    mintFee: '20000000000000', // 0.00002 ETH in wei
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
    uploadFee: '20000000000000', // 0.00002 CELO in wei (same as Base)
    mintFee: '20000000000000', // 0.00002 CELO in wei (same as Base)
  },
} as const;

export const NETWORK_NAMES = {
  8453: 'Base',
  42220: 'Celo',
} as const;
