'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/lib/contracts';
import { getDivviReferralTag, submitDivviReferral } from '@/lib/divvi';

interface Content {
  id: number;
  uploader: string;
  contentHash: string;
  contentType: string;
  metadata: string;
  timestamp: number;
  votes: number;
}

export default function GalleryPage() {
  const { address, chain } = useAccount();
  const { writeContract, data: hash } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  const currentChain = chain?.id === 8453 ? 'base' : chain?.id === 42220 ? 'celo' : null;
  const contract = currentChain ? CONTRACTS[currentChain].communityContentHub : null;

  const [contents, setContents] = useState<Content[]>([]);
  const [selectedChain, setSelectedChain] = useState<'base' | 'celo'>('base');

  const { data: totalUploads } = useReadContract({
    address: CONTRACTS[selectedChain].communityContentHub.address,
    abi: CONTRACTS[selectedChain].communityContentHub.abi,
    functionName: 'totalUploads',
  });

  const { data: latestIds } = useReadContract({
    address: CONTRACTS[selectedChain].communityContentHub.address,
    abi: CONTRACTS[selectedChain].communityContentHub.abi,
    functionName: 'getLatestContents',
    args: [10n],
  });

  useEffect(() => {
    if (latestIds && Array.isArray(latestIds)) {
      fetchContents(latestIds as bigint[]);
    }
  }, [latestIds, selectedChain]);

  const fetchContents = async (ids: bigint[]) => {
    const fetchedContents: Content[] = [];
    for (const id of ids) {
      try {
        const response = await fetch(`/api/content?chain=${selectedChain}&id=${id}`);
        if (response.ok) {
          const content = await response.json();
          fetchedContents.push(content);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    }
    setContents(fetchedContents);
  };

  const handleVote = async (contentId: number) => {
    if (!contract || !currentChain || currentChain !== selectedChain) return;

    try {
      const referralTag = address ? getDivviReferralTag(address) : '0x';
      
      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'voteContent',
        args: [BigInt(contentId)],
        data: referralTag, // Add Divvi tracking
      } as any);
    } catch (error) {
      console.error('Vote error:', error);
    }
  };

  // Submit to Divvi when vote transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash && chain?.id) {
      submitDivviReferral(hash, chain.id);
    }
  }, [isSuccess, hash, chain]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Content Gallery</h1>
        <p className="text-gray-400 mb-6">
          Browse and vote on community content
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setSelectedChain('base')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedChain === 'base'
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Base ({totalUploads?.toString() || '0'} uploads)
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
      </div>

      {isSuccess && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
          <p className="text-green-400">✅ Vote recorded successfully!</p>
        </div>
      )}

      {contents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            No content uploaded yet. Be the first to upload!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((content) => (
            <div key={content.id}>
              <ContentCard
                content={content}
                onVote={handleVote}
                canVote={currentChain === selectedChain && !!address}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentCard({
  content,
  onVote,
  canVote,
}: {
  content: Content;
  onVote: (id: number) => void;
  canVote: boolean;
}) {
  let metadata: any = {};
  try {
    metadata = JSON.parse(content.metadata);
  } catch (e) {
    metadata = { title: 'Untitled' };
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 card-hover">
      <div className="h-48 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
        <span className="text-6xl">
          {content.contentType === 'image' ? '🖼️' :
           content.contentType === 'video' ? '🎥' :
           content.contentType === 'score' ? '🎮' : '🏆'}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{metadata.title || 'Untitled'}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {metadata.description || 'No description'}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">
            {new Date(content.timestamp * 1000).toLocaleDateString()}
          </span>
          <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
            {content.contentType}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👍</span>
            <span className="font-semibold">{content.votes.toString()}</span>
          </div>

          {canVote && (
            <button
              onClick={() => onVote(content.id)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Vote
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600 mt-4 truncate">
          IPFS: {content.contentHash}
        </p>
      </div>
    </div>
  );
}
