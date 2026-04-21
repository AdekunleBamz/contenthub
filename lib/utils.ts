/**
 * Utility helpers for ContentHub UI formatting and validation.
 */

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
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{55,})$/.test(cid)
}

/**
 * Formats an IPFS URI from a CID for use in image tags.
 * Uses a public IPFS gateway.
 * @param cid - IPFS CID string.
 */
export function ipfsToHttp(cid: string): string {
  return `https://ipfs.io/ipfs/${cid}`
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
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`
  return `${bytes} B`
}

/**
 * Returns true if the given MIME type is allowed for upload.
 * @param mimeType - MIME type string to check.
 */
export function isAllowedMimeType(mimeType: string): boolean {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'audio/mpeg', 'application/pdf',
  ]
  return allowed.includes(mimeType)
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
  return tags.length <= 10 && tags.every((t) => t.length > 0 && t.length <= 30)
}

/**
 * Builds the full IPFS HTTP URL for a CID.
 * @param cid - IPFS CID.
 * @param gateway - Gateway base URL (default: ipfs.io).
 */
export function buildIpfsUrl(cid: string, gateway = 'https://ipfs.io/ipfs/'): string {
  return `${gateway}${cid}`
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
 * @param max - Maximum character count.
 */
export function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return `${str.slice(0, max - 1)}\u2026`
}
