import test from 'node:test'
import assert from 'node:assert/strict'
import { groupBy } from '../lib/utils'

test('groupBy groups items by derived key', () => {
  const grouped = groupBy([{ k: 'a' }, { k: 'b' }, { k: 'a' }], (item) => item.k)
  assert.deepEqual(grouped, { a: [{ k: 'a' }, { k: 'a' }], b: [{ k: 'b' }] })
})
