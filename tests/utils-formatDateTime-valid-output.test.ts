import test from 'node:test'
import assert from 'node:assert/strict'
import { formatDateTime } from '../lib/utils'

test('formatDateTime returns output for valid timestamps', () => {
  assert.equal(formatDateTime(1).length > 0, true)
})
