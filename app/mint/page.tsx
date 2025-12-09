'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { getDivviReferralTag, submitDivviReferral } from '@/lib/divvi';

export default function MintPage() {
  const { address, chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Submit to Divvi when mint transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash && chain?.id) {
      submitDivviReferral(hash, chain.id);
    }
  }, [isSuccess, hash, chain]);

  const [metadataURI, setMetadataURI] = useState('');
  const [nftType, setNftType] = useState('achievement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const currentChain = chain?.id === 8453 ? 'base' : chain?.id === 42220 ? 'celo' : null;
  const contract = currentChain ? CONTRACTS[currentChain].contentNFT : null;
  const mintFee = currentChain ? CONTRACTS[currentChain].mintFee : '0';

  const handleMint = async () => {
    if (!isConnected || !contract || !currentChain) return;

    try {
      const referralTag = address ? getDivviReferralTag(address) : '0x';
      
      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'mintNFT',
        args: [metadataURI, nftType],
        value: BigInt(mintFee),
        data: referralTag, // Add Divvi tracking
      } as any);
    } catch (error) {
      console.error('Mint error:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Mint NFT</h1>
          <p className="text-gray-400 mb-8">
            Please connect your wallet to mint achievement NFTs
          </p>
        </div>
      </div>
    );
  }

  if (!currentChain) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Wrong Network</h1>
          <p className="text-gray-400 mb-8">
            Please switch to Base or Celo network
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => switchChain?.({ chainId: 8453 })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Switch to Base
            </button>
            <button
              onClick={() => switchChain?.({ chainId: 42220 })}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
            >
              Switch to Celo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Mint Achievement NFT</h1>
        <p className="text-gray-400 mb-8">
          Create an on-chain NFT to commemorate your achievements on {currentChain === 'base' ? 'Base' : 'Celo'}
        </p>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <p className="text-green-400">✅ NFT minted successfully!</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">NFT Type</label>
              <select
                value={nftType}
                onChange={(e) => setNftType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="achievement">Achievement</option>
                <option value="badge">Badge</option>
                <option value="milestone">Milestone</option>
                <option value="content">Content</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter NFT title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Describe this achievement"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Metadata URI (IPFS)
              </label>
              <input
                type="text"
                value={metadataURI}
                onChange={(e) => setMetadataURI(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your NFT metadata JSON to IPFS and paste the URI here
              </p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">NFT Preview</h3>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">
                  {nftType === 'achievement' ? '🏆' :
                   nftType === 'badge' ? '🎖️' :
                   nftType === 'milestone' ? '⭐' : '🎨'}
                </div>
                <h4 className="text-xl font-bold">{title || 'Your NFT Title'}</h4>
                <p className="text-sm text-gray-300 mt-2">{description || 'Your description here'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Mint Fee:</span>
                <span className="font-semibold">
                  {currentChain === 'base' ? '0.00002 ETH' : '0.4 CELO'}
                </span>
              </div>

              <button
                onClick={handleMint}
                disabled={isPending || isConfirming || !metadataURI}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-indigo-900/20 border border-indigo-500/20 rounded-xl">
          <h3 className="font-semibold mb-2">💡 Tips for Creating NFT Metadata</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Upload an image to IPFS (using Pinata, NFT.Storage, etc.)</li>
            <li>• Create a metadata JSON file with image URL, name, and description</li>
            <li>• Upload the metadata JSON to IPFS</li>
            <li>• Use the IPFS URI format: ipfs://QmXXX...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
