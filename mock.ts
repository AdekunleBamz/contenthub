export function mock(): object { return {}; }

/** Returns a mock Ethereum address for testing. */
export function mockAddress(index = 0): string {
  return "0x" + index.toString(16).padStart(40, "0")
}

/** Returns a mock CELO balance string for testing. */
export function mockCeloBalance(amount = 100): string {
  return amount.toFixed(4) + " CELO"
}

/** Returns a mock content item object for testing. */
export function mockContent(id = "1"): object {
  return { id, title: "Test Content " + id, body: "Lorem ipsum", author: mockAddress() }
}
