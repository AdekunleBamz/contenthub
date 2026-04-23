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

test('formatAddress trims MiniPay addresses before truncating', () => {
  assert.equal(formatAddress('  0x1234567890abcdef1234567890abcdef12345678  '), '0x1234...5678')
})

test('formatAddress leaves short MiniPay values unchanged', () => {
  assert.equal(formatAddress('0x1234'), '0x1234')
})

test('formatAddress supports custom MiniPay slice lengths', () => {
  assert.equal(formatAddress('0x1234567890abcdef1234567890abcdef12345678', 8, 6), '0x123456...345678')
})

test('isSameAddress matches MiniPay addresses by value', () => {
  assert.equal(isSameAddress('0x1234567890abcdef1234567890abcdef12345678', '0x1234567890ABCDEF1234567890ABCDEF12345678'), true)
})

test('isSameAddress trims MiniPay address comparisons', () => {
  assert.equal(isSameAddress('  0x1234567890abcdef1234567890abcdef12345678', '0x1234567890abcdef1234567890abcdef12345678  '), true)
})

test('isSameAddress rejects blank MiniPay comparisons', () => {
  assert.equal(isSameAddress('', '0x1234567890abcdef1234567890abcdef12345678'), false)
})

test('isZeroAddress detects MiniPay zero addresses', () => {
  assert.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
})

test('isZeroAddress normalizes MiniPay zero addresses', () => {
  assert.equal(isZeroAddress('  0X0000000000000000000000000000000000000000  '), true)
})

test('isCeloMainnet detects Celo mainnet ids', () => {
  assert.equal(isCeloMainnet(42220), true)
})

test('isCeloMainnet rejects Alfajores ids', () => {
  assert.equal(isCeloMainnet(11142220), false)
})

test('isCeloTestnet detects Celo Sepolia ids', () => {
  assert.equal(isCeloTestnet(11142220), true)
})

test('isCeloTestnet rejects Celo mainnet ids', () => {
  assert.equal(isCeloTestnet(42220), false)
})

test('getChainName labels Celo mainnet', () => {
  assert.equal(getChainName(42220), 'Celo')
})

test('getChainName labels Celo Alfajores', () => {
  assert.equal(getChainName(11142220), 'Celo Alfajores')
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

test('isValidAddress rejects uppercase MiniPay prefixes', () => {
  assert.equal(isValidAddress('0X1234567890abcdef1234567890abcdef12345678'), false)
})

test('isUsableAddress rejects zero MiniPay addresses', () => {
  assert.equal(isUsableAddress('0x0000000000000000000000000000000000000000'), false)
})

test('getWalletEnvLabel defaults to browser wallets', () => {
  assert.equal(getWalletEnvLabel(), 'Browser Wallet')
})

test('clampDecimals limits token fractions', () => {
  assert.equal(clampDecimals('1.123456789', 4), '1.1234')
})

test('clampDecimals leaves whole token amounts unchanged', () => {
  assert.equal(clampDecimals('12'), '12')
})

test('parseTokenAmount parses whole token amounts', () => {
  assert.equal(parseTokenAmount('2', 6), 2_000_000n)
})

test('parseTokenAmount parses fractional token amounts', () => {
  assert.equal(parseTokenAmount('1.25', 6), 1_250_000n)
})

test('getUSDCAddress returns the configured USDC address', () => {
  assert.equal(getUSDCAddress(), '0xcebA9300f2b948710d2653dD7B07f33A8B32118C')
})
