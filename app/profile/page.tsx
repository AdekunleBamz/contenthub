'use client';

import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { useState } from 'react';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState<'base' | 'celo'>('base');

  const { data: userProfile } = useReadContract({
    address: CONTRACTS[selectedChain].communityContentHub.address,
    abi: CONTRACTS[selectedChain].communityContentHub.abi,
    functionName: 'getPlatformStats',
    args: address ? [address] : undefined,
  } as any);

  const { data: userContents } = useReadContract({
    address: CONTRACTS[selectedChain].communityContentHub.address,
    abi: CONTRACTS[selectedChain].communityContentHub.abi,
    functionName: 'getUserContents',
    args: address ? [address] : undefined,
  });

  const { data: userNFTs } = useReadContract({
    address: CONTRACTS[selectedChain].contentNFT.address,
    abi: CONTRACTS[selectedChain].contentNFT.abi,
    functionName: 'getOwnerTokens',
    args: address ? [address] : undefined,
  });

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
          <p className="text-gray-400">
            Please connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }

  const profile = userProfile as [bigint, bigint, bigint, boolean] | undefined;
  const contents = userContents as bigint[] | undefined;
  const nfts = userNFTs as bigint[] | undefined;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSelectedChain('base')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedChain === 'base'
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Base
          </button>
          <button
            onClick={() => setSelectedChain('celo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedChain === 'celo'
                ? 'bg-yellow-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Celo
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold">{address}</h2>
              <p className="text-gray-400">
                {selectedChain === 'base' ? 'Base Mainnet' : 'Celo Mainnet'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">
                {profile?.[0]?.toString() || '0'}
              </div>
              <div className="text-gray-400 text-sm">Total Uploads</div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-indigo-400">
                {profile?.[1]?.toString() || '0'}
              </div>
              <div className="text-gray-400 text-sm">Votes Received</div>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-3xl font-bold text-green-400">
                {nfts?.length || 0}
              </div>
              <div className="text-gray-400 text-sm">NFTs Owned</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Your Uploads</h3>
            {contents && contents.length > 0 ? (
              <div className="space-y-4">
                {contents.map((contentId) => (
                  <div
                    key={contentId.toString()}
                    className="p-4 bg-gray-900 border border-gray-800 rounded-lg"
                  >
                    <div className="text-sm text-gray-400">Content #{contentId.toString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No uploads yet</p>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Your NFTs</h3>
            {nfts && nfts.length > 0 ? (
              <div className="space-y-4">
                {nfts.map((tokenId) => (
                  <div
                    key={tokenId.toString()}
                    className="p-4 bg-gray-900 border border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🏆</span>
                      <div>
                        <div className="font-semibold">NFT #{tokenId.toString()}</div>
                        <div className="text-sm text-gray-400">Achievement Token</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No NFTs minted yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
