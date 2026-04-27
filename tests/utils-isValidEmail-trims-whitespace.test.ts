import test from 'node:test'
import assert from 'node:assert/strict'
import { isValidEmail } from '../lib/utils'

test('isValidEmail accepts valid emails with surrounding whitespace', () => {
  assert.equal(isValidEmail('  creator@example.com  '), true)
})
