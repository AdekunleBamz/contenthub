import test from 'node:test'
import assert from 'node:assert/strict'
import { stripIpfsPrefix } from '../lib/utils'

test('stripIpfsPrefix removes the ipfs:// scheme prefix', () => {
  assert.equal(stripIpfsPrefix('ipfs://bafy123'), 'bafy123')
})
