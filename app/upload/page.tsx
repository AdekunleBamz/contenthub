'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useConnect, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { CONTRACTS, BASE_CHAIN_ID, CELO_CHAIN_ID, CONTENT_FEE_DISPLAY } from '@/lib/contracts';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '@/lib/constants';

const MINIPAY_FEE_CURRENCY = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const;

function detectMiniPay(): boolean {
  return typeof window !== 'undefined' && Boolean((window.ethereum as any)?.isMiniPay);
}

export default function UploadPage() {
  const { chain, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [isMiniPay, setIsMiniPay] = useState(false);
  const miniPayConnectAttempted = useRef(false);

  useEffect(() => {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (detectMiniPay()) {
        clearInterval(timer);
        setIsMiniPay(true);
        if (!isConnected && !miniPayConnectAttempted.current) {
          miniPayConnectAttempted.current = true;
          connect({ connector: injected() });
        }
      } else if (attempts >= 20) {
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, [connect, isConnected]);

  const [file, setFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentChain = chain?.id === BASE_CHAIN_ID ? 'base' : chain?.id === CELO_CHAIN_ID ? 'celo' : null;
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
      setUploadError(null);
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  }, [isSuccess]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }

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
      setUploadError('Please select a file and enter a title.');
      return;
    }

    setUploadError(null);

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
        let reason = 'IPFS upload failed.';
        try {
          const body = await uploadRes.json();
          if (body?.error) reason = body.error;
        } catch {}
        throw new Error(reason);
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
        ...(isMiniPay ? { type: 'legacy', feeCurrency: MINIPAY_FEE_CURRENCY } : {}),
      } as any);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error ? error.message : 'Upload failed. Please try again.'
      );
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
              onClick={() => switchChain?.({ chainId: BASE_CHAIN_ID })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Switch to Base
            </button>
            <button
              onClick={() => switchChain?.({ chainId: CELO_CHAIN_ID })}
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

          {uploadError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400">⚠️ {uploadError}</p>
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
                maxLength={MAX_TITLE_LENGTH}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="Enter content title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_DESCRIPTION_LENGTH}
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
                  {currentChain === 'base' ? `${CONTENT_FEE_DISPLAY} ETH` : `${CONTENT_FEE_DISPLAY} CELO`}
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
