import test from 'node:test'
import assert from 'node:assert/strict'
import { getUploadFee, isValidUploadFee } from '../lib/contracts'

test('isValidUploadFee rejects fees below required amount', () => {
  const required = getUploadFee('celo')
  assert.equal(isValidUploadFee(required - 1n, 'celo'), false)
})
