// src/utils/formatters.js
// Utility functions for formatting values

/**
 * Format a number to a currency string
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: USD)
 * @param {number} digits - Number of decimal digits (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', digits = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '$0.00';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  
  return formatter.format(value);
};

/**
 * Format a number with thousands separators
 * @param {number} value - Value to format
 * @param {number} digits - Number of decimal digits (default: 2)
 * @returns {string} Formatted number
 */
export const formatNumber = (value, digits = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  
  return formatter.format(value);
};

/**
 * Format a percentage value
 * @param {number} value - Value to format (e.g., 0.25 for 25%)
 * @param {number} digits - Number of decimal digits (default: 2)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, digits = 2) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0%';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  
  return formatter.format(value / 100);
};

/**
 * Format a date
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format style ('full', 'long', 'medium', 'short', or 'relative')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) {
    return '';
  }
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  if (format === 'relative') {
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    
    // Convert diff to seconds
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return 'just now';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
  
  const options = {
    full: { dateStyle: 'full', timeStyle: 'long' },
    long: { dateStyle: 'long', timeStyle: 'short' },
    medium: { dateStyle: 'medium' },
    short: { dateStyle: 'short' }
  };
  
  return new Intl.DateTimeFormat('en-US', options[format] || options.medium).format(dateObj);
};

/**
 * Format an address for display (0x1234...5678)
 * @param {string} address - Address to format
 * @param {number} prefixLength - Number of characters to show at start
 * @param {number} suffixLength - Number of characters to show at end
 * @returns {string} Formatted address
 */
export const formatAddress = (address, prefixLength = 6, suffixLength = 4) => {
  if (!address || typeof address !== 'string') {
    return '';
  }
  
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format duration in milliseconds to human-readable string
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds || isNaN(milliseconds) || milliseconds < 0) {
    return '0s';
  }
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  
  return `${seconds}s`;
};

/**
 * Format APR value
 * @param {number} apr - APR value (e.g. 7.5 for 7.5%)
 * @param {number} digits - Number of decimal places
 * @returns {string} Formatted APR with % sign
 */
export const formatAPR = (apr, digits = 2) => {
  if (apr === undefined || apr === null || isNaN(apr)) {
    return '0%';
  }
  
  return `${parseFloat(apr).toFixed(digits)}%`;
};

/**
 * Format large numbers with k, M, B, T suffixes
 * @param {number} value - Number to format
 * @param {number} digits - Number of decimal places
 * @returns {string} Formatted number with suffix
 */
export const formatCompactNumber = (value, digits = 1) => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: digits
  });
  
  return formatter.format(value);
};

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatAddress,
  formatFileSize,
  formatDuration,
  formatAPR,
  formatCompactNumber
};