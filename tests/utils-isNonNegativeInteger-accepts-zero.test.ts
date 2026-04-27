import test from 'node:test'
import assert from 'node:assert/strict'
import { isNonNegativeInteger } from '../lib/utils'

test('isNonNegativeInteger accepts zero values', () => {
  assert.equal(isNonNegativeInteger(0), true)
})
