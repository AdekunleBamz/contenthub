'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { celo, celoSepolia } from 'viem/chains';
import {
  isMiniPay,
  getMiniPayAddress,
  getUSDmBalance,
  getTokenBalance,
  createMiniPayPublicClient,
  createMiniPayWalletClient,
  sendTokenTransfer,
  USDM_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  type Address,
} from '@/lib/minipay';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Balances {
  usdm: string;
  usdc: string;
  usdt: string;
}

interface TransferForm {
  token: 'usdm' | 'usdc' | 'usdt';
  recipient: string;
  amount: string;
}

const TOKEN_META = {
  usdm: { label: 'USDm', address: USDM_ADDRESS, decimals: 18, color: 'green' },
  usdc: { label: 'USDC', address: USDC_ADDRESS, decimals: 6, color: 'blue' },
  usdt: { label: 'USDT', address: USDT_ADDRESS, decimals: 18, color: 'teal' },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MiniPayPage() {
  const { address: wagmiAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [miniPayAddress, setMiniPayAddress] = useState<Address | null>(null);
  const [isInMiniPay, setIsInMiniPay] = useState(false);
  const [balances, setBalances] = useState<Balances>({ usdm: '0', usdc: '0', usdt: '0' });
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [form, setForm] = useState<TransferForm>({ token: 'usdm', recipient: '', amount: '' });
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [txError, setTxError] = useState<string>('');

  const isTestnet = chainId === celoSepolia.id;

  // ── Detect MiniPay & resolve address ────────────────────────────────────────
  useEffect(() => {
    const detect = async () => {
      const detected = isMiniPay();
      setIsInMiniPay(detected);

      if (detected) {
        const addr = await getMiniPayAddress();
        setMiniPayAddress(addr);
      } else if (wagmiAddress) {
        setMiniPayAddress(wagmiAddress as Address);
      }
    };
    detect();
  }, [wagmiAddress]);

  // ── Load balances ────────────────────────────────────────────────────────────
  const loadBalances = useCallback(async () => {
    const addr = miniPayAddress ?? (wagmiAddress as Address | undefined);
    if (!addr) return;

    setLoadingBalances(true);
    try {
      const client = createMiniPayPublicClient(isTestnet);

      const [usdm, usdc, usdt] = await Promise.all([
        getUSDmBalance(client, addr),
        getTokenBalance(client, USDC_ADDRESS, addr),
        getTokenBalance(client, USDT_ADDRESS, addr),
      ]);

      setBalances({ usdm, usdc, usdt });
    } catch (err) {
      console.error('Failed to load balances', err);
    } finally {
      setLoadingBalances(false);
    }
  }, [miniPayAddress, wagmiAddress, isTestnet]);

  useEffect(() => {
    loadBalances();
  }, [loadBalances]);

  // ── Send transfer ────────────────────────────────────────────────────────────
  const handleTransfer = async () => {
    if (!form.recipient || !form.amount) return;

    setTxStatus('pending');
    setTxError('');
    setTxHash('');

    try {
      const walletClient = createMiniPayWalletClient(isTestnet);
      const publicClient = createMiniPayPublicClient(isTestnet);
      const meta = TOKEN_META[form.token];

      // Inside MiniPay: pay gas in USDm via Celo fee abstraction.
      // On regular web (Celo): feeCurrency is omitted and CELO covers gas.
      const receipt = await sendTokenTransfer(
        walletClient,
        publicClient,
        meta.address,
        form.recipient as Address,
        form.amount,
        meta.decimals,
        isInMiniPay ? USDM_ADDRESS : undefined,
      );

      setTxHash(receipt.transactionHash);
      setTxStatus(receipt.status === 'success' ? 'success' : 'error');

      if (receipt.status === 'success') {
        await loadBalances();
        setForm((f) => ({ ...f, recipient: '', amount: '' }));
      } else {
        setTxError('Transaction reverted on-chain.');
      }
    } catch (err: any) {
      setTxStatus('error');
      setTxError(err?.shortMessage ?? err?.message ?? 'Unknown error');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const activeAddress = miniPayAddress ?? wagmiAddress;

  if (!isConnected && !isInMiniPay) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-3">MiniPay Dashboard</h2>
          <p className="text-gray-400 mb-6">
            Open this app inside the MiniPay wallet to get started, or connect your wallet above.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.opera.minipay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-semibold transition-colors"
          >
            Download MiniPay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">📱</span>
        <div>
          <h1 className="text-3xl font-bold">MiniPay Dashboard</h1>
          {isInMiniPay && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full px-2 py-0.5">
              Running inside MiniPay
            </span>
          )}
        </div>
      </div>

      {/* Network toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchChain({ chainId: celo.id })}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !isTestnet
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Celo Mainnet
        </button>
        <button
          onClick={() => switchChain({ chainId: celoSepolia.id })}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isTestnet
              ? 'bg-yellow-500 text-black'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Celo Sepolia (Testnet)
        </button>
      </div>

      {/* Address card */}
      {activeAddress && (
        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 mb-6">
          <p className="text-xs text-gray-500 mb-1">Connected address</p>
          <p className="font-mono text-sm text-gray-300 break-all">{activeAddress}</p>
        </div>
      )}

      {/* Balances */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Stablecoin Balances</h2>
          <button
            onClick={loadBalances}
            disabled={loadingBalances}
            className="text-xs text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            {loadingBalances ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(TOKEN_META) as [keyof typeof TOKEN_META, (typeof TOKEN_META)[keyof typeof TOKEN_META]][]).map(
            ([key, meta]) => (
              <div key={key} className="p-4 bg-gray-900 rounded-xl border border-gray-800 text-center">
                <p className="text-xs text-gray-500 mb-1">{meta.label}</p>
                <p className="text-xl font-bold text-white">
                  {loadingBalances ? '…' : parseFloat(balances[key]).toFixed(4)}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Transfer form */}
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Send Stablecoins</h2>

        {/* Token selector */}
        <div className="flex gap-2 mb-4">
          {(Object.keys(TOKEN_META) as (keyof typeof TOKEN_META)[]).map((key) => (
            <button
              key={key}
              onClick={() => setForm((f) => ({ ...f, token: key }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                form.token === key
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {TOKEN_META[key].label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient address</label>
            <input
              type="text"
              placeholder="0x…"
              value={form.recipient}
              onChange={(e) => setForm((f) => ({ ...f, recipient: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Amount ({TOKEN_META[form.token].label})
            </label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={txStatus === 'pending' || !form.recipient || !form.amount}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            {txStatus === 'pending' ? 'Sending…' : `Send ${TOKEN_META[form.token].label}`}
          </button>
        </div>

        {/* Transaction feedback */}
        {txStatus === 'success' && txHash && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-500/40 rounded-lg">
            <p className="text-green-400 text-sm font-medium mb-1">Transaction successful!</p>
            <a
              href={`https://${isTestnet ? 'alfajores.' : ''}celoscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-300 hover:text-green-100 font-mono break-all"
            >
              {txHash}
            </a>
          </div>
        )}

        {txStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500/40 rounded-lg">
            <p className="text-red-400 text-sm font-medium">Transaction failed</p>
            {txError && <p className="text-xs text-red-300 mt-1">{txError}</p>}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-xl">
        <p className="text-xs text-yellow-300/80">
          MiniPay supports USDm fee abstraction — gas fees are paid in stablecoins, no CELO required.
          Only legacy transactions are used (EIP-1559 properties are ignored).
        </p>
      </div>
    </div>
  );
}
