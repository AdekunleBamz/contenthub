import test from 'node:test'
import assert from 'node:assert/strict'
import { formatDateTime } from '../lib/utils'

test('formatDateTime returns blank output for invalid timestamps', () => {
  assert.equal(formatDateTime(0), '')
})
