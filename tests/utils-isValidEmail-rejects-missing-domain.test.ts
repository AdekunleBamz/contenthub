import test from 'node:test'
import assert from 'node:assert/strict'
import { isValidEmail } from '../lib/utils'

test('isValidEmail rejects addresses without a top-level domain', () => {
  assert.equal(isValidEmail('creator@example'), false)
})
