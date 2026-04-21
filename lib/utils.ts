/**
 * Utility helpers for ContentHub UI formatting and validation.
 */
import { MAX_TAGS, MAX_TAG_LENGTH, MIN_TAG_LENGTH, ALLOWED_MIME_TYPES, IPFS_GATEWAY, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, MAX_FILE_SIZE_MB, ZERO_ADDRESS } from './constants'

/**
 * Truncates an EVM address to a readable short form.
 * Example: 0x1234567890abcdef1234567890abcdef12345678 -> 0x1234...5678
 * 
 * @param addr - The full EVM address string to be truncated.
 * @returns The truncated address string (0xabcd...1234) or an empty string if input is invalid.
 */
export function shortAddress(addr: string): string {
  if (!addr) return ''
  if (addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

/**
 * Checks if the provided address is the EVM zero address (0x0...0).
 * 
 * @param addr - The address string to check.
 * @returns True if the address is the zero address, false otherwise.
 */
export function isZeroAddress(addr: string): boolean {
  if (!addr) return false
  return addr === ZERO_ADDRESS
}

/**
 * Validates if the given string is a correctly formatted IPFS Content Identifier (CID).
 * Supports both CIDv0 (starting with 'Qm') and CIDv1 (starting with 'bafy').
 * 
 * @param cid - The CID string to validate.
 * @returns True if the string matches valid IPFS CID patterns.
 */
export function isValidCid(cid: string): boolean {
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{55,})$/.test(cid.trim())
}

/**
 * Formats a full HTTP URL for an IPFS CID using the standard gateway.
 * Used for displaying IPFS-hosted images or media in the UI.
 * 
 * @param cid - The IPFS Content Identifier string.
 * @returns A complete URL string pointing to the IPFS gateway.
 */
export function ipfsToHttp(cid: string): string {
  return `${IPFS_GATEWAY}${cid.trim()}`
}

/**
 * Checks if a file's size is within the acceptable maximum limit.
 * 
 * @param sizeBytes - The size of the file in bytes.
 * @param maxMb - The maximum allowed size in Megabytes (defaults to MAX_FILE_SIZE_MB).
 * @returns True if the file size is positive and less than or equal to the limit.
 */
export function isValidFileSize(sizeBytes: number, maxMb = MAX_FILE_SIZE_MB): boolean {
  return sizeBytes > 0 && sizeBytes <= maxMb * 1024 * 1024
}

/**
 * Converts a raw file size in bytes to a formatted, human-readable string.
 * Automatically chooses the best unit (B, KB, or MB) for readability.
 * 
 * @param bytes - The number of bytes to format.
 * @returns A formatted string with the appropriate unit.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`
  return `${bytes} B`
}

/**
 * Verifies if the provided MIME type is within the application's supported list.
 * 
 * @param mimeType - The MIME type string to be checked (e.g., 'image/png').
 * @returns True if the MIME type is supported for uploads.
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType)
}

/**
 * Validates if the content description adheres to the maximum character length correctly.
 * 
 * @param desc - The description string to be validated.
 * @returns True if the description is within the allowed character limit.
 */
export function isValidDescription(desc: string): boolean {
  return desc.length <= MAX_DESCRIPTION_LENGTH
}

/**
 * Validates a content title to ensure it is not empty and fits within character limits.
 * 
 * @param title - The title string to validate.
 * @returns True if the title is valid and within length constraints.
 */
export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.trim().length <= MAX_TITLE_LENGTH
}

/**
 * Validates a list of tags against length and count constraints.
 * Ensures the total number of tags and each tag's character count are within limits.
 * 
 * @param tags - An array of tag strings to validate.
 * @returns True if the entire tag list is compliant with all constraints.
 */
export function isValidTags(tags: string[]): boolean {
  return tags.length <= MAX_TAGS && tags.every((t) => t.length >= MIN_TAG_LENGTH && t.length <= MAX_TAG_LENGTH)
}

/**
 * Constructs a full URL for an IPFS CID using a customizable gateway.
 * Provides a flexible alternative to standard IPFS resolution with a default fallback.
 * 
 * @param cid - The IPFS Content Identifier string.
 * @param gateway - The base gateway URL (defaults to 'https://ipfs.io/ipfs/').
 * @returns A fully qualified IPFS URL string.
 */
export function buildIpfsUrl(cid: string, gateway = 'https://ipfs.io/ipfs/'): string {
  return `${gateway}${cid.trim()}`
}

/**
 * Constrains a number to be within a specific range [min, max].
 * If the value is outside the range, it is moved to the nearest boundary.
 * 
 * @param value - The numerical value to be clamped.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) return min
  return Math.min(max, Math.max(min, value))
}

/**
 * Truncates a string to match a maximum character count, adding an ellipsis if necessary.
 * Useful for UI elements with limited display space.
 * 
 * @param str - The string to truncate.
 * @param max - Maximum character count allowed (including the ellipsis).
 * @returns The truncated string or an empty string if max is 0 or less.
 */
export function truncate(str: string, max: number): string {
  if (max <= 0) return ''
  if (str.length <= max) return str
  return `${str.slice(0, max - 1)}\u2026`
}

/**
 * Converts a Unix timestamp in seconds to a human-readable locale date string.
 * This is the standard date formatting used for content item timestamps in the UI.
 * 
 * @param ts - The Unix timestamp to format (in seconds).
 * @returns A locale-formatted date string or an empty string if the timestamp is invalid.
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
  if (!Number.isFinite(n)) return '0'
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
  if (bytes <= 0) return 0
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
  if (!addr || typeof addr !== 'string') return false
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
