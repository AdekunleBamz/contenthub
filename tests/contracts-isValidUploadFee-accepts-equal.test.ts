import test from 'node:test'
import assert from 'node:assert/strict'
import { getUploadFee, isValidUploadFee } from '../lib/contracts'

test('isValidUploadFee accepts exact required fee amounts', () => {
  const required = getUploadFee('celo')
  assert.equal(isValidUploadFee(required, 'celo'), true)
})
