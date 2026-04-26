export interface Project { name: string; }

/** Type guard: returns true if value is a string. */
export function isString(value: unknown): value is string {
  return typeof value === "string"
}
