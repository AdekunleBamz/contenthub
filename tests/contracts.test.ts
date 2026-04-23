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

test('isSupportedChain accepts Base mainnet', () => {
  assert.equal(isSupportedChain(BASE_CHAIN_ID), true)
})

test('isSupportedChain rejects testnets for uploads', () => {
  assert.equal(isSupportedChain(CELO_SEPOLIA_CHAIN_ID), false)
})

test('getContractsForChain returns Base contracts', () => {
  assert.equal(getContractsForChain(BASE_CHAIN_ID).communityContentHub.address.startsWith('0x'), true)
})

test('getContractsForChain rejects unsupported chains', () => {
  assert.throws(() => getContractsForChain(1), /Unsupported chain ID: 1/)
})

test('getExplorerUrl returns Base explorer URLs', () => {
  assert.equal(getExplorerUrl(BASE_CHAIN_ID), 'https://basescan.org')
})

test('getTxExplorerUrl trims transaction hashes', () => {
  assert.equal(getTxExplorerUrl(CELO_CHAIN_ID, '  0xabc  '), 'https://celoscan.io/tx/0xabc')
})

test('getAddressExplorerUrl trims contract addresses', () => {
  assert.equal(getAddressExplorerUrl(BASE_CHAIN_ID, '  0x123  '), 'https://basescan.org/address/0x123')
})

test('isBaseChain detects Base mainnet ids', () => {
  assert.equal(isBaseChain(BASE_CHAIN_ID), true)
})

test('isCeloChain detects Celo mainnet ids', () => {
  assert.equal(isCeloChain(CELO_CHAIN_ID), true)
})

test('isTestnet detects Celo Sepolia ids', () => {
  assert.equal(isTestnet(CELO_SEPOLIA_CHAIN_ID), true)
})

test('getChainKey resolves Base chain keys', () => {
  assert.equal(getChainKey(BASE_CHAIN_ID), 'base')
})
