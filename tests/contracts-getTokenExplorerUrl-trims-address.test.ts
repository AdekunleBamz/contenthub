import test from 'node:test'
import assert from 'node:assert/strict'
import { CELO_CHAIN_ID, getTokenExplorerUrl } from '../lib/contracts'

test('getTokenExplorerUrl trims token address input', () => {
  assert.equal(getTokenExplorerUrl(CELO_CHAIN_ID, ' 0xabc '), 'https://celoscan.io/token/0xabc')
})
