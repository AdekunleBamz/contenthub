import test from 'node:test'
import assert from 'node:assert/strict'
import {
  BASE_CHAIN_ID,
  CELO_CHAIN_ID,
  CELO_SEPOLIA_CHAIN_ID,
  getAddressExplorerUrl,
  getChainKey,
  getContractsForChain,
  getExplorerUrl,
  getNetworkName,
  getTreasuryAddress,
  getTxExplorerUrl,
  isBaseChain,
  isCeloChain,
  isSupportedChain,
  isSupportedChainKey,
  isTestnet,
  isTreasuryConfigured,
} from '../lib/contracts'

test('getNetworkName labels Base mainnet', () => {
  assert.equal(getNetworkName(BASE_CHAIN_ID), 'Base')
})

test('getNetworkName labels unknown chains', () => {
  assert.equal(getNetworkName(1), 'Unknown')
})
