/** Validate if the input string is a valid number with one optional decimal point */
export function isValidNumber(input: string): boolean {
  // Regular expression to allow numbers with an optional decimal point
  const regex = /^(0|[1-9][0-9]*)(\.[0-9]*)?$/;

  // Test if the input matches the regex
  return regex.test(input.trim());
}
