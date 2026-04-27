import test from 'node:test'
import assert from 'node:assert/strict'
import { weiToEther } from '../lib/utils'

test('weiToEther returns zero for non-positive values', () => {
  assert.equal(weiToEther(0n), 0)
  assert.equal(weiToEther(-1n), 0)
})
