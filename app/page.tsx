import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Welcome to ContentHub
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          A community-driven platform where you can upload content, vote on favorites, 
          and mint achievement NFTs on Base and Celo chains.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/upload"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Upload Content
          </Link>
          <Link 
            href="/gallery"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Browse Gallery
          </Link>
          <Link 
            href="/mint"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
          >
            Mint NFT
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-bold mb-2">Upload Content</h3>
          <p className="text-gray-400">
            Share your gaming achievements, artwork, or content. 
            Pay just 0.00002 ETH on Base or 0.00002 CELO.
          </p>
        </div>

        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <div className="text-4xl mb-4">🗳️</div>
          <h3 className="text-xl font-bold mb-2">Community Voting</h3>
          <p className="text-gray-400">
            Vote on your favorite content. Top creators earn rewards 
            from the community treasury.
          </p>
        </div>

        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold mb-2">Mint NFTs</h3>
          <p className="text-gray-400">
            Create achievement NFTs to commemorate your milestones. 
            Own your accomplishments on-chain.
          </p>
        </div>
      </div>

      <div className="mt-16 p-8 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-2xl border border-purple-500/20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Cross-Chain Support</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Base Mainnet</h4>
            <p className="text-sm text-gray-400">Fee: 0.00002 ETH per upload</p>
            <p className="text-sm text-gray-400">Low-cost Ethereum L2</p>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-400 mb-2">Celo Mainnet</h4>
            <p className="text-sm text-gray-400">Fee: 0.00002 CELO per upload</p>
            <p className="text-sm text-gray-400">Mobile-first blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
