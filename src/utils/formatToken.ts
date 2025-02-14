import { formatUnits } from "viem";

export const formatToken = (value: bigint, decimals: number = 18): string => {
  if (!value || value === BigInt(0)) return "0";
  return formatUnits(value, decimals);
};
