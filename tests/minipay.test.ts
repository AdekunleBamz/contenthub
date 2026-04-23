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
