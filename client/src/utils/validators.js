// validators.js - Client-side validation utilities

/**
 * Validate wallet address format
 * @param {string} address - Wallet address to validate
 * @returns {boolean} Is valid address
 */
export const isValidWalletAddress = (address) => {
  if (!address) return false;
  // Aptos wallet addresses are 66 characters long (with 0x prefix) and hexadecimal
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

/**
 * Validate investment amount
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum valid amount
 * @param {number} max - Maximum valid amount
 * @returns {boolean} Is valid amount
 */
export const isValidAmount = (amount, min = 0, max = Infinity) => {
  // Convert to number if string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number greater than zero and within range
  return !isNaN(num) && num > min && num <= max;
};

/**
 * Validate risk profile
 * @param {string} profile - Risk profile to validate
 * @returns {boolean} Is valid risk profile
 */
export const isValidRiskProfile = (profile) => {
  const validProfiles = ['conservative', 'balanced', 'aggressive', 'maxYield'];
  return profile && validProfiles.includes(profile.toLowerCase());
};

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  // Basic email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate that input is a positive number
 * @param {number|string} value - Value to validate
 * @returns {boolean} Is positive number
 */
export const isPositiveNumber = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num > 0;
};

/**
 * Validate percentage (0-100)
 * @param {number|string} value - Value to validate
 * @returns {boolean} Is valid percentage
 */
export const isValidPercentage = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0 && num <= 100;
};

/**
 * Validate integer
 * @param {number|string} value - Value to validate
 * @returns {boolean} Is integer
 */
export const isInteger = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && Number.isInteger(num);
};

/**
 * Validate form fields against schema
 * @param {Object} values - Form values
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result with errors
 */
export const validateForm = (values, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const value = values[field];
    
    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = rules.message || `${field} is required`;
      return;
    }
    
    // Skip validation if field is not required and empty
    if ((value === undefined || value === null || value === '') && !rules.required) {
      return;
    }
    
    // Check field type
    if (rules.type === 'email' && !isValidEmail(value)) {
      errors[field] = rules.message || 'Invalid email format';
    } else if (rules.type === 'walletAddress' && !isValidWalletAddress(value)) {
      errors[field] = rules.message || 'Invalid wallet address format';
    } else if (rules.type === 'number' && isNaN(parseFloat(value))) {
      errors[field] = rules.message || 'Must be a number';
    } else if (rules.type === 'integer' && !isInteger(value)) {
      errors[field] = rules.message || 'Must be an integer';
    }
    
    // Check min/max for numbers
    if (rules.type === 'number' && !isNaN(parseFloat(value))) {
      const num = parseFloat(value);
      if (rules.min !== undefined && num < rules.min) {
        errors[field] = rules.message || `Must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && num > rules.max) {
        errors[field] = rules.message || `Must be at most ${rules.max}`;
      }
    }
    
    // Check string length
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = rules.message || `Must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = rules.message || `Must be at most ${rules.maxLength} characters`;
      }
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || 'Invalid format';
    }
    
    // Custom validation
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation schemas
export const validationSchemas = {
  // AI recommendation request schema
  recommendationForm: {
    amount: { 
      required: true, 
      type: 'number', 
      min: 0.01,
      message: 'Please enter a valid investment amount (minimum 0.01)'
    },
    riskProfile: { 
      required: true, 
      validate: isValidRiskProfile,
      message: 'Please select a valid risk profile'
    }
  },
  
  // Auto-rebalance settings schema
  rebalanceSettings: {
    threshold: {
      required: true,
      type: 'number',
      min: 1,
      max: 20,
      message: 'Threshold must be between 1% and 20%'
    },
    interval: {
      required: true,
      type: 'number',
      min: 1,
      message: 'Interval must be at least 1 hour'
    },
    slippage: {
      required: true,
      type: 'number',
      min: 0.1,
      max: 5,
      message: 'Slippage must be between 0.1% and 5%'
    }
  },
  
  // User settings schema
  userSettings: {
    riskProfile: {
      required: true,
      validate: isValidRiskProfile,
      message: 'Please select a valid risk profile'
    },
    email: {
      required: false,
      type: 'email',
      message: 'Please enter a valid email address'
    }
  }
};