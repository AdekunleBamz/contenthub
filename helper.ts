export function helper(): void {}

/** Checks if two addresses are equal (case-insensitive). */
export function isSameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

/** Normalises a blockchain address to checksummed lowercase form. */
export function normaliseAddress(addr: string): string {
  return addr.toLowerCase()
}
