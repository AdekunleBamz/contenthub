# ContentHub

Community-driven content platform built on Base and Celo chains.

## Features

- 🎨 Upload content with automatic IPFS storage (no manual hash needed!)
- 📤 Drag-and-drop file uploads (images, videos, achievements)
- 🗳️ Community voting system
- 🏆 Mint achievement NFTs
- 💰 Micro-payments (0.00002 ETH on Base, 0.00002 CELO on Celo)
- 🌐 Cross-chain support (Base + Celo)
- 📱 Farcaster Mini App integration
- 🎯 Divvi referral tracking - earn rewards for driving on-chain activity!
- 🔄 Unified content browsing across Base and Celo deployments

## Deployed Contracts

### Base Mainnet
- CommunityContentHub: `0x5AB61B0191e19c7c435E67550f90A0F2E48a3450`
- ContentNFT: `0xeE5Dd28E440A5cb51587fDbcb29b4b367fe87334`

### Celo Mainnet
- CommunityContentHub: `0x0bac169738f89689F8932A3E2663F1874D7CB92d`
- ContentNFT: `0x11E07A42989212622306A0F293829888fe004828`
- ContentHubTreasury: `0x2ff169744a28fE867aa52f29E8eF5080b7f45061`

### Treasury
- `ContentHubTreasury.sol` is ready for manual Remix deployment.
- Celo treasury is configured. After a Base deployment, paste the Base treasury address into `lib/contracts.ts`.
- Remix deployment notes: [`docs/treasury-remix-deployment.md`](./docs/treasury-remix-deployment.md)

## Getting Started

```bash
# Install dependencies
npm ci

# Set up environment variables
cp .env.example .env.local

# Add your Pinata JWT for IPFS uploads
# Get it from: https://app.pinata.cloud/developers/api-keys
echo "PINATA_JWT=your_jwt_here" >> .env.local

# Run development server
npm run dev

# Run lint checks
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000)

For detailed IPFS setup instructions, see [PINATA_SETUP.md](./PINATA_SETUP.md)
For pre/post-deploy validation, use [docs/operations-checklist.md](./docs/operations-checklist.md).

## Security Notes

- Keep `.env.local` private and never commit Pinata JWTs.
- Revoke and rotate the Pinata key immediately if a JWT is exposed.

## Troubleshooting

- If uploads fail, verify `PINATA_JWT` is set and restart the dev server.
- If transactions fail, confirm your wallet network matches the selected contract chain.
- Use NEXT_PUBLIC_CHAIN_ID 8453 for Base or 42220 for Celo in local config.
- If the Farcaster Mini App context is missing, make sure you are opening the app inside a compatible Farcaster client.
- If wallet connection fails at startup, verify NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is configured.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- RainbowKit
- Wagmi
- Viem
- Farcaster Mini App SDK
- Pinata (IPFS storage)
- Divvi Referral SDK (on-chain attribution & rewards)

## Contributing

Contributions welcome!
