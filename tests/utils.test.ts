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

test('isValidFileSize accepts files at the size limit', () => {
  assert.equal(isValidFileSize(50 * 1024 * 1024), true)
})

test('isValidFileSize rejects empty files', () => {
  assert.equal(isValidFileSize(0), false)
})

test('formatFileSize formats raw byte counts', () => {
  assert.equal(formatFileSize(512), '512 B')
})

test('formatFileSize formats kilobytes', () => {
  assert.equal(formatFileSize(2048), '2.0 KB')
})

test('formatFileSize formats megabytes', () => {
  assert.equal(formatFileSize(2 * 1024 * 1024), '2.0 MB')
})

test('isAllowedMimeType accepts configured image uploads', () => {
  assert.equal(isAllowedMimeType('image/png'), true)
})

test('isAllowedMimeType rejects unknown uploads', () => {
  assert.equal(isAllowedMimeType('application/x-msdownload'), false)
})

test('isValidDescription accepts short descriptions', () => {
  assert.equal(isValidDescription('Short description'), true)
})

test('isValidDescription rejects overly long descriptions', () => {
  assert.equal(isValidDescription('x'.repeat(501)), false)
})

test('isValidTitle accepts trimmed titles', () => {
  assert.equal(isValidTitle('  Mint update  '), true)
})

test('isValidTitle rejects blank titles', () => {
  assert.equal(isValidTitle('   '), false)
})

test('isValidTags accepts bounded tag lists', () => {
  assert.equal(isValidTags(['art', 'music']), true)
})

test('isValidTags rejects short tags', () => {
  assert.equal(isValidTags(['a']), false)
})

test('buildIpfsUrl supports custom gateways', () => {
  assert.equal(buildIpfsUrl('cid', 'https://gateway.example/ipfs/'), 'https://gateway.example/ipfs/cid')
})

test('clamp raises values below the minimum', () => {
  assert.equal(clamp(-5, 0, 10), 0)
})

test('clamp lowers values above the maximum', () => {
  assert.equal(clamp(15, 0, 10), 10)
})

test('clamp handles reversed bounds conservatively', () => {
  assert.equal(clamp(5, 10, 0), 10)
})
