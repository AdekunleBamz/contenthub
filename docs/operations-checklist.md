# ContentHub Operations Checklist

## Pre-Deploy

- [ ] Confirm both Base and Celo contract addresses match the intended release.
- [ ] Validate RPC/network selection for Base and Celo in the active environment.
- [ ] Confirm `NEXT_PUBLIC_APP_URL` matches the Vercel production domain.
- [ ] Confirm `PINATA_JWT` is present and not using placeholder values.
- [ ] Run `npm ci` on a clean tree before lint/build checks.
- [ ] Run `npm run lint` and resolve all build-time lint failures.
- [ ] Run `npm run typecheck` and resolve TypeScript failures.
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
- [ ] Confirm minted metadata opens from an external browser without wallet context.
- [ ] Confirm Base and Celo contract addresses in the UI match the intended deployment chain.
- [ ] Confirm failed IPFS uploads return a user-readable error and do not expose Pinata credentials.

## Post-Deploy

- [ ] Verify production domain metadata (manifest, OG image, splash) resolves correctly.
- [ ] Capture successful upload and mint transaction hashes for release logs.
- [ ] Validate chain switch UX between Base and Celo without requiring full page reload.
- [ ] Validate `/api/upload-ipfs` and `/api/content` return healthy responses in production.

## Observability

- [ ] Track upload failure counts by route and chain for the first 24 hours after release.
- [ ] Record average mint transaction confirmation latency on Base and Celo separately.
- [ ] Verify referral attribution callbacks continue after route-level changes.

## Recovery

- [ ] Keep a known-good rollback commit SHA available for emergency redeploy.
- [ ] Ensure `.env.example` remains in sync with required runtime variables after hotfixes.
- [ ] Attach one upload CID and mint hash to the release evidence note.
