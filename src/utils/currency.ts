import config from '../config';

/**
 * Formats a number as currency using the configured currency symbol
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "Rs 1,234.56")
 */
export const formatCurrency = (amount: number | null | undefined, decimals: number = 2): string => {
  // Handle null/undefined values
  if (amount === null || amount === undefined) {
    return `${config.CURRENCY_SYMBOL} 0.00`;
  }

  const formattedAmount = amount.toFixed(decimals);
  return `${config.CURRENCY_SYMBOL} ${formattedAmount}`;
};

/**
 * Formats a number as currency without the symbol
 * @param amount - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string (e.g., "1,234.56")
 */
export const formatAmount = (amount: number | null | undefined, decimals: number = 2): string => {
  // Handle null/undefined values
  if (amount === null || amount === undefined) {
    return '0.00';
  }

  return amount.toFixed(decimals);
};

/**
 * Gets the currency symbol from config
 * @returns Currency symbol (e.g., "Rs")
 */
export const getCurrencySymbol = (): string => {
  return config.CURRENCY_SYMBOL;
};

/**
 * Gets the currency code from config
 * @returns Currency code (e.g., "PKR")
 */
export const getCurrencyCode = (): string => {
  return config.CURRENCY_CODE;
};
