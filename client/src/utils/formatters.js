// formatters.js - Formatting utilities for data display

/**
 * Format currency value
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: USD)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', decimals = 2) => {
  if (value === undefined || value === null) return '-';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  return formatter.format(value);
};

/**
 * Format APT amount with proper decimals
 * @param {number|string} amount - APT amount
 * @param {number} decimals - Number of decimal places (default: 4)
 * @returns {string} Formatted APT amount
 */
export const formatAptAmount = (amount, decimals = 4) => {
  if (amount === undefined || amount === null) return '-';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '-';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + ' APT';
};

/**
 * Format percentage value
 * @param {number} value - Percentage value
 * @param {number} decimals - Number of decimal places
 * @param {boolean} includeSign - Include plus sign for positive values
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2, includeSign = true) => {
  if (value === undefined || value === null) return '-';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '-';
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  if (includeSign && num > 0) {
    return `+${formatted}%`;
  }
  
  return `${formatted}%`;
};

/**
 * Format number with thousands separators
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === undefined || value === null) return '-';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '-';
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format date as string
 * @param {Date|string} date - Date to format
 * @param {string} format - Format style ('short', 'medium', 'long', 'full')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: format === 'short' ? 'short' : 'long',
      day: 'numeric',
      ...(format === 'full' && { weekday: 'long' })
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

/**
 * Format date with time
 * @param {Date|string} dateTime - Date and time to format
 * @param {boolean} includeSeconds - Include seconds in time
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (dateTime, includeSeconds = false) => {
  if (!dateTime) return '-';
  
  try {
    const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds && { second: '2-digit' })
    });
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return '-';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format relative to now
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '-';
    
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateObj);
    }
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '-';
  }
};

/**
 * Format wallet address (truncate to show only start and end)
 * @param {string} address - Wallet address
 * @param {number} startChars - Number of starting characters to show
 * @param {number} endChars - Number of ending characters to show
 * @returns {string} Formatted address
 */
export const formatWalletAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '-';
  
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
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
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format allocation for presentation
 * @param {Array} allocation - Allocation array
 * @returns {Array} Formatted allocation
 */
export const formatAllocation = (allocation) => {
  if (!allocation || !Array.isArray(allocation)) {
    return [];
  }
  
  return allocation.map(item => ({
    ...item,
    formattedPercentage: formatPercentage(item.percentage, 0, false),
    formattedExpectedApr: formatPercentage(item.expectedApr, 2, false),
    formattedAmount: formatAptAmount(item.amount)
  }));
};

/**
 * Format transaction type for display
 * @param {string} type - Transaction type
 * @returns {string} Formatted transaction type
 */
export const formatTransactionType = (type) => {
  if (!type) return '-';
  
  const typeMap = {
    stake: 'Stake',
    unstake: 'Unstake',
    lend: 'Lend',
    withdraw: 'Withdraw',
    addLiquidity: 'Add Liquidity',
    removeLiquidity: 'Remove Liquidity',
    swap: 'Swap',
    transfer: 'Transfer',
    other: 'Other'
  };
  
  return typeMap[type.toLowerCase()] || type;
};

/**
 * Format transaction status for display
 * @param {string} status - Transaction status
 * @returns {string} Formatted transaction status
 */
export const formatTransactionStatus = (status) => {
  if (!status) return '-';
  
  const statusMap = {
    pending: 'Pending',
    submitted: 'Submitted',
    confirmed: 'Confirmed',
    failed: 'Failed',
    expired: 'Expired'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Format duration in milliseconds to human-readable time
 * @param {number} ms - Duration in milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (ms) => {
  if (!ms) return '-';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};