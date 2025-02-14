export const truncateAddress = (
  address: string | `0x${string}` | undefined,
  startLength = 6,
  endLength = 4
): string => {
  if (!address) return "";
  const truncatedStart = address.substring(0, startLength);
  const truncatedEnd = address.substring(address.length - endLength);
  return `${truncatedStart}...${truncatedEnd}`;
};
