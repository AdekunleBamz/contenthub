/**
 * Utility helpers for ContentHub UI formatting and validation.
 */
import { MAX_TAGS, MAX_TAG_LENGTH, MIN_TAG_LENGTH, ALLOWED_MIME_TYPES, IPFS_GATEWAY } from './constants'

/**
 * Truncates an EVM address to short form: 0xabcd...1234
 * @param addr - Full EVM address string.
 */
export function shortAddress(addr: string): string {
  if (addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

/**
 * Returns true if the given address is the EVM zero address.
 * @param addr - Address string.
 */
export function isZeroAddress(addr: string): boolean {
  return addr === '0x0000000000000000000000000000000000000000'
}

/**
 * Returns true if the given string is a valid non-empty IPFS CID.
 * Supports both CIDv0 (Qm...) and CIDv1 (bafy...) formats.
 * @param cid - CID string to validate.
 */
export function isValidCid(cid: string): boolean {
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{55,})$/.test(cid.trim())
}

/**
 * Formats an IPFS URI from a CID for use in image tags.
 * Uses a public IPFS gateway.
 * @param cid - IPFS CID string.
 */
export function ipfsToHttp(cid: string): string {
  return `${IPFS_GATEWAY}${cid.trim()}`
}

/**
 * Returns true if the file size is within the allowed upload limit.
 * @param sizeBytes - File size in bytes.
 * @param maxMb - Maximum allowed size in megabytes (default 50).
 */
export function isValidFileSize(sizeBytes: number, maxMb = 50): boolean {
  return sizeBytes > 0 && sizeBytes <= maxMb * 1024 * 1024
}

/**
 * Formats a file size in bytes to a human-readable string.
 * @param bytes - File size in bytes.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`
  return `${bytes} B`
}

/**
 * Returns true if the given MIME type is allowed for upload.
 * @param mimeType - MIME type string to check.
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)
}

/**
 * Returns true if the content title is valid (non-empty, within max length).
 * @param title - Title string to validate.
 */
export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.trim().length <= 100
}

/**
 * Returns true if the description is within the max allowed length.
 * @param desc - Description string to check.
 */
export function isValidDescription(desc: string): boolean {
  return desc.length <= 500
}

/**
 * Returns true if the tag list is within allowed count and each tag within length.
 * @param tags - Array of tag strings.
 */
export function isValidTags(tags: string[]): boolean {
  return tags.length <= MAX_TAGS && tags.every((t) => t.length >= MIN_TAG_LENGTH && t.length <= MAX_TAG_LENGTH)
}

/**
 * Builds the full IPFS HTTP URL for a CID.
 * @param cid - IPFS CID.
 * @param gateway - Gateway base URL (default: ipfs.io).
 */
export function buildIpfsUrl(cid: string, gateway = 'https://ipfs.io/ipfs/'): string {
  return `${gateway}${cid.trim()}`
}

/**
 * Clamps a number between min and max (inclusive).
 * @param value - Number to clamp.
 * @param min - Minimum value.
 * @param max - Maximum value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Truncates a string to max length with ellipsis.
 * @param str - String to truncate.
 * @param max - Maximum character count (must be at least 1).
 */
export function truncate(str: string, max: number): string {
  if (max <= 0) return ''
  if (str.length <= max) return str
  return `${str.slice(0, max - 1)}\u2026`
}

/**
 * Formats a Unix timestamp in seconds as a locale date string.
 * Returns an empty string when the timestamp is not a valid positive number.
 * @param ts - Unix timestamp in seconds.
 */
export function formatDate(ts: number): string {
  if (!Number.isFinite(ts) || ts <= 0) return ''
  return new Date(ts * 1000).toLocaleDateString()
}

/**
 * Formats a number with locale-appropriate thousands separators.
 * @param n - Number to format.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString()
}

/**
 * Returns true when n is a finite integer greater than zero.
 * @param n - Value to check.
 */
export function isPositiveInteger(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && Number.isInteger(n) && n > 0
}

/**
 * Converts bytes to megabytes, rounded to two decimal places.
 * @param bytes - Size in bytes.
 */
export function bytesToMb(bytes: number): number {
  return Math.round((bytes / 1_048_576) * 100) / 100
}

/**
 * Returns an array of integers from start (inclusive) to end (exclusive).
 * @param start - Start of the range.
 * @param end - End of the range (exclusive).
 */
export function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i < end; i++) result.push(i)
  return result
}

/**
 * Deduplicates an array by a key derived from each element.
 * The first occurrence of each key is kept.
 * @param arr - Source array.
 * @param key - Function that returns the deduplication key for an element.
 */
export function uniqueBy<T>(arr: T[], key: (item: T) => unknown): T[] {
  const seen = new Set<unknown>()
  return arr.filter((item) => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * Returns a copy of the object with the given keys removed.
 * @param obj - Source object.
 * @param keys - Keys to exclude.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  for (const k of keys) delete result[k]
  return result as Omit<T, K>
}

/**
 * Returns a new object containing only the specified keys.
 * @param obj - Source object.
 * @param keys - Keys to keep.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as Pick<T, K>
}

/**
 * Returns true if the address is a valid non-zero EVM address.
 * @param addr - Address string.
 */
export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr) && addr !== '0x0000000000000000000000000000000000000000'
}

/**
 * Pluralizes a word based on count.
 * @param count - The number.
 * @param singular - Singular form.
 * @param plural - Optional plural override.
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/**
 * Formats a wei amount as a CELO string with 4 decimal places.
 * @param wei - Amount in wei (bigint).
 */
export function formatWei(wei: bigint): string {
  if (wei === 0n) return '0.0000'
  return (Number(wei) / 1e18).toFixed(4)
}

/**
 * Returns a debounced wrapper around a function.
 * @param fn - Function to debounce.
 * @param delay - Delay in ms.
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Sleeps for a given number of milliseconds.
 * @param ms - Duration in milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Returns the string with its first character uppercased.
 * @param str - Input string.
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Returns the initials of a name string (up to 2 characters).
 * @param name - Full name or title string.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Converts a title string to a URL-safe slug.
 * @param str - Input string (e.g. a content title).
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Returns true when the value is a string with at least one non-whitespace character.
 * @param value - Value to check.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Safely parses a JSON string, returning `fallback` on any parse error.
 * @param json - JSON string to parse.
 * @param fallback - Value returned when parsing fails.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}
