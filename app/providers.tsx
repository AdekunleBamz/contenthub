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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    const load = async () => {
      try {
        // Check if we're in a Mini App environment
        const isMiniApp = await sdk.isInMiniApp();
        
        if (isMiniApp) {
          await sdk.actions.ready();
        }
      } catch (error) {
        console.log('Not in Farcaster Mini App context:', error);
      } finally {
        setIsSDKLoaded(true);
      }
    };
    load();
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
        <RainbowKitProvider 
          theme={darkTheme()}
          initialChain={base}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
