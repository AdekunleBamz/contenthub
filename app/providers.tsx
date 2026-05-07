'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { useEffect, useState } from 'react';
import { base } from 'wagmi/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    // Fire-and-forget: signal Farcaster Mini App context if applicable.
    // Deliberately NOT blocking rendering on this — in MiniPay it is irrelevant
    // and awaiting it caused a stuck loading screen.
    (async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk');
        const isInMiniApp = await sdk.isInMiniApp();
        if (isInMiniApp) {
          await sdk.actions.ready();
        }
      } catch {
        // Not in a Farcaster context — safe to ignore.
      }
    })();
  }, []);

  // RainbowKitProvider is always rendered — it is a context-only provider
  // (no visible UI by itself) so it is safe inside MiniPay's WebView.
  // Conditionally removing it (old approach) caused a race-condition crash
  // because page components using ConnectButton lost their context.
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()} initialChain={base}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
