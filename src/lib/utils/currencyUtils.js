// src/lib/utils/currencyUtils.js
import currenciesData from '@/data/currencies.json';

// Get all currencies as an array
export const getAllCurrencies = () => {
  return Object.values(currenciesData).map(currency => ({
    ...currency,
    value: currency.code,
    label: currency.name
  }));
};

// Get popular currencies (first 20 in the sorted list)
export const getPopularCurrencies = () => {
  const popularCodes = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'INR', 'KRW', 'BRL', 'ZAR', 'KES', 'NGN'];
  return popularCodes
    .map(code => currenciesData[code])
    .filter(Boolean)
    .map(currency => ({
      ...currency,
      value: currency.code,
      label: currency.name
    }));
};

// Get currency by code
export const getCurrencyByCode = (code) => {
  return currenciesData[code] || null;
};

// Get currency symbol by code
export const getCurrencySymbol = (code) => {
  const currency = getCurrencyByCode(code);
  return currency ? currency.symbol : code;
};

// Format currency display for desktop/mobile
export const formatCurrencyDisplay = (currency, isMobile = false) => {
  if (!currency) return '';
  
  if (isMobile) {
    return currency.code;
  }
  
  return `${currency.code} (${currency.symbol}) - ${currency.name}`;
};

// Default salary ranges for validation (same as existing)
export const getDefaultSalaryRanges = () => {
  return {
    USD: { min: 200, max: 1000000 },
    EUR: { min: 180, max: 900000 },
    GBP: { min: 150, max: 800000 },
    CAD: { min: 250, max: 1200000 },
    AUD: { min: 300, max: 1200000 },
    JPY: { min: 200, max: 100000000 },
    INR: { min: 300, max: 50000000 },
    KES: { min: 500, max: 30000000 },
    NGN: { min: 100, max: 100000000 },
    ZAR: { min: 200, max: 5000000 }
  };
};

// Get salary range for a currency (with fallback)
export const getSalaryRange = (currencyCode) => {
  const ranges = getDefaultSalaryRanges();
  
  // Return specific range if available
  if (ranges[currencyCode]) {
    return ranges[currencyCode];
  }
  
  // Fallback ranges based on typical economic conditions
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) {
    return { min: 1000, max: 1000000 }; // Default range
  }
  
  // Basic categorization for salary ranges
  const highValueCurrencies = ['KWD', 'BHD', 'OMR', 'JOD']; // Typically high-value currencies
  const lowValueCurrencies = ['VND', 'IDR', 'KRW', 'JPY', 'LAK', 'UZS', 'IRR']; // High nominal value currencies
  
  if (highValueCurrencies.includes(currencyCode)) {
    return { min: 100, max: 100000 }; // For high-value currencies
  } else if (lowValueCurrencies.includes(currencyCode)) {
    return { min: 10000, max: 10000000 }; // For high nominal value currencies
  } else {
    return { min: 1000, max: 1000000 }; // Standard range for most currencies
  }
};