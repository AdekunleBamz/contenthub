# QA Notes

## Upload Flow

- Upload a small image and confirm an IPFS CID is returned.
- Confirm upload errors never show raw Pinata credentials.
- Refresh `/gallery` and confirm the new content is visible.

## Vote Flow

- Vote on an existing content item and confirm the vote count increments.
- Confirm the vote cooldown prevents a second vote within the configured window.

## Wallet Flow

- Connect on Base mainnet.
- Connect on Celo mainnet.
- Confirm chain-specific contract addresses match the selected network.
- Confirm profile data refreshes after a wallet reconnect.
- Save the chain, wallet type, and content id used for each smoke test.
