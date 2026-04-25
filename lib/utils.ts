/**
 * Utility helpers for ContentHub UI formatting and validation.
 */
import { MAX_TAGS, MAX_TAG_LENGTH, MIN_TAG_LENGTH, ALLOWED_MIME_TYPES, IPFS_GATEWAY, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, MAX_FILE_SIZE_MB, ZERO_ADDRESS, MIN_TITLE_LENGTH } from './constants'

/**
 * Truncates an EVM address to a readable short form.
 * Example: 0x1234567890abcdef1234567890abcdef12345678 -> 0x1234...5678
 * 
 * @param addr - The full EVM address string to be truncated.
 * @returns The truncated address string (0xabcd...1234) or an empty string if input is invalid.
 */
export function shortAddress(addr: string): string {
  const normalized = addr.trim()
  if (!normalized) return ''
  if (normalized.length < 10) return normalized
  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`
}

/**
 * Checks if the provided address is the EVM zero address (0x0...0).
 * 
 * @param addr - The address string to check.
 * @returns True if the address is the zero address, false otherwise.
 */
export function isZeroAddress(addr: string): boolean {
  if (!addr) return false
  return addr.trim().toLowerCase() === ZERO_ADDRESS
}

/**
 * Validates if the given string is a correctly formatted IPFS Content Identifier (CID).
 * Supports both CIDv0 (starting with 'Qm') and CIDv1 (starting with 'bafy').
 * 
 * @param cid - The CID string to validate.
 * @returns True if the string matches valid IPFS CID patterns.
 */
export function isValidCid(cid: string): boolean {
  if (!cid) return false
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
  const normalizedCid = cid.trim()
  if (!normalizedCid) return ''
  return `${IPFS_GATEWAY}${normalizedCid}`
}

/**
 * Checks if a file's size is within the acceptable maximum limit.
 * 
 * @param sizeBytes - The size of the file in bytes.
 * @param maxMb - The maximum allowed size in Megabytes (defaults to MAX_FILE_SIZE_MB).
 * @returns True if the file size is positive and less than or equal to the limit.
 */
export function isValidFileSize(sizeBytes: number, maxMb = MAX_FILE_SIZE_MB): boolean {
  if (sizeBytes <= 0) return false
  return sizeBytes <= maxMb * 1024 * 1024
}

/**
 * Converts a raw file size in bytes to a formatted, human-readable string.
 * Automatically chooses the best unit (B, KB, or MB) for readability.
 * 
 * @param bytes - The number of bytes to format.
 * @returns A formatted string with the appropriate unit.
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B'
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
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType.trim().toLowerCase())
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
  const normalizedTitle = title.trim()
  return normalizedTitle.length >= MIN_TITLE_LENGTH && normalizedTitle.length <= MAX_TITLE_LENGTH
}

/**
 * Validates a list of tags against length and count constraints.
 * Ensures the total number of tags and each tag's character count are within limits.
 * 
 * @param tags - An array of tag strings to validate.
 * @returns True if the entire tag list is compliant with all constraints.
 */
export function isValidTags(tags: string[]): boolean {
  return tags.length <= MAX_TAGS && tags.every((t) => {
    const normalizedTag = t.trim()
    return normalizedTag.length >= MIN_TAG_LENGTH && normalizedTag.length <= MAX_TAG_LENGTH
  })
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
  const normalizedCid = stripIpfsPrefix(cid.trim())
  if (!normalizedCid) return ''
  const normalizedGateway = gateway.endsWith('/') ? gateway : `${gateway}/`
  return `${normalizedGateway}${normalizedCid}`
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
  const lower = Math.min(min, max)
  const upper = Math.max(min, max)
  return Math.min(upper, Math.max(lower, value))
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
 * Formats a number with locale-specific thousands separators (e.g., 1,000,000).
 * Used for displaying vote counts and other large integers in the UI.
 * 
 * @param n - The numerical value to format.
 * @returns A formatted string or '0' if the input is not a finite number.
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '0'
  return n.toLocaleString()
}

/**
 * Validates if the given value is a finite integer strictly greater than zero.
 * Acts as a TypeScript type guard to ensure the value is a positive number.
 * 
 * @param n - The unknown value to check.
 * @returns True if n is a positive finite integer.
 */
export function isPositiveInteger(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && Number.isInteger(n) && n > 0
}

/**
 * Converts a size in bytes to its Megabyte (MB) equivalent, rounded to two decimal places.
 * Ensures a consistent format for file size display across different components.
 * 
 * @param bytes - The number of bytes to convert.
 * @returns The size in MB rounded to 2 decimals, or 0 if the input is non-positive.
 */
export function bytesToMb(bytes: number): number {
  if (bytes <= 0) return 0
  return Math.round((bytes / 1_048_576) * 100) / 100
}

/**
 * Generates an array of sequential integers starting from 'start' up to (but not including) 'end'.
 * Typically used for generating lists or controlling loops in UI components.
 * 
 * @param start - The inclusive start of the range.
 * @param end - The exclusive end of the range.
 * @returns An array containing the sequential range of integers.
 */
export function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i < end; i++) result.push(i)
  return result
}

/**
 * Deduplicates an array based on a unique key derived from each element.
 * Only the first occurrence of each unique key is preserved in the resulting array.
 * 
 * @param arr - The source array to be deduplicated.
 * @param key - A selector function that returns the deduplication key for each item.
 * @returns A new array containing only unique elements based on the derived key.
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
 * Creates a shallow copy of an object with the specified keys removed.
 * Useful for filtering out sensitive or unnecessary properties before state updates.
 * 
 * @param obj - The source object.
 * @param keys - An array of keys to be excluded from the new object.
 * @returns A new object identical to the source but without the omitted keys.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj }
  for (const k of keys) delete result[k]
  return result as Omit<T, K>
}

/**
 * Extracts a specific subset of properties from an object into a new object.
 * Provides a type-safe way to create partial objects from a larger source.
 * 
 * @param obj - The source object.
 * @param keys - An array of keys to include in the resulting object.
 * @returns A new object containing only the requested properties from the source.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as Pick<T, K>
}

/**
 * Validates if the given string is a correctly formatted, non-zero EVM address.
 * Rigorously checks for the 0x prefix and hex-encoded 40-character body.
 * 
 * @param addr - The address string to validate.
 * @returns True if the address is valid and is not the standard zero address.
 */
export function isValidAddress(addr: string): boolean {
  if (!addr || typeof addr !== 'string') return false
  const normalizedAddress = addr.trim()
  return /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress) && normalizedAddress.toLowerCase() !== ZERO_ADDRESS
}

/**
 * Returns either the singular or plural form of a word based on the provided count.
 * Useful for building dynamic, grammatically correct UI strings.
 * 
 * @param count - The quantity used to determine the form.
 * @param singular - The singular form of the word.
 * @param plural - An optional plural override (defaults to singular + 's').
 * @returns The appropriate word form for the given count.
 */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/**
 * Converts an amount in Wei (bigint) to a human-readable decimal string with 4-place precision.
 * This is primarily used for displaying token balances and transaction fees in the UI.
 * 
 * @param wei - The amount in Wei to be converted.
 * @returns A formatted string representation of the amount in full tokens.
 */
export function formatWei(wei: bigint): string {
  if (wei === 0n) return '0.0000'
  return (Number(wei) / 1e18).toFixed(4)
}

/**
 * Returns a debounced version of the provided function.
 * Ensures the function only executes after 'delay' milliseconds have elapsed since the last call.
 * 
 * @param fn - The function to be debounced.
 * @param delay - The delay in milliseconds.
 * @returns A debounced function that accepts the same parameters as the original.
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Returns a Promise that resolves after a specified duration.
 * Useful for introducing artificial delays or managing retry logic in async workflows.
 * 
 * @param ms - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the timeout.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Capitalizes the first character of a string.
 * Used for formatting UI labels and title case representations.
 * 
 * @param str - The input string to capitalize.
 * @returns The string with its first letter uppercase, or the original string if empty.
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Extracts up to two initials from a name or title string.
 * Commonly used for user avatar placeholders when no image is available.
 * 
 * @param name - The full name or title string.
 * @returns A 1 or 2 character uppercase string of initials.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Converts a raw string into a URL-safe slug format.
 * Lowercases, removes special characters, and replaces spaces with hyphens.
 * 
 * @param str - The input string (e.g., a content title) to be slugified.
 * @returns A URL-safe slug string.
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
 * Determines if a value is a string that contains at least one non-whitespace character.
 * Acts as a TypeScript type guard for identifying meaningful string inputs.
 * 
 * @param value - The value to check (of unknown type).
 * @returns True if the value is a string with visible content.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Safely parses a JSON-formatted string, returning a fallback value on failure.
 * Prevents application crashes due to malformed metadata or API responses.
 * 
 * @param json - The JSON string to attempt to parse.
 * @param fallback - The value to return if parsing fails (must match expected return type).
 * @returns The parsed object or the fallback value.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Formats a percentage value (0–100) for display.
 * @param value - A number in the 0–100 range.
 * @param decimals - Number of decimal places. Defaults to 1.
 */
export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '0%'
  return `${Math.max(0, Math.min(100, value)).toFixed(decimals)}%`
}

/**
 * Safely parses a string to a floating-point number.
 * @param value - String to parse.
 * @param fallback - Value to return on failure. Defaults to 0.
 */
export function safeParseFloat(value: string, fallback = 0): number {
  const n = parseFloat(value)
  return Number.isFinite(n) ? n : fallback
}

/** Returns true when the given string looks like a valid email address. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** Filters out null, undefined, and false values from an array. */
export function compact<T>(arr: (T | null | undefined | false)[]): T[] {
  return arr.filter((item): item is T => item !== null && item !== undefined && item !== false)
}

/**
 * Strips an `ipfs://` scheme prefix from a CID or URL string.
 * Returns the value unchanged if the prefix is not present.
 */
export function stripIpfsPrefix(value: string): string {
  return value.startsWith('ipfs://') ? value.slice(7) : value
}

/**
 * Groups an array of items by a derived key.
 * @param arr - The array to group.
 * @param key - Function that returns the group key for each item.
 */
export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}
