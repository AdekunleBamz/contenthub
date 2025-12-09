import { getReferralTag, submitReferral } from '@divvi/referral-sdk';

// Your Divvi Identifier (consumer address)
const DIVVI_CONSUMER = '0x7C98ab80D060cA57DD067712d0eD084A58f69c49';

/**
 * Generate a referral tag for tracking user activity
 * @param userAddress - The wallet address of the user
 * @returns The referral tag to append to transaction calldata
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
