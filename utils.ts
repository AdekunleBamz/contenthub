export function util(): void {}

/** Truncates a string to maxLen characters and appends ellipsis. */
export function truncate(str: string, maxLen: number): string {
  return str.length <= maxLen ? str : str.slice(0, maxLen) + "..."
}
