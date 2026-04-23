import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildIpfsUrl,
  bytesToMb,
  capitalize,
  clamp,
  formatDate,
  formatFileSize,
  formatNumber,
  formatWei,
  getInitials,
  ipfsToHttp,
  isAllowedMimeType,
  isNonEmptyString,
  isPositiveInteger,
  isValidAddress,
  isValidCid,
  isValidDescription,
  isValidFileSize,
  isValidTags,
  isValidTitle,
  isZeroAddress,
  omit,
  pick,
  pluralize,
  range,
  safeJsonParse,
  shortAddress,
  toSlug,
  truncate,
  uniqueBy,
} from '../lib/utils'

test('shortAddress truncates long addresses', () => {
  assert.equal(shortAddress('0x1234567890abcdef1234567890abcdef12345678'), '0x1234...5678')
})

test('shortAddress leaves short values unchanged', () => {
  assert.equal(shortAddress('0x1234'), '0x1234')
})

test('isZeroAddress detects the configured zero address', () => {
  assert.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
})
