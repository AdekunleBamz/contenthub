import test from 'node:test'
import assert from 'node:assert/strict'
import { parseTokenAmount } from '../lib/minipay'

test('parseTokenAmount supports zero-decimal tokens', () => {
  assert.equal(parseTokenAmount('12', 0), 12n)
})
