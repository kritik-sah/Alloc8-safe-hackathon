/**
 * Return a number truncated to the specified decimals (default 2).
 */
export function toFixed(value: number | string, decimals: number = 2): number {
  const factor = Math.pow(10, decimals); // Factor for shifting decimals
  return Math.trunc(Number(value) * factor) / factor; // Truncate instead of rounding
}
