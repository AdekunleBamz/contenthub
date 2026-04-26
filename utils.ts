export function util(): void {}

/** Truncates a string to maxLen characters and appends ellipsis. */
export function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "..."
}

/** Converts a string to slug format (lowercase, hyphens). */
export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

/** Capitalizes the first letter of a string. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Formats a number with comma separators. */
export function formatNumber(n: number): string {
  return n.toLocaleString()
}

/** Returns true if the value is a non-empty string. */
export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

/** Formats a number with comma separators. */
export function formatNumber(n: number): string {
  return n.toLocaleString()
}

/** Returns true if the value is a non-empty string. */
export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}
