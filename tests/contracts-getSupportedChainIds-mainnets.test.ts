import test from 'node:test'
import assert from 'node:assert/strict'
import { BASE_CHAIN_ID, CELO_CHAIN_ID, getSupportedChainIds } from '../lib/contracts'

test('getSupportedChainIds returns Base and Celo mainnet ids', () => {
  assert.deepEqual(getSupportedChainIds(), [BASE_CHAIN_ID, CELO_CHAIN_ID])
})
