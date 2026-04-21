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
