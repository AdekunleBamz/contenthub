# ContentHub Operations Checklist

## Pre-Deploy

- [ ] Confirm both Base and Celo contract addresses match the intended release.
- [ ] Validate RPC/network selection for Base and Celo in the active environment.
- [ ] Confirm `PINATA_JWT` is present and not using placeholder values.
- [ ] Run `npm run lint` and resolve all build-time lint failures.
- [ ] Run `npm run build` locally once before production deployment.

## Security

- [ ] Verify `.env.local` is ignored and never staged for commit.
