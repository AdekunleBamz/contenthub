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

/** Clamps a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Returns unique values from an array. */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

/** Groups an array of objects by a key. */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key])
    ;(acc[k] = acc[k] || []).push(item)
    return acc
  }, {} as Record<string, T[]>)
}

/** Debounces a function call by the specified delay. */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}

/** Picks specified keys from an object. */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {} as Pick<T, K>)
}
