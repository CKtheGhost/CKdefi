// server/utils/validators.js - Input validation utilities

/**
 * Validate wallet address
 * @param {string} address - Wallet address to validate
 * @returns {boolean} Is valid address
 */
const isValidWalletAddress = (address) => {
  // Aptos wallet addresses are 66 characters long (with 0x prefix) and hexadecimal
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

/**
 * Validate investment amount
 * @param {number|string} amount - Amount to validate
 * @returns {boolean} Is valid amount
 */
const isValidAmount = (amount) => {
  // Convert to number if string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number greater than zero
  return !isNaN(num) && num > 0;
};

/**
 * Validate risk profile
 * @param {string} profile - Risk profile to validate
 * @returns {boolean} Is valid risk profile
 */
const isValidRiskProfile = (profile) => {
  const validProfiles = ['conservative', 'balanced', 'aggressive'];
  return validProfiles.includes(profile.toLowerCase());
};

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  // Basic email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Validate object against schema
 * @param {Object} obj - Object to validate
 * @param {Object} schema - Schema definition
 * @returns {Object} Validation result with errors
 */
const validateSchema = (obj, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    
    if (rules.required && (obj[field] === undefined || obj[field] === null || obj[field] === '')) {
      errors[field] = `${field} is required`;
    } else if (obj[field] !== undefined) {
      // Only validate if field is present
      if (rules.type && typeof obj[field] !== rules.type) {
        errors[field] = `${field} must be of type ${rules.type}`;
      }
      
      if (rules.min && obj[field] < rules.min) {
        errors[field] = `${field} must be at least ${rules.min}`;
      }
      
      if (rules.max && obj[field] > rules.max) {
        errors[field] = `${field} must be at most ${rules.max}`;
      }
      
      if (rules.pattern && !rules.pattern.test(obj[field])) {
        errors[field] = `${field} has invalid format`;
      }
      
      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(obj[field]);
        if (customError) {
          errors[field] = customError;
        }
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  isValidWalletAddress,
  isValidAmount,
  isValidRiskProfile,
  isValidEmail,
  sanitizeInput,
  validateSchema
};