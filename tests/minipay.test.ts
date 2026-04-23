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
