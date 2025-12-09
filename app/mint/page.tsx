'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';

export default function MintPage() {
  const { address, chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [file, setFile] = useState<File | null>(null);
  const [nftType, setNftType] = useState('achievement');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const currentChain = chain?.id === 8453 ? 'base' : chain?.id === 42220 ? 'celo' : null;
  const contract = currentChain ? CONTRACTS[currentChain].contentNFT : null;
  const mintFee = currentChain ? CONTRACTS[currentChain].mintFee : '0';

  // Reset form when mint is successful
  useEffect(() => {
    if (isSuccess) {
      setFile(null);
      setTitle('');
      setDescription('');
      setNftType('achievement');
      setPreviewUrl('');
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }, [isSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  const handleMint = async () => {
    if (!isConnected || !contract || !currentChain) return;
    if (!file || !title) {
      alert('Please provide an image and title for your NFT');
      return;
    }

    try {
      setIsCreating(true);
      setProgress('Uploading image to IPFS...');

      // Upload image to IPFS
      const imageFormData = new FormData();
      imageFormData.append('file', file);

      const imageRes = await fetch('/api/upload-ipfs', {
        method: 'POST',
        body: imageFormData,
      });

      if (!imageRes.ok) {
        throw new Error('Image upload failed');
      }

      const { ipfsHash: imageHash } = await imageRes.json();
      setProgress('Creating NFT metadata...');

      // Create metadata
      const metadataRes = await fetch('/api/create-nft-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: title,
          description,
          image: `ipfs://${imageHash}`,
          nftType,
          attributes: [
            { trait_type: 'Type', value: nftType },
            { trait_type: 'Chain', value: currentChain === 'base' ? 'Base' : 'Celo' },
            { trait_type: 'Created', value: new Date().toISOString() },
          ],
        }),
      });

      if (!metadataRes.ok) {
        throw new Error('Metadata creation failed');
      }

      const { metadataURI } = await metadataRes.json();
      setProgress('Minting NFT...');

      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'mintNFT',
        args: [metadataURI, nftType],
        value: BigInt(mintFee),
      } as any);
    } catch (error) {
      console.error('Mint error:', error);
      alert('Minting failed. Please try again.');
    } finally {
      setIsCreating(false);
      setProgress('');
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

          {progress && (
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <p className="text-blue-400">⏳ {progress}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Upload NFT Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select an image for your NFT. We&apos;ll handle IPFS upload and metadata creation automatically.
              </p>
            </div>

            {previewUrl && (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="NFT Preview" className="w-full max-h-64 object-contain bg-gray-800" />
              </div>
            )}

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
            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Mint Fee:</span>
                <span className="font-semibold">
                  {currentChain === 'base' ? '0.00002 ETH' : '0.00002 CELO'}
                </span>
              </div>

              <button
                onClick={handleMint}
                disabled={isPending || isConfirming || isCreating || !file || !title}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {isCreating ? progress || 'Creating...' : isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
