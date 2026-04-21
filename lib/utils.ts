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
