# Pinata Setup

Use this quick setup for local IPFS uploads.

## Steps

1. Create a Pinata API key with upload permissions.
2. Add `PINATA_JWT` to `.env.local` (create the file from `.env.example` first if needed).
3. Restart the Next.js dev server after updating env vars.
4. Hit `/api/upload-ipfs` from local UI once to confirm authentication works.

Next.js reads env values at startup, so token updates require a restart to take effect.

Rotate the Pinata JWT periodically and after any accidental exposure.
Never commit `.env.local` while it contains production Pinata credentials.
Confirm the key has only required scopes (upload/read) to reduce blast radius.
