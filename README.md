# ContentHub

Community-driven content platform built on Base and Celo chains.

## Features

- 🎨 Upload content with automatic IPFS storage (no manual hash needed!)
- 📤 Drag-and-drop file uploads (images, videos, achievements)
- 🗳️ Community voting system
- 🏆 Mint achievement NFTs
- 💰 Micro-payments (0.00002 ETH on Base, 0.00002 CELO on Celo)
- 🌐 Cross-chain support (Base + Celo)
- 📱 Farcaster Frame integration
- 🎯 Divvi referral tracking - earn rewards for driving on-chain activity!

## Deployed Contracts

### Base Mainnet
- CommunityContentHub: `0x5AB61B0191e19c7c435E67550f90A0F2E48a3450`
- ContentNFT: `0xeE5Dd28E440A5cb51587fDbcb29b4b367fe87334`

### Celo Mainnet
- CommunityContentHub: `0x0bac169738f89689F8932A3E2663F1874D7CB92d`
- ContentNFT: `0x11E07A42989212622306A0F293829888fe004828`

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Pinata JWT for IPFS uploads
# Get it from: https://app.pinata.cloud/developers/api-keys
echo "PINATA_JWT=your_jwt_here" >> .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

For detailed IPFS setup instructions, see [PINATA_SETUP.md](./PINATA_SETUP.md)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- RainbowKit
- Wagmi
- Viem
- Farcaster Frame SDK
- Pinata (IPFS storage)
- Divvi Referral SDK (on-chain attribution & rewards)
