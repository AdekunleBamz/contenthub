import { keccak256, stringToHex, type Hex } from 'viem';
import { ZERO_ADDRESS } from './constants';

export const TREASURY_NATIVE_TOKEN = ZERO_ADDRESS;

export const TREASURY_ACTIONS = {
  upload: keccak256(stringToHex('UPLOAD')),
  mint: keccak256(stringToHex('MINT')),
  tip: keccak256(stringToHex('TIP')),
  unlock: keccak256(stringToHex('UNLOCK')),
  subscription: keccak256(stringToHex('SUBSCRIPTION')),
} as const;

export const TREASURY_POOLS = {
  rewards: keccak256(stringToHex('REWARDS')),
  community: keccak256(stringToHex('COMMUNITY')),
} as const;

export const DEFAULT_TREASURY_SPLIT_BPS = {
  creator: 7_000,
  rewards: 2_000,
  community: 500,
  protocol: 500,
} as const;

export type TreasuryAction = keyof typeof TREASURY_ACTIONS;
export type TreasuryPool = keyof typeof TREASURY_POOLS;

export function getTreasuryActionHash(action: TreasuryAction): Hex {
  return TREASURY_ACTIONS[action];
}

export function getTreasuryPoolHash(pool: TreasuryPool): Hex {
  return TREASURY_POOLS[pool];
}

export function formatTreasuryBps(bps: number): string {
  return `${(bps / 100).toFixed(2).replace(/\.00$/, '')}%`;
}

export function toTreasuryReferenceId(referenceId?: number | bigint | null): bigint {
  if (referenceId === null || referenceId === undefined) return 0n;
  return BigInt(referenceId);
}

/** Returns true when action is a recognised treasury action key. */
export function isSupportedTreasuryAction(action: string): action is TreasuryAction {
  return Object.keys(TREASURY_ACTIONS).includes(action);
}
