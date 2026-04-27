import test from 'node:test'
import assert from 'node:assert/strict'
import { isUsableAddress } from '../lib/minipay'

test('isUsableAddress rejects malformed addresses', () => {
  assert.equal(isUsableAddress('0x1234'), false)
})
