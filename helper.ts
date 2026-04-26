export function helper(): void {}

/** Checks if two addresses are equal (case-insensitive). */
export function isSameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

/** Normalises a blockchain address to checksummed lowercase form. */
export function normaliseAddress(addr: string): string {
  return addr.toLowerCase()
}

/** Returns true if value is a valid Ethereum address. */
export function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr)
}

/** Shortens an address to 0x1234...5678 format. */
export function shortAddress(addr: string, chars = 4): string {
  return addr.slice(0, chars + 2) + "..." + addr.slice(-chars)
}

/** Returns a display label for the connection state. */
export function connectionStateLabel(connected: boolean): string {
  return connected ? "Connected" : "Disconnected"
}

/** Returns a CSS color for connection status. */
export function connectionStatusColor(connected: boolean): string {
  return connected ? "#22c55e" : "#ef4444"
}

/** Returns true if address is considered busy (pending tx). */
export function isWalletBusy(pendingCount: number): boolean {
  return pendingCount > 0
}

/** Returns an emoji for connection status. */
export function connectionStatusEmoji(connected: boolean): string {
  return connected ? "🟢" : "🔴"
}
