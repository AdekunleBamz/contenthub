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
