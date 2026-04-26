export interface Project { name: string; }

/** Type guard: returns true if value is a string. */
export function isString(value: unknown): value is string {
  return typeof value === "string"
}

/** Type guard: returns true if value is a number. */
export function isNumber(value: unknown): value is number {
  return typeof value === "number"
}

/** Type guard: returns true if value is a boolean. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean"
}

/** Type guard: returns true if value is an array. */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/** Type guard: returns true if value is null. */
export function isNull(value: unknown): value is null {
  return value === null
}

/** Type guard: returns true if value is undefined. */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined"
}

/** Type guard: returns true if value is a function. */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function"
}

/** Type guard: returns true if value is a bigint. */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint"
}
