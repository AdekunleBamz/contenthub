export class Validator { validate(d: any): boolean { return true; } }

/** Validates that a string is a valid URL. */
export function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}
