# ContentHub - Setup Instructions

## 🚀 Quick Start

Your **ContentHub** Farcaster miniapp is ready! Follow these steps:

### 1. Install Dependencies

```bash
cd /Users/apple/Desktop/ContentHub
npm install
```

### 2. Environment Setup (Optional)

If you want to use WalletConnect:
```bash
cp .env.example .env
# Edit .env and add your WalletConnect Project ID from https://cloud.walletconnect.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📱 Features Built

✅ **Home Page** - Landing page with feature overview
✅ **Upload Content** - Upload content with payment (0.00002 ETH / 0.4 CELO)
✅ **Gallery** - Browse and vote on community content
✅ **Mint NFT** - Create achievement NFTs on-chain
✅ **Profile** - View your uploads and NFTs
✅ **Wallet Connection** - RainbowKit integration (MetaMask, Coinbase Wallet)
✅ **Network Switching** - Seamless Base ↔ Celo switching
✅ **Contract Integration** - Full smart contract interaction

---

## 🎨 Pages Created

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features |
| Gallery | `/gallery` | Browse and vote on content |
| Upload | `/upload` | Upload new content |
| Mint NFT | `/mint` | Mint achievement NFTs |
| Profile | `/profile` | User profile and stats |

---

## 🔗 Deployed Contracts

### Base Mainnet (Chain ID: 8453)
- **CommunityContentHub**: `0x5AB61B0191e19c7c435E67550f90A0F2E48a3450`
- **ContentNFT**: `0xeE5Dd28E440A5cb51587fDbcb29b4b367fe87334`
- **Upload Fee**: 0.00002 ETH

### Celo Mainnet (Chain ID: 42220)
- **CommunityContentHub**: `0x0bac169738f89689F8932A3E2663F1874D7CB92d`
- **ContentNFT**: `0x11E07A42989212622306A0F293829888fe004828`
- **Upload Fee**: 0.4 CELO

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi v2, Viem, RainbowKit
- **Chains**: Base Mainnet, Celo Mainnet
- **Wallet**: MetaMask, Coinbase Wallet, WalletConnect

---

## 🎯 Next Steps

1. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add IPFS Integration**:
   - Integrate Pinata or NFT.Storage for file uploads
   - Users can upload images/videos directly to IPFS

3. **Enhance Gallery**:
   - Add filtering by content type
   - Add search functionality
   - Display actual IPFS content (images/videos)

4. **Farcaster Frame**:
   - Add Farcaster Frame metadata
   - Enable sharing on Farcaster
   - Create Frame actions for voting

5. **Analytics Dashboard**:
   - Show top content by votes
   - Display platform statistics
   - Leaderboards

---

## 💡 Usage Guide

### For Users:

1. **Connect Wallet** - Click "Connect Wallet" in the navbar
2. **Switch Network** - Choose Base or Celo
3. **Upload Content**:
   - Upload file to IPFS (use Pinata.cloud)
   - Paste IPFS hash
   - Pay upload fee
   - Content appears in gallery

4. **Vote on Content**:
   - Browse gallery
   - Click "Vote" on favorites
   - Free (just gas)

5. **Mint NFT**:
   - Create NFT metadata JSON
   - Upload to IPFS
   - Mint with metadata URI
   - NFT appears in profile

---

## 🐛 Troubleshooting

**"Incorrect upload fee" error**:
- Make sure you're on the correct network
- Base: 0.00002 ETH
- Celo: 0.4 CELO

**Wallet not connecting**:
- Try refreshing the page
- Clear browser cache
- Try different wallet

**Transaction failing**:
- Check you have enough funds for fee + gas
- Ensure you're on correct network

---

## 🌟 Features to Add Later

- [ ] Direct IPFS upload in UI
- [ ] Content moderation system
- [ ] Reward distribution for top creators
- [ ] NFT marketplace for trading
- [ ] Comments on content
- [ ] User reputation system
- [ ] Mobile app with Farcaster SDK
- [ ] Push notifications
- [ ] Social sharing

---

## 📞 Support

Issues? Check:
- Contract addresses are correct
- You're on Base (8453) or Celo (42220)
- You have enough funds
- Network RPC is working

---

**Your app is ready to use! 🎉**

Run `npm install && npm run dev` to start building your community!
