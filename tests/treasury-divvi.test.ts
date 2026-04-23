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
