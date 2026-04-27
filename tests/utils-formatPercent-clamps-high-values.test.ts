import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPercent } from '../lib/utils'

test('formatPercent clamps values above one hundred percent', () => {
  assert.equal(formatPercent(120), '100.0%')
})
