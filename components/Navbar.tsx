'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const hasAttemptedAutoConnect = useRef(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined'
      && window.ethereum
      && (window.ethereum as any).isMiniPay
      && !hasAttemptedAutoConnect.current
    ) {
      // Running inside MiniPay – auto-connect and hide the connect button
      setHideConnectBtn(true);
      hasAttemptedAutoConnect.current = true;
      connect({ connector: injected({ target: 'metaMask' }) });
    }
  }, [connect]);

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ContentHub" className="w-8 h-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              ContentHub
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/gallery"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Upload
            </Link>
            <Link
              href="/mint"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Mint NFT
            </Link>
            {isConnected && (
              <Link
                href="/profile"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Profile
              </Link>
            )}
            {hideConnectBtn && (
              <Link
                href="/minipay"
                className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
              >
                MiniPay
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {hideConnectBtn ? (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full px-3 py-1 font-medium">
                MiniPay
              </span>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
