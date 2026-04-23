'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { base, celo } from 'wagmi/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    // Poll every 250ms for up to 5s — MiniPay injects window.ethereum asynchronously.
    let attempts = 0;
    const pollTimer = setInterval(() => {
      attempts++;
      if (typeof window !== 'undefined' && (window.ethereum as any)?.isMiniPay) {
        clearInterval(pollTimer);
        setIsMiniPay(true);
      } else if (attempts >= 20) {
        clearInterval(pollTimer);
      }
    }, 250);

    const load = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        if (isInMiniApp) {
          await sdk.actions.ready();
        }
      } catch (error) {
        console.log('Not in Farcaster Mini App context:', error);
      } finally {
        setIsSDKLoaded(true);
      }
    };
    load();

    return () => clearInterval(pollTimer);
  }, []);

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading ContentHub...</div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Skip RainbowKit inside MiniPay — it provides its own injected wallet */}
        {isMiniPay ? (
          children
        ) : (
          <RainbowKitProvider theme={darkTheme()} initialChain={base}>
            {children}
          </RainbowKitProvider>
        )}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
