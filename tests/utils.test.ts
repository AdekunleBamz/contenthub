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

test('shortAddress trims values before truncating', () => {
  assert.equal(shortAddress('  0x1234567890abcdef1234567890abcdef12345678  '), '0x1234...5678')
})

test('isZeroAddress detects the configured zero address', () => {
  assert.equal(isZeroAddress('0x0000000000000000000000000000000000000000'), true)
})

test('isZeroAddress normalizes zero address values', () => {
  assert.equal(isZeroAddress('  0X0000000000000000000000000000000000000000  '), true)
})

test('isZeroAddress rejects non-zero addresses', () => {
  assert.equal(isZeroAddress('0x1234567890abcdef1234567890abcdef12345678'), false)
})

test('isValidCid accepts CIDv0 strings', () => {
  assert.equal(isValidCid(`Qm${'a'.repeat(44)}`), true)
})

test('isValidCid accepts trimmed CIDv0 strings', () => {
  assert.equal(isValidCid(`  Qm${'a'.repeat(44)}  `), true)
})

test('isValidCid rejects blank values', () => {
  assert.equal(isValidCid(''), false)
})

test('ipfsToHttp trims CIDs for gateway links', () => {
  assert.equal(ipfsToHttp('  bafytest  '), 'https://ipfs.io/ipfs/bafytest')
})

test('ipfsToHttp returns blank output for whitespace CIDs', () => {
  assert.equal(ipfsToHttp('   '), '')
})

test('isValidFileSize accepts files at the size limit', () => {
  assert.equal(isValidFileSize(50 * 1024 * 1024), true)
})

test('isValidFileSize rejects files above the size limit', () => {
  assert.equal(isValidFileSize(51 * 1024 * 1024), false)
})

test('isValidFileSize rejects empty files', () => {
  assert.equal(isValidFileSize(0), false)
})

test('formatFileSize formats raw byte counts', () => {
  assert.equal(formatFileSize(512), '512 B')
})

test('formatFileSize formats zero byte counts', () => {
  assert.equal(formatFileSize(0), '0 B')
})

test('formatFileSize formats negative byte counts as zero', () => {
  assert.equal(formatFileSize(-10), '0 B')
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

test('isAllowedMimeType normalizes upload MIME text', () => {
  assert.equal(isAllowedMimeType('  IMAGE/PNG  '), true)
})

test('isAllowedMimeType rejects unknown uploads', () => {
  assert.equal(isAllowedMimeType('application/x-msdownload'), false)
})

test('isValidDescription accepts short descriptions', () => {
  assert.equal(isValidDescription('Short description'), true)
})

test('isValidDescription accepts descriptions at the limit', () => {
  assert.equal(isValidDescription('x'.repeat(500)), true)
})

test('isValidDescription rejects overly long descriptions', () => {
  assert.equal(isValidDescription('x'.repeat(501)), false)
})

test('isValidTitle accepts trimmed titles', () => {
  assert.equal(isValidTitle('  Mint update  '), true)
})

test('isValidTitle accepts titles at the length limit', () => {
  assert.equal(isValidTitle('x'.repeat(100)), true)
})

test('isValidTitle rejects titles over the length limit', () => {
  assert.equal(isValidTitle('x'.repeat(101)), false)
})

test('isValidTitle rejects blank titles', () => {
  assert.equal(isValidTitle('   '), false)
})

test('isValidTags accepts bounded tag lists', () => {
  assert.equal(isValidTags(['art', 'music']), true)
})

test('isValidTags accepts the maximum tag count', () => {
  assert.equal(isValidTags(Array.from({ length: 10 }, (_, i) => `tag${i}`)), true)
})

test('isValidTags rejects too many tags', () => {
  assert.equal(isValidTags(Array.from({ length: 11 }, (_, i) => `tag${i}`)), false)
})

test('isValidTags rejects short tags', () => {
  assert.equal(isValidTags(['a']), false)
})

test('isValidTags rejects overly long tags', () => {
  assert.equal(isValidTags(['x'.repeat(31)]), false)
})

test('buildIpfsUrl supports custom gateways', () => {
  assert.equal(buildIpfsUrl('cid', 'https://gateway.example/ipfs/'), 'https://gateway.example/ipfs/cid')
})

test('buildIpfsUrl uses the default IPFS gateway', () => {
  assert.equal(buildIpfsUrl('cid'), 'https://ipfs.io/ipfs/cid')
})

test('buildIpfsUrl returns blank output for blank CIDs', () => {
  assert.equal(buildIpfsUrl('   '), '')
})

test('clamp raises values below the minimum', () => {
  assert.equal(clamp(-5, 0, 10), 0)
})

test('clamp lowers values above the maximum', () => {
  assert.equal(clamp(15, 0, 10), 10)
})

test('clamp keeps values inside the range', () => {
  assert.equal(clamp(5, 0, 10), 5)
})

test('clamp handles reversed bounds conservatively', () => {
  assert.equal(clamp(5, 10, 0), 10)
})

test('truncate leaves short strings unchanged', () => {
  assert.equal(truncate('hub', 10), 'hub')
})

test('truncate returns blank output for zero limits', () => {
  assert.equal(truncate('hub', 0), '')
})

test('truncate uses an ellipsis for one-character limits', () => {
  assert.equal(truncate('hub', 1), String.fromCharCode(0x2026))
})

test('truncate adds an ellipsis for long strings', () => {
  assert.equal(truncate('contenthub', 6), `conte${String.fromCharCode(0x2026)}`)
})

test('formatDate returns blank output for invalid timestamps', () => {
  assert.equal(formatDate(0), '')
})

test('formatDate returns text for positive timestamps', () => {
  assert.equal(formatDate(1).length > 0, true)
})

test('formatNumber falls back to zero for non-finite values', () => {
  assert.equal(formatNumber(Number.POSITIVE_INFINITY), '0')
})

test('formatNumber falls back to zero for NaN values', () => {
  assert.equal(formatNumber(Number.NaN), '0')
})

test('formatNumber adds locale separators', () => {
  assert.equal(formatNumber(1234567), '1,234,567')
})

test('formatNumber preserves negative values', () => {
  assert.equal(formatNumber(-1200), '-1,200')
})

test('isPositiveInteger accepts positive integers', () => {
  assert.equal(isPositiveInteger(3), true)
})

test('isPositiveInteger rejects zero', () => {
  assert.equal(isPositiveInteger(0), false)
})

test('isPositiveInteger rejects decimals', () => {
  assert.equal(isPositiveInteger(3.5), false)
})

test('isPositiveInteger rejects numeric strings', () => {
  assert.equal(isPositiveInteger('3'), false)
})

test('bytesToMb converts bytes to megabytes', () => {
  assert.equal(bytesToMb(1_572_864), 1.5)
})

test('bytesToMb returns zero for zero bytes', () => {
  assert.equal(bytesToMb(0), 0)
})

test('bytesToMb returns zero for negative bytes', () => {
  assert.equal(bytesToMb(-1), 0)
})

test('range builds half-open integer ranges', () => {
  assert.deepEqual(range(2, 5), [2, 3, 4])
})

test('range returns empty arrays for equal bounds', () => {
  assert.deepEqual(range(3, 3), [])
})

test('range returns empty arrays for descending bounds', () => {
  assert.deepEqual(range(5, 2), [])
})

test('uniqueBy keeps first matching items by key', () => {
  assert.deepEqual(uniqueBy([{ id: 1, name: 'a' }, { id: 1, name: 'b' }], (item) => item.id), [{ id: 1, name: 'a' }])
})

test('uniqueBy keeps already unique items', () => {
  assert.deepEqual(uniqueBy([{ id: 1 }, { id: 2 }], (item) => item.id), [{ id: 1 }, { id: 2 }])
})

test('omit removes requested object keys', () => {
  assert.deepEqual(omit({ id: 1, secret: 'x' }, ['secret']), { id: 1 })
})

test('omit leaves objects unchanged when no keys are provided', () => {
  assert.deepEqual(omit({ id: 1, title: 'post' }, []), { id: 1, title: 'post' })
})

test('pick keeps requested object keys', () => {
  assert.deepEqual(pick({ id: 1, title: 'post', secret: 'x' }, ['id', 'title']), { id: 1, title: 'post' })
})

test('isValidAddress accepts non-zero EVM addresses', () => {
  assert.equal(isValidAddress('0x1234567890abcdef1234567890abcdef12345678'), true)
})

test('isValidAddress rejects the zero address', () => {
  assert.equal(isValidAddress('0x0000000000000000000000000000000000000000'), false)
})

test('pluralize returns singular labels for one item', () => {
  assert.equal(pluralize(1, 'upload'), 'upload')
})

test('pluralize returns plural labels for other counts', () => {
  assert.equal(pluralize(2, 'upload'), 'uploads')
})

test('formatWei returns fixed zero output', () => {
  assert.equal(formatWei(0n), '0.0000')
})

test('formatWei formats whole token values', () => {
  assert.equal(formatWei(1_000_000_000_000_000_000n), '1.0000')
})

test('capitalize uppercases the first character', () => {
  assert.equal(capitalize('content'), 'Content')
})

test('getInitials returns one initial for single names', () => {
  assert.equal(getInitials('content'), 'C')
})

test('getInitials returns first and last initials', () => {
  assert.equal(getInitials('content hub'), 'CH')
})

test('toSlug normalizes titles for URLs', () => {
  assert.equal(toSlug(' Hello Content_Hub! '), 'hello-content-hub')
})

test('isNonEmptyString accepts trimmed visible text', () => {
  assert.equal(isNonEmptyString('  hub  '), true)
})

test('safeJsonParse returns parsed JSON values', () => {
  assert.deepEqual(safeJsonParse('{"ok":true}', { ok: false }), { ok: true })
})

test('safeJsonParse returns fallbacks for invalid JSON', () => {
  assert.deepEqual(safeJsonParse('nope', { ok: false }), { ok: false })
})
