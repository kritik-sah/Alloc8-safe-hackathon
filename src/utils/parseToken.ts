import { parseUnits } from "ethers";

export const parseToken = (
  value: number | string,
  decimals: number = 18
): bigint => {
  try {
    const parsedValue = parseFloat(value as string);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return parseUnits("0", decimals);
    }

    // Convert scientific notation to decimal string
    const decimalValue = parsedValue.toFixed(decimals).replace(/\.?0+$/, ""); // Trim trailing zeroes
    return parseUnits(decimalValue, decimals);
  } catch (error) {
    console.error("Error parsing units:", error);
    return parseUnits("0", decimals);
  }
};
