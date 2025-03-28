// src/utils/validators.js
// Validation utility functions for CompounDefi

/**
 * Validate if a string is a valid Aptos wallet address
 * @param {string} address - Wallet address to validate
 * @returns {boolean} Whether the address is valid
 */
export const isValidAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  // Check address format (hexadecimal with 0x prefix, 64 characters after prefix)
  const addressRegex = /^0x[a-fA-F0-9]{64}$/;
  return addressRegex.test(address);
};

/**
 * Validate if a number is a valid amount
 * @param {string|number} amount - Amount to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} Whether the amount is valid
 */
export const isValidAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsedAmount = parseFloat(amount);
  return !isNaN(parsedAmount) && parsedAmount >= min && parsedAmount <= max;
};

/**
 * Validate recommendations form input
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with any errors
 */
export const validateRecommendationForm = (formData) => {
  const errors = {};
  
  // Validate amount
  if (!formData.amount) {
    errors.amount = 'Investment amount is required';
  } else if (!isValidAmount(formData.amount, 0.1)) {
    errors.amount = 'Investment amount must be at least 0.1';
  }
  
  // Validate risk profile
  if (!formData.riskProfile) {
    errors.riskProfile = 'Risk profile is required';
  }
  
  // Validate wallet address if provided
  if (formData.walletAddress && !isValidAddress(formData.walletAddress)) {
    errors.walletAddress = 'Invalid wallet address format';
  }
  
  // Validate max protocols if provided
  if (formData.maxProtocols && (!Number.isInteger(parseInt(formData.maxProtocols)) || parseInt(formData.maxProtocols) < 1)) {
    errors.maxProtocols = 'Maximum protocols must be a positive integer';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate optimizer settings
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validation result with any errors
 */
export const validateOptimizerSettings = (settings) => {
  const errors = {};
  
  // Validate interval
  if (settings.interval === undefined || settings.interval === null) {
    errors.interval = 'Rebalance interval is required';
  } else if (!Number.isInteger(parseInt(settings.interval)) || parseInt(settings.interval) < 1 || parseInt(settings.interval) > 168) {
    errors.interval = 'Rebalance interval must be between 1 and 168 hours';
  }
  
  // Validate rebalance threshold
  if (settings.rebalanceThreshold === undefined || settings.rebalanceThreshold === null) {
    errors.rebalanceThreshold = 'Rebalance threshold is required';
  } else if (!isValidAmount(settings.rebalanceThreshold, 0.5, 20)) {
    errors.rebalanceThreshold = 'Rebalance threshold must be between 0.5% and 20%';
  }
  
  // Validate max slippage
  if (settings.maxSlippage === undefined || settings.maxSlippage === null) {
    errors.maxSlippage = 'Maximum slippage is required';
  } else if (!isValidAmount(settings.maxSlippage, 0.1, 5)) {
    errors.maxSlippage = 'Maximum slippage must be between 0.1% and 5%';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate if a transaction payload is valid
 * @param {Object} payload - Transaction payload
 * @returns {boolean} Whether the payload is valid
 */
export const isValidTransactionPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return false;
  
  // Check required fields
  if (!payload.function || typeof payload.function !== 'string') return false;
  if (!Array.isArray(payload.type_arguments)) return false;
  if (!Array.isArray(payload.arguments)) return false;
  
  return true;
};

/**
 * Validate if an email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Use basic regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize input to prevent XSS attacks
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score and feedback
 */
export const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { score: 0, feedback: 'Password is required' };
  }
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long');
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 3) {
    feedback.push('Password should include uppercase, lowercase, numbers, and special characters');
  }
  
  return {
    score,
    feedback: feedback.join('. '),
    isStrong: score >= 3 && password.length >= 8
  };
};

export default {
  isValidAddress,
  isValidAmount,
  validateRecommendationForm,
  validateOptimizerSettings,
  isValidTransactionPayload,
  isValidEmail,
  sanitizeInput,
  validatePasswordStrength
};