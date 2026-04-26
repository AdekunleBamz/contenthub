export function mock(): object { return {}; }

/** Returns a mock Ethereum address for testing. */
export function mockAddress(index = 0): string {
  return "0x" + index.toString(16).padStart(40, "0")
}
