import test from 'node:test'
import assert from 'node:assert/strict'
import { getUploadFeeWei } from '../lib/contracts'

test('getUploadFeeWei returns fee values as bigint', () => {
  assert.equal(typeof getUploadFeeWei(), 'bigint')
})
