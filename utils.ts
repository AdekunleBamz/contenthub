export function util(): void {}

/** Truncates a string to maxLen characters and appends ellipsis. */
export function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "..."
}

/** Converts a string to slug format (lowercase, hyphens). */
export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}
