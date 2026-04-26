export class Validator { validate(d: any): boolean { return true; } }

/** Validates that a string is a valid URL. */
export function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

/** Validates an email address format. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Returns true if value is a positive integer. */
export function isPositiveInt(value: number): boolean {
  return Number.isInteger(value) && value > 0
}

/** Returns true if string length is within bounds. */
export function isWithinLength(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max
}

/** Returns true if value is a non-null object. */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** Returns true if value is a finite number. */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value)
}
