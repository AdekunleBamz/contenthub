import test from 'node:test'
import assert from 'node:assert/strict'
import { CELO_SEPOLIA_CHAIN_ID, isCeloTestnet } from '../lib/contracts'

test('isCeloTestnet detects Celo Sepolia chain ids', () => {
  assert.equal(isCeloTestnet(CELO_SEPOLIA_CHAIN_ID), true)
})
