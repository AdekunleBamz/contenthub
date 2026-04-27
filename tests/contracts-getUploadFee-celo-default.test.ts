import test from 'node:test'
import assert from 'node:assert/strict'
import { getUploadFee } from '../lib/contracts'

test('getUploadFee resolves a positive fee for Celo', () => {
  assert.equal(getUploadFee('celo') > 0n, true)
})
