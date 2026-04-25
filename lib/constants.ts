/**
 * Application-wide constants for ContentHub.
 */

/** Maximum allowed upload file size in megabytes. */
export const MAX_FILE_SIZE_MB = 50

/** Maximum allowed upload file size in bytes. */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

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

/** Minimum length for content title in characters. */
export const MIN_TITLE_LENGTH = 3

/** Maximum length for content title in characters. */
export const MAX_TITLE_LENGTH = 100

/** Maximum length for content description in characters. */
export const MAX_DESCRIPTION_LENGTH = 500

/** Maximum number of tags per content item. */
export const MAX_TAGS = 10

/** Minimum length for an individual tag in characters. */
export const MIN_TAG_LENGTH = 2

/** Maximum tag length in characters. */
export const MAX_TAG_LENGTH = 30

/** How many items to display per page in the gallery. */
export const GALLERY_PAGE_SIZE = 20

/** How many content IDs to fetch in a single gallery request. */
export const GALLERY_FETCH_LIMIT = 10

/** Alias for gallery fetch limit used by newer API helpers. */
export const GALLERY_MAX_FETCH = GALLERY_FETCH_LIMIT

/** Stable token symbol used in Celo treasury displays. */
export const STABLE_TOKEN_SYMBOL = 'USDT'

/** IPFS gateway URL used for resolving CIDs. */
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

/** Pinata IPFS gateway for faster pin resolution. */
export const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

/** Public RPC endpoint for Base mainnet. */
export const BASE_RPC_URL = 'https://mainnet.base.org'

/** Public RPC endpoint for Celo mainnet. */
export const CELO_RPC_URL = 'https://forno.celo.org'

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

/** Semantic version string for the current app release. */
export const APP_VERSION = '1.0.0'

/** Standard user-facing error messages. */
export const ERROR_MESSAGES = Object.freeze({
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  WRONG_NETWORK: 'Please switch to Base or Celo network.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  VOTE_FAILED: 'Could not record your vote. Please try again.',
  INVALID_FILE: 'The selected file is not supported.',
  FILE_TOO_LARGE: 'File exceeds the 50 MB upload limit.',
} as const)

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

/** Recognised content type values used when uploading or displaying content. */
export const CONTENT_TYPES = Object.freeze({
  IMAGE: 'image',
  VIDEO: 'video',
  SCORE: 'score',
  ACHIEVEMENT: 'achievement',
} as const)

/** Accept attribute string for file inputs that allow content uploads. */
export const ACCEPTED_FILE_TYPES = ALLOWED_MIME_TYPES.join(',')
