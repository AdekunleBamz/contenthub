import { getReferralTag, submitReferral } from '@divvi/referral-sdk';

// Your Divvi Identifier (consumer address)
const DIVVI_CONSUMER = '0x7C98ab80D060cA57DD067712d0eD084A58f69c49';

/**
 * Generates a unique referral tag used for tracking user activity through Divvi.
 * The tag is designed to be appended to transaction calldata for on-chain attribution.
 * 
 * @param userAddress - The wallet address of the user initiating the action.
 * @returns A referral tag string, or '0x' if generation fails.
 */
export function getDivviReferralTag(userAddress: string): string {
  try {
    return getReferralTag({
      user: userAddress as `0x${string}`,
      consumer: DIVVI_CONSUMER,
    });
  } catch (error) {
    console.error('Failed to generate Divvi referral tag:', error);
    return '0x'; // Return empty hex string if it fails
  }
}

/**
 * Submit a transaction to Divvi for referral tracking
 * @param txHash - The transaction hash
 * @param chainId - The chain ID where the transaction was sent
 */
export async function submitDivviReferral(txHash: string, chainId: number): Promise<void> {
  try {
    await submitReferral({
      txHash: txHash as any,
      chainId,
    });
    console.log('✅ Divvi referral submitted:', txHash);
  } catch (error) {
    console.error('Failed to submit Divvi referral:', error);
    // Don't throw - we don't want to disrupt user experience if Divvi tracking fails
  }
}

/** Returns the Divvi consumer address used for this app. */
export function getDivviConsumerAddress(): string {
  return DIVVI_CONSUMER;
}

/** Returns true when txHash is a non-empty hex string. */
export function isValidTxHash(txHash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash.trim());
}
