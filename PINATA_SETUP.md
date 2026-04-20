# Pinata Setup

Use this quick setup for local IPFS uploads.

## Steps

1. Create a Pinata API key with upload permissions.
2. Add `PINATA_JWT` to `.env.local`.
3. Restart the Next.js dev server after updating env vars.
4. Hit `/api/upload-ipfs` from local UI once to confirm authentication works.

Rotate the Pinata JWT periodically and after any accidental exposure.
Never commit `.env.local` while it contains production Pinata credentials.
