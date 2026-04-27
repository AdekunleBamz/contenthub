import test from 'node:test'
import assert from 'node:assert/strict'
import { compact } from '../lib/utils'

test('compact filters null, undefined, and false values', () => {
  assert.deepEqual(compact([0, null, false, 2, undefined]), [0, 2])
})
