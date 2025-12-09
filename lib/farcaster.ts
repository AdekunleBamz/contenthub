'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function useFarcasterContext() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>(null);

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
