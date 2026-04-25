'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Custom hook to manage and provide Farcaster Mini App SDK context.
 * Automatically detects if the app is running within a Farcaster client and initializes the SDK.
 * 
 * @returns An object containing the SDK loading state, the current context, and the SDK instance.
 */
export function useFarcasterContext() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Check if we're in a Mini App environment
        const isMiniApp = await sdk.isInMiniApp();
        
        if (isMiniApp) {
          const ctx = sdk.context;
          setContext(ctx);
          await sdk.actions.ready();
        }
      } catch (error) {
        console.log('Not running in Farcaster Mini App:', error);
      } finally {
        setIsSDKLoaded(true);
      }
    };

    load();
  }, []);

  return { isSDKLoaded, context, sdk };
}
