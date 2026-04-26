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

/** Returns a Farcaster profile URL for a given username. */
export function farcasterProfileUrl(username: string): string {
  return "https://warpcast.com/" + username
}

/** Returns true if a Farcaster FID is valid. */
export function isValidFid(fid: number): boolean {
  return Number.isInteger(fid) && fid > 0
}

/** Formats a Farcaster cast hash to a short display string. */
export function shortCastHash(hash: string): string {
  return hash.slice(0, 10) + "..."
}

/** Returns true if a Farcaster username is valid format. */
export function isValidFarcasterUsername(name: string): boolean {
  return /^[a-zA-Z0-9_-]{1,16}$/.test(name)
}

/** Returns a Farcaster cast URL for a given cast hash. */
export function farcasterCastUrl(username: string, hash: string): string {
  return "https://warpcast.com/" + username + "/" + hash
}

/** Returns a Farcaster embed URL for use in frames. */
export function farcasterEmbedUrl(appUrl: string): string {
  return "https://warpcast.com/~/compose?embeds[]=" + encodeURIComponent(appUrl)
}

/** Returns true if a given Farcaster FID matches an address mapping. */
export function isFidOwner(fid: number, expectedFid: number): boolean {
  return fid === expectedFid
}

/** Returns a display name for a Farcaster user or falls back to address. */
export function farcasterDisplayName(name: string | null, addr: string): string {
  return name ?? addr.slice(0, 8)
}

/** Returns true if a Farcaster cast text exceeds the limit. */
export function isCastTooLong(text: string, limit = 320): boolean {
  return text.length > limit
}
