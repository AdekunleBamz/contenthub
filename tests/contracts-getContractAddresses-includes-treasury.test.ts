import test from 'node:test'
import assert from 'node:assert/strict'
import { getContractAddresses } from '../lib/contracts'

test('getContractAddresses includes treasury address fields', () => {
  const contracts = getContractAddresses('celo')
  assert.equal('contentHubTreasury' in contracts, true)
})
