import test from 'node:test'
import assert from 'node:assert/strict'
import { stripIpfsPrefix } from '../lib/utils'

test('stripIpfsPrefix keeps plain CID values unchanged', () => {
  assert.equal(stripIpfsPrefix('bafy123'), 'bafy123')
})
