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
  if (!userAddress || !userAddress.trim()) return '0x';
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
 * Submits a transaction hash to the Divvi service for referral tracking and indexing.
 * This process is non-blocking to ensure the user experience remains smooth even if tracking fails.
 * 
 * @param txHash - The unique hash of the transaction to track.
 * @param chainId - The blockchain network ID where the transaction occurred.
 * @returns A Promise that resolves when the submission attempt is complete.
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

/**
 * Retrieves the constant Divvi consumer address configured for ContentHub.
 * This address is used to identify the application in the Divvi ecosystem.
 * 
 * @returns The EVM address string of the configured consumer.
 */
export function getDivviConsumerAddress(): string {
  return DIVVI_CONSUMER;
}

/** Returns true when txHash is a non-empty hex string. */
export function isValidTxHash(txHash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash.trim());
}
