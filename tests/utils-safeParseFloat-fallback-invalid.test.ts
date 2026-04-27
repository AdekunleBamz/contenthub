import test from 'node:test'
import assert from 'node:assert/strict'
import { safeParseFloat } from '../lib/utils'

test('safeParseFloat returns fallback for invalid values', () => {
  assert.equal(safeParseFloat('nope', 2.5), 2.5)
})
