import test from 'node:test'
import assert from 'node:assert/strict'
import { isNonNegativeInteger } from '../lib/utils'

test('isNonNegativeInteger rejects negative numbers', () => {
  assert.equal(isNonNegativeInteger(-1), false)
})
