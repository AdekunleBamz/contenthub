import test from 'node:test'
import assert from 'node:assert/strict'
import { clampDecimals } from '../lib/minipay'

test('clampDecimals preserves whole-number token strings', () => {
  assert.equal(clampDecimals('25'), '25')
})
