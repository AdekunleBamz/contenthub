import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPercent } from '../lib/utils'

test('formatPercent clamps negative values to zero', () => {
  assert.equal(formatPercent(-12), '0.0%')
})
