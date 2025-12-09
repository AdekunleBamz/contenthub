'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-bg bg-clip-text text-transparent">
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
          </div>

          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
