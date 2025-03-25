// formatters.js - Utility functions for formatting data in CompounDefi

/**
 * Format a number as currency with specified options
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', showSymbol = true) => {
  if (value === undefined || value === null) return '-';
  
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: showSymbol ? 'currency' : 'decimal',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: numValue >= 1000 ? 0 : numValue >= 100 ? 1 : 2
    });
    
    return formatter.format(numValue);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${value}`;
  }
};

/**
 * Format a percentage value
 * @param {number} value - Percentage value
 * @param {number} decimalPlaces - Number of decimal places
 * @param {boolean} includeSymbol - Whether to include the % symbol
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimalPlaces = 2, includeSymbol = true) => {
  if (value === undefined || value === null) return '-';
  
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    
    const formatted = numValue.toFixed(decimalPlaces);
    return includeSymbol ? `${formatted}%` : formatted;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}${includeSymbol ? '%' : ''}`;
  }
};

/**
 * Format a number with thousand separators
 * @param {number} value - Number to format
 * @param {number} decimalPlaces - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return '-';
  
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  } catch (error) {
    console.error('Error formatting number:', error);
    return `${value}`;
  }
};

/**
 * Format an APT amount with appropriate decimal places
 * @param {number|string} amount - APT amount
 * @param {number} decimalPlaces - Number of decimal places (default: 4)
 * @returns {string} Formatted APT amount
 */
export const formatAptAmount = (amount, decimalPlaces = 4) => {
  if (amount === undefined || amount === null) return '-';
  
  try {
    const numValue = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numValue)) return '-';
    
    if (numValue === 0) return '0 APT';
    
    // Adjust decimal places based on the value
    let places = decimalPlaces;
    if (numValue >= 1000) places = 2;
    else if (numValue < 0.001) places = 8;
    else if (numValue < 0.1) places = 6;
    
    return `${numValue.toFixed(places)} APT`;
  } catch (error) {
    console.error('Error formatting APT amount:', error);
    return `${amount} APT`;
  }
};

/**
 * Format a wallet address for display
 * @param {string} address - Wallet address
 * @param {number} prefixLength - Number of prefix characters to show
 * @param {number} suffixLength - Number of suffix characters to show
 * @returns {string} Formatted address
 */
export const formatAddress = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address) return '';
  
  try {
    if (address.length <= prefixLength + suffixLength) return address;
    
    return `${address.substring(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
  } catch (error) {
    console.error('Error formatting address:', error);
    return address;
  }
};

/**
 * Format a date or timestamp
 * @param {string|number|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return `${date}`;
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {string|number|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    
    // Fall back to standard date format for older dates
    return formatDate(dateObj, { hour: undefined, minute: undefined });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return `${date}`;
  }
};

/**
 * Format APR for display
 * @param {number|string} apr - APR value
 * @param {boolean} includeSymbol - Whether to include the % symbol
 * @returns {string} Formatted APR
 */
export const formatAPR = (apr, includeSymbol = true) => {
  if (apr === undefined || apr === null) return '-';
  
  try {
    const numValue = typeof apr === 'string' ? parseFloat(apr) : apr;
    if (isNaN(numValue)) return '-';
    
    // Use two decimal places for most APRs, but more for very small values
    const decimalPlaces = numValue < 0.01 ? 4 : 2;
    return formatPercentage(numValue, decimalPlaces, includeSymbol);
  } catch (error) {
    console.error('Error formatting APR:', error);
    return `${apr}${includeSymbol ? '%' : ''}`;
  }
};

/**
 * Format a time duration in a human-readable way
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds || milliseconds <= 0) return '-';
  
  try {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  } catch (error) {
    console.error('Error formatting duration:', error);
    return '-';
  }
};

/**
 * Format a value for compact display (e.g., 1.2K, 3.5M)
 * @param {number} value - Value to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted compact value
 */
export const formatCompact = (value, precision = 1) => {
  if (value === undefined || value === null) return '-';
  
  try {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '-';
    
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: precision
    });
    
    return formatter.format(numValue);
  } catch (error) {
    console.error('Error formatting compact value:', error);
    return `${value}`;
  }
};