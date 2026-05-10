# Config

ContentHub reads public chain and contract settings from `NEXT_PUBLIC_*` variables and keeps private upload credentials server-side.

## Required Local Values

- `PINATA_JWT`: server-only token used by upload API routes.
- `NEXT_PUBLIC_CHAIN_ID`: active chain ID for the selected deployment.
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: WalletConnect project id for browser wallet flows.
- `NEXT_PUBLIC_APP_URL`: canonical URL used by metadata, Farcaster, and shared links.

## Chain IDs

- Base mainnet: `8453`
- Celo mainnet: `42220`

## Safety Notes

- Keep `PINATA_JWT` out of client-side code and screenshots.
- Restart the dev server after changing environment variables.
- Match contract addresses to the chain selected by `NEXT_PUBLIC_CHAIN_ID`.
- Keep `NEXT_PUBLIC_APP_URL` aligned with the domain used by Farcaster and NFT metadata.
