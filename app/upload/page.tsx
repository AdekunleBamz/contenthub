'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';

export default function UploadPage() {
  const { address, chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const currentChain = chain?.id === 8453 ? 'base' : chain?.id === 42220 ? 'celo' : null;
  const contract = currentChain ? CONTRACTS[currentChain].communityContentHub : null;
  const uploadFee = currentChain ? CONTRACTS[currentChain].uploadFee : '0';

  // Reset form when upload is successful
  useEffect(() => {
    if (isSuccess) {
      setFile(null);
      setTitle('');
      setDescription('');
      setContentType('image');
      setPreviewUrl('');
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }, [isSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Auto-detect content type
      if (selectedFile.type.startsWith('image/')) {
        setContentType('image');
      } else if (selectedFile.type.startsWith('video/')) {
        setContentType('video');
      } else {
        setContentType('score');
      }

      // Create preview URL
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
    }
  };

  const handleUpload = async () => {
    if (!isConnected || !contract || !currentChain) return;
    if (!file || !title) {
      alert('Please select a file and enter a title');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress('Uploading to IPFS...');

      // Upload file to IPFS
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload-ipfs', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error('IPFS upload failed');
      }

      const { ipfsHash } = await uploadRes.json();
      setUploadProgress('Saving to blockchain...');

      const meta = JSON.stringify({
        title,
        description,
        contentType,
        filename: file.name,
        size: file.size,
        timestamp: Date.now(),
      });

      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'uploadContent',
        args: [ipfsHash, contentType, meta],
        value: BigInt(uploadFee),
      } as any);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
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

          {uploadProgress && (
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
              <p className="text-blue-400">⏳ {uploadProgress}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select an image or video file. We&apos;ll upload it to IPFS automatically.
              </p>
            </div>

            {previewUrl && (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain bg-gray-800" />
              </div>
            )}

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

            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Upload Fee:</span>
                <span className="font-semibold">
                  {currentChain === 'base' ? '0.00002 ETH' : '0.00002 CELO'}
                </span>
              </div>

              <button
                onClick={handleUpload}
                disabled={isPending || isConfirming || isUploading || !file || !title}
                className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {isUploading ? uploadProgress || 'Uploading...' : isPending || isConfirming ? 'Processing...' : 'Upload Content'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
