import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatAddress,
  getChainName,
  getUSDCAddress,
  getWalletEnvLabel,
  isCeloMainnet,
  isCeloTestnet,
  isMiniPay,
  isSameAddress,
  isUsableAddress,
  isValidAddress,
  isZeroAddress,
  clampDecimals,
  normalizeAddress,
  parseTokenAmount,
} from '../lib/minipay'

test('isMiniPay returns false outside browser wallets', () => {
  assert.equal(isMiniPay(), false)
})

test('formatAddress truncates long MiniPay addresses', () => {
  assert.equal(formatAddress('0x1234567890abcdef1234567890abcdef12345678'), '0x1234...5678')
})

test('formatAddress leaves short MiniPay values unchanged', () => {
  assert.equal(formatAddress('0x1234'), '0x1234')
})

test('isSameAddress matches MiniPay addresses by value', () => {
  assert.equal(isSameAddress('0x1234567890abcdef1234567890abcdef12345678', '0x1234567890ABCDEF1234567890ABCDEF12345678'), true)
})

test('isSameAddress rejects blank MiniPay comparisons', () => {
  assert.equal(isSameAddress('', '0x1234567890abcdef1234567890abcdef12345678'), false)
})

test('isZeroAddress detects MiniPay zero addresses', () => {
  assert.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
})

test('isCeloMainnet detects Celo mainnet ids', () => {
  assert.equal(isCeloMainnet(42220), true)
})

test('isCeloTestnet detects Alfajores ids', () => {
  assert.equal(isCeloTestnet(44787), true)
})

test('getChainName labels Celo mainnet', () => {
  assert.equal(getChainName(42220), 'Celo')
})

test('getChainName labels unknown chains', () => {
  assert.equal(getChainName(1), 'Unknown')
})

test('normalizeAddress trims and lowercases values', () => {
  assert.equal(normalizeAddress('  0xABCDEFabcdefABCDEFabcdefABCDEFabcdefabcd  '), '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
})

test('isValidAddress accepts MiniPay EVM addresses', () => {
  assert.equal(isValidAddress('0x1234567890abcdef1234567890abcdef12345678'), true)
})

test('isValidAddress rejects malformed MiniPay addresses', () => {
  assert.equal(isValidAddress('0x1234'), false)
})

test('isUsableAddress rejects zero MiniPay addresses', () => {
  assert.equal(isUsableAddress('0x0000000000000000000000000000000000000000'), false)
})

test('getWalletEnvLabel defaults to browser wallets', () => {
  assert.equal(getWalletEnvLabel(), 'Browser Wallet')
})
