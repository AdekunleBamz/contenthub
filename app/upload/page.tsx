'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';

export default function UploadPage() {
  const { address, chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [contentHash, setContentHash] = useState('');
  const [contentType, setContentType] = useState('image');
  const [metadata, setMetadata] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const currentChain = chain?.id === 8453 ? 'base' : chain?.id === 42220 ? 'celo' : null;
  const contract = currentChain ? CONTRACTS[currentChain].communityContentHub : null;
  const uploadFee = currentChain ? CONTRACTS[currentChain].uploadFee : '0';

  const handleUpload = async () => {
    if (!isConnected || !contract || !currentChain) return;

    const meta = JSON.stringify({
      title,
      description,
      contentType,
      timestamp: Date.now(),
    });

    try {
      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'uploadContent',
        args: [contentHash, contentType, metadata || meta],
        value: BigInt(uploadFee),
      } as any);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Upload Content</h1>
          <p className="text-gray-400 mb-8">
            Please connect your wallet to upload content
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
        <h1 className="text-4xl font-bold mb-2">Upload Content</h1>
        <p className="text-gray-400 mb-8">
          Share your content on {currentChain === 'base' ? 'Base' : 'Celo'}
        </p>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <p className="text-green-400">✅ Content uploaded successfully!</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Describe your content"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="score">Game Score</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content Hash (IPFS)
              </label>
              <input
                type="text"
                value={contentHash}
                onChange={(e) => setContentHash(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your file to IPFS first and paste the hash here
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Upload Fee:</span>
                <span className="font-semibold">
                  {currentChain === 'base' ? '0.00002 ETH' : '0.4 CELO'}
                </span>
              </div>

              <button
                onClick={handleUpload}
                disabled={isPending || isConfirming || !contentHash || !title}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {isPending || isConfirming ? 'Processing...' : 'Upload Content'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
