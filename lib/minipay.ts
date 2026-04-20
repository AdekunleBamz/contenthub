import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatEther,
  encodeFunctionData,
  parseUnits,
  fromHex,
  type Address,
} from 'viem';
import { celo, celoSepolia } from 'viem/chains';

// ─── Constants ───────────────────────────────────────────────────────────────

/** USDm (cUSD) on Celo mainnet */
export const USDM_ADDRESS: Address = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
/** USDC on Celo mainnet */
export const USDC_ADDRESS: Address = '0xcebA9300f2b948710d2653dD7B07f33A8B32118C';
/** USDT on Celo mainnet */
export const USDT_ADDRESS: Address = '0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e';

/** Default number of decimals for ERC-20 tokens (e.g. USDm, USDT). */
export const ERC20_DEFAULT_DECIMALS = 18;

/** Number of fractional digits to display in formatted token balances. */
export const ERC20_FRACTION_DISPLAY_DECIMALS = 6;

// Minimal ERC-20 ABI for balance + transfer (avoids @celo/abis import at runtime)
export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;

// ─── Environment helpers ──────────────────────────────────────────────────────

/** Returns true when running inside the MiniPay wallet. */
export function isMiniPay(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.ethereum && (window.ethereum as any).isMiniPay);
}

/** Returns the active chain based on MiniPay's testnet toggle (best-effort). */
export function getMiniPayChain() {
  // MiniPay injects window.ethereum; we can't read chainId synchronously,
  // so default to mainnet. Callers should switch on chainId from the provider.
  return celo;
}

/** Returns a shortened display version of an address, e.g. "0x1234...5678" */
export function formatAddress(address: string, start = 6, end = 4): string {
  if (!address || address.length < start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/** Returns true when two addresses are the same (case-insensitive). */
export function isSameAddress(a: string, b: string): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

// ─── Client factories ─────────────────────────────────────────────────────────

export function createMiniPayPublicClient(testnet = false) {
  return createPublicClient({
    chain: testnet ? celoSepolia : celo,
    transport: http(),
  });
}

export function createMiniPayWalletClient(testnet = false) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MiniPay wallet not available');
  }
  return createWalletClient({
    chain: testnet ? celoSepolia : celo,
    transport: custom(window.ethereum),
  });
}

// ─── Account ─────────────────────────────────────────────────────────────────

/** Requests and returns the connected MiniPay address. */
export async function getMiniPayAddress(): Promise<Address | null> {
  if (!isMiniPay()) return null;
  const accounts = (await (window.ethereum as any).request({
    method: 'eth_requestAccounts',
    params: [],
  })) as Address[];
  return accounts[0] ?? null;
}

// ─── Balances ─────────────────────────────────────────────────────────────────

/** Returns the USDm balance (in ether units) for a given address. */
export async function getUSDmBalance(
  publicClient: any,
  address: Address,
): Promise<string> {
  const raw = await publicClient.readContract({
    abi: ERC20_ABI,
    address: USDM_ADDRESS,
    functionName: 'balanceOf',
    args: [address],
  });
  return formatEther(raw);
}

/** Returns the balance (in ether units) for any ERC-20 on Celo. */
export async function getTokenBalance(
  publicClient: any,
  tokenAddress: Address,
  walletAddress: Address,
): Promise<string> {
  const raw: bigint = await publicClient.readContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [walletAddress],
  });
  const decimals: number = await publicClient.readContract({
    abi: ERC20_ABI,
    address: tokenAddress,
    functionName: 'decimals',
  });
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = raw / divisor;
  const fraction = raw % divisor;
  return `${whole}.${fraction.toString().padStart(Number(decimals), '0').slice(0, ERC20_FRACTION_DISPLAY_DECIMALS)}`;
}

// ─── Gas estimation ───────────────────────────────────────────────────────────

export async function estimateGas(
  publicClient: any,
  transaction: {
    account: Address;
    to: Address;
    value?: bigint | `0x${string}`;
    data?: `0x${string}`;
  },
  feeCurrency?: Address,
): Promise<bigint> {
  return publicClient.estimateGas({
    ...transaction,
    ...(feeCurrency ? { feeCurrency } : {}),
  } as any);
}

export async function estimateGasPrice(
  publicClient: any,
  feeCurrency?: Address,
): Promise<`0x${string}`> {
  return publicClient.request({
    method: 'eth_gasPrice',
    params: feeCurrency ? ([feeCurrency] as any) : [],
  });
}

/** Returns the estimated transaction fee in USDm (string). */
export async function estimateFeesInUSDm(
  publicClient: any,
  transaction: { account: Address; to: Address; value?: `0x${string}`; data?: `0x${string}` },
): Promise<string> {
  const gasLimit = await estimateGas(publicClient, transaction, USDM_ADDRESS);
  const gasPriceHex = await estimateGasPrice(publicClient, USDM_ADDRESS);
  const gasPrice = fromHex(gasPriceHex, 'bigint');
  return formatEther(gasLimit * gasPrice);
}

// ─── Transfers ────────────────────────────────────────────────────────────────

/**
 * Sends an ERC-20 token transfer via the MiniPay wallet.
 *
 * @param walletClient  - viem WalletClient backed by window.ethereum
 * @param publicClient  - viem PublicClient for receipt polling
 * @param tokenAddress  - ERC-20 contract address
 * @param receiver      - recipient address
 * @param amount        - human-readable amount (e.g. "1.5")
 * @param decimals      - token decimals (18 for USDm/USDT, 6 for USDC)
 * @returns             - transaction receipt
 */
export async function sendTokenTransfer(
  walletClient: any,
  publicClient: any,
  tokenAddress: Address,
  receiver: Address,
  amount: string,
  decimals = ERC20_DEFAULT_DECIMALS,
  /** When running inside MiniPay, pass USDM_ADDRESS to pay gas in USDm (fee abstraction). */
  feeCurrency?: Address,
) {
  const hash = await walletClient.sendTransaction({
    to: tokenAddress,
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [receiver, parseUnits(amount, decimals)],
    }),
    chain: walletClient.chain,
    account: walletClient.account!,
    // feeCurrency enables Celo fee abstraction – USDm inside MiniPay, omitted on web (uses CELO)
    ...(feeCurrency ? { feeCurrency } : {}),
  } as any);

  return publicClient.waitForTransactionReceipt({ hash });
}

// ─── Transaction status ───────────────────────────────────────────────────────

export async function checkTransactionSuccess(
  publicClient: any,
  txHash: `0x${string}`,
): Promise<boolean> {
  const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
  return receipt.status === 'success';
}
