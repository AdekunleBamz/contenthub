'use client';

import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';

export function useFarcasterContext() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const ctx = await sdk.context;
        setContext(ctx);
        sdk.actions.ready();
      } catch (error) {
        console.log('Not running in Farcaster Frame');
      } finally {
        setIsSDKLoaded(true);
      }
    };

    load();
  }, []);

  return { isSDKLoaded, context, sdk };
}
