// server/middleware/validation.js
// Input validation middleware

const { 
  isValidWalletAddress, 
  isValidAmount, 
  isValidRiskProfile,
  validateSchema 
} = require('../utils/validators');

/**
 * Validate wallet address middleware
 */
const validateWalletAddress = (req, res, next) => {
  const walletAddress = req.params.walletAddress || req.body.walletAddress;
  
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }
  
  if (!isValidWalletAddress(walletAddress)) {
    return res.status(400).json({ error: 'Invalid wallet address format' });
  }
  
  next();
};

/**
 * Validate investment amount middleware
 */
const validateAmount = (req, res, next) => {
  const amount = req.query.amount || req.body.amount;
  
  if (!amount) {
    return res.status(400).json({ error: 'Investment amount is required' });
  }
  
  if (!isValidAmount(amount)) {
    return res.status(400).json({ error: 'Invalid investment amount' });
  }
  
  next();
};

/**
 * Validate risk profile middleware
 */
const validateRiskProfile = (req, res, next) => {
  const riskProfile = req.query.riskProfile || req.body.riskProfile;
  
  if (!riskProfile) {
    return res.status(400).json({ error: 'Risk profile is required' });
  }
  
  if (!isValidRiskProfile(riskProfile)) {
    return res.status(400).json({ 
      error: 'Invalid risk profile. Must be one of: conservative, balanced, aggressive' 
    });
  }
  
  next();
};

/**
 * Generic schema validation middleware factory
 * @param {Object} schema - Schema definition
 * @returns {Function} Express middleware
 */
const validateRequestSchema = (schema) => {
  return (req, res, next) => {
    const { isValid, errors } = validateSchema(req.body, schema);
    
    if (!isValid) {
      return res.status(400).json({
        error: 'Validation error',
        details: errors
      });
    }
    
    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration schema
  userRegistration: {
    walletAddress: { required: true, type: 'string' },
    signature: { required: true, type: 'string' },
    message: { required: true, type: 'string' }
  },
  
  // User preferences schema
  userPreferences: {
    preferences: { required: true, type: 'object' }
  },
  
  // AI recommendation request schema
  recommendationRequest: {
    amount: { required: true, type: 'number', min: 0.01 },
    riskProfile: { required: true, type: 'string' },
    walletAddress: { required: false, type: 'string' }
  }
};

module.exports = {
  validateWalletAddress,
  validateAmount,
  validateRiskProfile,
  validateRequestSchema,
  schemas
};