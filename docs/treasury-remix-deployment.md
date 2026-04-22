# ContentHubTreasury Remix Deployment

Use this when deploying `contracts/ContentHubTreasury.sol` manually from Remix.

## What This Contract Measures

- `totalPaymentVolume`: user payments routed through `recordNativePayment` or `recordERC20Payment`.
- `totalFundingVolume`: sponsor/community deposits routed through `fundNativePool` or `fundERC20Pool`.
- `getProtocolTVL(token)`: creator escrow plus rewards pool plus community pool.
- `getManagedBalance(token)`: all internally accounted balances, including protocol revenue.
- `getActualBalance(token)`: the real native/ERC-20 balance held by the treasury contract.

For native CELO or ETH, use the zero address token sentinel:

```txt
0x0000000000000000000000000000000000000000
```

## Remix Steps

1. Open Remix and create `ContentHubTreasury.sol`.
2. Paste the full contents of `contracts/ContentHubTreasury.sol`.
3. Compile with Solidity `0.8.20` or newer in the `0.8.x` line.
4. Deploy `ContentHubTreasury`.
5. Constructor argument `_protocolRecipient`: use your owner wallet, treasury wallet, or multisig.
6. Copy the deployed contract address.
7. Paste it into `lib/contracts.ts` under `contentHubTreasury.address` for the chain you deployed on.

## Recommended Celo Setup

Native CELO is supported by default. If you want stablecoin volume and TVL, call `setAssetSupported(token, true)` after deployment.

Common Celo mainnet stablecoins:

```txt
cUSD / USDm: 0x765DE816845861e75A25fCA122bb6898B8B1282a
USDC:        0xcebA9300f2b948710d2653dD7B07f33A8B32118C
USDT:        0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e
```

## Default Split

The default split for every recorded payment is:

```txt
70% creator escrow
20% creator rewards pool
5% community pool
5% protocol revenue
```

You can change this with `setFeeSplit(creatorBps, rewardPoolBps, communityPoolBps, protocolBps)`.

The four values must add up to `10000`.

Examples:

```txt
setFeeSplit(8000, 1000, 500, 500) // 80%, 10%, 5%, 5%
setFeeSplit(7000, 2000, 500, 500) // default
```

## Useful Actions

Use these action constants from the contract when recording payments:

```txt
ACTION_UPLOAD
ACTION_MINT
ACTION_TIP
ACTION_UNLOCK
ACTION_SUBSCRIPTION
```

The frontend helper in `lib/treasury.ts` computes the same bytes32 hashes.

## Useful Pools

Use these pool constants when funding or withdrawing from retained pools:

```txt
POOL_REWARDS
POOL_COMMUNITY
```

## Dashboard Indexing

For total volume, index `PaymentRecorded` events and sum `amount` by `token`.

For TVL, either:

- call `getProtocolTVL(token)` for creator escrow plus rewards plus community pool, or
- read actual balances with `getActualBalance(token)` if the dashboard wants total held value.

For treasury deposits that are not user payments, index `TreasuryFunded`.

## Operational Notes

- Creators withdraw their escrow with `withdrawCreatorBalance(token, amount)`.
- The owner or `rewardOperator` can distribute rewards with `distributePool`.
- The owner or protocol recipient can withdraw protocol revenue with `withdrawProtocolBalance`.
- Direct native sends are automatically credited to the community pool.
