/**
 * Application-wide constants for ContentHub.
 */

/** Maximum allowed upload file size in megabytes. */
export const MAX_FILE_SIZE_MB = 50

/** Allowed MIME types for content uploads. */
export const ALLOWED_MIME_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'audio/mpeg',
  'application/pdf',
] as const)

/** Maximum length for content title in characters. */
export const MAX_TITLE_LENGTH = 100

/** Maximum length for content description in characters. */
export const MAX_DESCRIPTION_LENGTH = 500

/** Maximum number of tags per content item. */
export const MAX_TAGS = 10

/** Maximum tag length in characters. */
export const MAX_TAG_LENGTH = 30

/** How many items to display per page in the gallery. */
export const GALLERY_PAGE_SIZE = 20

/** IPFS gateway URL used for resolving CIDs. */
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

/** Pinata IPFS gateway for faster pin resolution. */
export const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

/** Timeout (ms) for IPFS upload requests. */
export const IPFS_UPLOAD_TIMEOUT_MS = 60_000

/** Timeout (ms) for on-chain transaction confirmation. */
export const TX_TIMEOUT_MS = 120_000

/** Duration (ms) for success toast notifications. */
export const TOAST_SUCCESS_DURATION_MS = 4_000

/** Duration (ms) for error toast notifications. */
export const TOAST_ERROR_DURATION_MS = 7_000

/** App display name shown in the UI. */
export const APP_DISPLAY_NAME = 'ContentHub'

/** Zero address sentinel. */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

/** Content upload status values for UI state management. */
export const UPLOAD_STATUS = Object.freeze({
  IDLE: 'idle',
  UPLOADING: 'uploading',
  MINTING: 'minting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const)

/** Debounce delay in ms applied to search and input handlers. */
export const INPUT_DEBOUNCE_MS = 300

/** Supported blockchain networks for content uploads. */
export const SUPPORTED_CHAINS = Object.freeze(['base', 'celo'] as const)
