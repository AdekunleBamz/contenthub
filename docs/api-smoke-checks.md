# API Smoke Checks

Use these checks after deployment or after changing API route configuration.

## Upload API

- Confirm `/api/upload-ipfs` rejects requests without a file.
- Confirm a small image upload returns an IPFS CID.
- Confirm upload errors do not include raw `PINATA_JWT` values.

## Content API

- Confirm `/api/content` returns a valid JSON response.
- Confirm uploaded content appears in gallery responses after refresh.
- Confirm invalid query parameters return a controlled error response.

## Metadata API

- Confirm `/api/create-nft-metadata` returns valid JSON for public content fields.
- Confirm generated metadata links use the configured app URL.
- Save the request URL and response status with the smoke evidence.
