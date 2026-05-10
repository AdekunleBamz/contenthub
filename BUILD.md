# Build

Use the production build as the final local check before promoting a Vercel deployment.

```bash
npm run lint
npm run build
```

The app targets Node 20 or newer, matching the `engines` field in `package.json`.
