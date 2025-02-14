/**
 * Utility function to format a number into a more readable format.
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number string with the appropriate suffix.
 */
export const formatNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + "T"; // Trillion
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B"; // Billion
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M"; // Million
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + "K"; // Thousand
  } else {
    return num ? num.toFixed(4) : "0"; // Less than a thousand
  }
};
