# ContentHub Operations Checklist

## Pre-Deploy

- [ ] Confirm both Base and Celo contract addresses match the intended release.
- [ ] Validate RPC/network selection for Base and Celo in the active environment.
- [ ] Confirm `PINATA_JWT` is present and not using placeholder values.
- [ ] Run `npm run lint` and resolve all build-time lint failures.
- [ ] Run `npm run build` locally once before production deployment.

## Security

- [ ] Verify `.env.local` is ignored and never staged for commit.
- [ ] Strip Pinata auth values from error logs before sharing support output.
- [ ] Confirm upload API responses never include raw JWT or secret metadata.

## Runtime Checks

- [ ] Upload one image and confirm IPFS CID is returned and persisted in content records.
- [ ] Open `/gallery` and verify newly uploaded content appears without stale cache issues.
- [ ] Complete one NFT mint flow and confirm token metadata route returns valid JSON.
- [ ] Open `/minipay` route and verify wallet bootstrap succeeds inside MiniPay webview.
- [ ] Confirm Divvi referral attribution still fires on at least one write transaction.
- [ ] Confirm `/profile` reflects latest uploads and minted achievements after refresh.

## Post-Deploy

- [ ] Verify production domain metadata (manifest, OG image, splash) resolves correctly.
- [ ] Capture successful upload and mint transaction hashes for release logs.
- [ ] Validate chain switch UX between Base and Celo without requiring full page reload.
- [ ] Validate `/api/upload-ipfs` and `/api/content` return healthy responses in production.

## Observability

- [ ] Track upload failure counts by route and chain for the first 24 hours after release.
- [ ] Record average mint transaction confirmation latency on Base and Celo separately.
- [ ] Verify referral attribution callbacks continue after route-level changes.
