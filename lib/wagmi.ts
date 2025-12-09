import { http, createConfig } from 'wagmi';
import { base, celo } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect, injected } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '8b50179539f8beea2f4a0c070d058d77';

export const config = createConfig({
  chains: [base, celo],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: 'ContentHub' }),
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
    [celo.id]: http(),
  },
  ssr: true,
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
