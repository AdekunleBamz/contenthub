# Pinata IPFS Setup Guide

ContentHub uses Pinata for automatic IPFS uploads, so users don't need to manually upload files to IPFS.

## Getting Your Pinata API Key

1. **Sign up for Pinata**
   - Go to [https://app.pinata.cloud](https://app.pinata.cloud)
   - Create a free account (100 GB storage free)

2. **Create an API Key**
   - Navigate to **API Keys** in the left sidebar
   - Click **New Key** button
   - Enable the following permissions:
     - ✅ `pinFileToIPFS`
     - ✅ `pinJSONToIPFS` (optional, for future features)
   - Give it a name like "ContentHub Production"
   - Click **Create Key**

3. **Copy Your JWT**
   - You'll see your API Key, API Secret, and **JWT**
   - **Copy the JWT token** (long string starting with "eyJ...")
   - ⚠️ Save it immediately - you won't be able to see it again!

4. **Add to Environment Variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Edit .env.local and add:
   PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **For Production (Vercel/etc)**
   - Add `PINATA_JWT` to your deployment environment variables
   - Keep it secret - never commit it to git

## How It Works

When users upload content:
1. User selects a file from their device
2. File is sent to `/api/upload-ipfs`
3. API uploads to Pinata IPFS
4. IPFS hash is returned
5. Smart contract stores the hash on-chain
6. Content is permanently stored on IPFS

## Testing

After adding your JWT:
```bash
npm run dev
# Go to http://localhost:3000/upload
# Select a file and upload
# It should automatically upload to IPFS!
```

## Pinata Gateway

Files are accessible via:
- `https://gateway.pinata.cloud/ipfs/{hash}`
- Works immediately after upload
- No additional configuration needed

## Free Tier Limits

- 100 GB storage
- 100,000 API requests/month
- Unlimited bandwidth
- More than enough for most apps!

## Troubleshooting

**Upload fails with 401 Unauthorized**
- Check your JWT is correct
- Make sure you copied the full token
- Verify the API key has `pinFileToIPFS` permission

**Upload is slow**
- Normal for first upload
- Pinata is replicating across IPFS network
- Usually takes 2-10 seconds

**Can't see uploaded files**
- Check the Pinata dashboard
- Files section shows all uploads
- Gateway URL should work immediately
