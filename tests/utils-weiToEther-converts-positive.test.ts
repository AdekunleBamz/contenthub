import test from 'node:test'
import assert from 'node:assert/strict'
import { weiToEther } from '../lib/utils'

test('weiToEther converts positive wei values to ether', () => {
  assert.equal(weiToEther(1_500_000_000_000_000_000n), 1.5)
})
