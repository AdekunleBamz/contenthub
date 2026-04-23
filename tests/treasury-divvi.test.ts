import test from 'node:test'
import assert from 'node:assert/strict'
import {
  formatTreasuryBps,
  getTreasuryActionHash,
  getTreasuryPoolHash,
  toTreasuryReferenceId,
} from '../lib/treasury'
import {
  getDivviConsumerAddress,
  isValidTxHash,
} from '../lib/divvi'
import {
  CONTENT_FEE_WEI,
  getUploadFee,
} from '../lib/contracts'

test('getTreasuryActionHash returns upload action hashes', () => {
  assert.match(getTreasuryActionHash('upload'), /^0x[a-fA-F0-9]{64}$/)
})

test('getTreasuryPoolHash returns rewards pool hashes', () => {
  assert.match(getTreasuryPoolHash('rewards'), /^0x[a-fA-F0-9]{64}$/)
})

test('formatTreasuryBps formats whole percentages', () => {
  assert.equal(formatTreasuryBps(500), '5%')
})

test('formatTreasuryBps keeps fractional percentages', () => {
  assert.equal(formatTreasuryBps(525), '5.25%')
})

test('toTreasuryReferenceId defaults missing references to zero', () => {
  assert.equal(toTreasuryReferenceId(null), 0n)
})

test('toTreasuryReferenceId converts numeric references', () => {
  assert.equal(toTreasuryReferenceId(7), 7n)
})

test('getDivviConsumerAddress returns a configured EVM address', () => {
  assert.match(getDivviConsumerAddress(), /^0x[a-fA-F0-9]{40}$/)
})

test('isValidTxHash accepts full transaction hashes', () => {
  assert.equal(isValidTxHash(`0x${'a'.repeat(64)}`), true)
})

test('isValidTxHash rejects short transaction hashes', () => {
  assert.equal(isValidTxHash('0xabc'), false)
})
