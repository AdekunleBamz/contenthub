# Build

Use the production build as the final local check before promoting a Vercel deployment.

```bash
npm run lint
npm run build
```

The app targets Node 20 or newer, matching the `engines` field in `package.json`.

## Vercel Notes

Set `PINATA_JWT`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CHAIN_ID`, and wallet configuration before building a production deployment.

After changing public variables, trigger a fresh build so browser code receives the new values.
