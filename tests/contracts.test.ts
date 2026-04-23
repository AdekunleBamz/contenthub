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

test('getNetworkName labels Celo mainnet', () => {
  assert.equal(getNetworkName(CELO_CHAIN_ID), 'Celo')
})

test('getNetworkName labels unknown chains', () => {
  assert.equal(getNetworkName(1), 'Unknown')
})

test('isSupportedChain accepts Base mainnet', () => {
  assert.equal(isSupportedChain(BASE_CHAIN_ID), true)
})

test('isSupportedChain accepts Celo mainnet', () => {
  assert.equal(isSupportedChain(CELO_CHAIN_ID), true)
})

test('isSupportedChain rejects testnets for uploads', () => {
  assert.equal(isSupportedChain(CELO_SEPOLIA_CHAIN_ID), false)
})

test('getContractsForChain returns Base contracts', () => {
  assert.equal(getContractsForChain(BASE_CHAIN_ID).communityContentHub.address.startsWith('0x'), true)
})

test('getContractsForChain returns Celo contracts', () => {
  assert.equal(getContractsForChain(CELO_CHAIN_ID).contentNFT.address.startsWith('0x'), true)
})

test('getContractsForChain rejects unsupported chains', () => {
  assert.throws(() => getContractsForChain(1), /Unsupported chain ID: 1/)
})

test('getExplorerUrl returns Base explorer URLs', () => {
  assert.equal(getExplorerUrl(BASE_CHAIN_ID), 'https://basescan.org')
})

test('getExplorerUrl returns Celo explorer URLs', () => {
  assert.equal(getExplorerUrl(CELO_CHAIN_ID), 'https://celoscan.io')
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

test('isBaseChain rejects Celo mainnet ids', () => {
  assert.equal(isBaseChain(CELO_CHAIN_ID), false)
})

test('isCeloChain detects Celo mainnet ids', () => {
  assert.equal(isCeloChain(CELO_CHAIN_ID), true)
})

test('isCeloChain rejects Base mainnet ids', () => {
  assert.equal(isCeloChain(BASE_CHAIN_ID), false)
})

test('isTestnet detects Celo Sepolia ids', () => {
  assert.equal(isTestnet(CELO_SEPOLIA_CHAIN_ID), true)
})

test('getChainKey resolves Base chain keys', () => {
  assert.equal(getChainKey(BASE_CHAIN_ID), 'base')
})

test('getChainKey returns null for unknown chains', () => {
  assert.equal(getChainKey(1), null)
})

test('isTreasuryConfigured returns false before Base treasury deployment', () => {
  assert.equal(isTreasuryConfigured('base'), false)
})

test('isTreasuryConfigured detects configured Celo treasury', () => {
  assert.equal(isTreasuryConfigured('celo'), true)
})

test('getTreasuryAddress returns null for Base treasury', () => {
  assert.equal(getTreasuryAddress('base'), null)
})

test('getTreasuryAddress returns the Celo treasury address', () => {
  assert.equal(getTreasuryAddress('celo')?.startsWith('0x'), true)
})

test('isSupportedChainKey accepts deployed chain keys', () => {
  assert.equal(isSupportedChainKey('celo'), true)
})

test('isSupportedChainKey rejects unknown chain keys', () => {
  assert.equal(isSupportedChainKey('ethereum'), false)
})
