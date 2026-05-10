# API

ContentHub API routes support uploads, content listing, and NFT metadata creation.

## Upload IPFS

`POST /api/upload-ipfs`

- Expects a multipart file upload.
- Requires server-side `PINATA_JWT`.
- Returns IPFS metadata for the uploaded asset.

## Content

`GET /api/content`

- Returns content records used by the gallery.
- Should respond with JSON for healthy production checks.
- Invalid query parameters should return controlled errors.

## NFT Metadata

`POST /api/create-nft-metadata`

- Builds metadata for minted achievement NFTs.
- Should reference the canonical app URL in generated links.
- Should only include public content fields.
