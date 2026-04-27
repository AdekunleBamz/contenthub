import test from 'node:test'
import assert from 'node:assert/strict'
import { safeParseFloat } from '../lib/utils'

test('safeParseFloat parses valid numeric strings', () => {
  assert.equal(safeParseFloat(' 1.25 '), 1.25)
})
