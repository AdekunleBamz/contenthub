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

/** Returns a mock user profile object for testing. */
export function mockUser(fid = 1): object {
  return { fid, username: "testuser" + fid, address: mockAddress(fid) }
}

/** Returns a mock transaction hash for testing. */
export function mockTxHash(): string {
  return "0x" + "a".repeat(64)
}

/** Returns a mock paginated response object for testing. */
export function mockPaginatedResponse<T>(items: T[]): object {
  return { items, total: items.length, page: 1, pageSize: 20 }
}

/** Returns a mock error object for testing. */
export function mockError(message = "Something went wrong"): Error {
  return new Error(message)
}
