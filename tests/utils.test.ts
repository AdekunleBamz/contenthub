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

test('isZeroAddress rejects non-zero addresses', () => {
  assert.equal(isZeroAddress('0x1234567890abcdef1234567890abcdef12345678'), false)
})

test('isValidCid accepts CIDv0 strings', () => {
  assert.equal(isValidCid(`Qm${'a'.repeat(44)}`), true)
})

test('isValidCid rejects blank values', () => {
  assert.equal(isValidCid(''), false)
})

test('ipfsToHttp trims CIDs for gateway links', () => {
  assert.equal(ipfsToHttp('  bafytest  '), 'https://ipfs.io/ipfs/bafytest')
})
