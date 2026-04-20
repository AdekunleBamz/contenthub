import { http, createConfig } from 'wagmi';
import { base, celo, celoSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect, injected } from 'wagmi/connectors';

/** Application name shown in wallet connection dialogs. */
const CONTENTHUB_APP_NAME = 'ContentHub';

/** Fallback WalletConnect project ID used when the env variable is absent. */
const WC_DEFAULT_PROJECT_ID = '8b50179539f8beea2f4a0c070d058d77';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || WC_DEFAULT_PROJECT_ID;

export const config = createConfig({
  chains: [base, celo, celoSepolia],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: CONTENTHUB_APP_NAME }),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
    [celoSepolia.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

/** Supported chain IDs in this wagmi config. */
export const SUPPORTED_CHAIN_IDS = [base.id, celo.id, celoSepolia.id] as const;

/** Returns true when chainId is one of the configured wagmi chains. */
export function isSupportedChainId(chainId: number): boolean {
  return (SUPPORTED_CHAIN_IDS as readonly number[]).includes(chainId);
}
