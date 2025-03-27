// errorHandler.js - Global error handling middleware for CompounDefi
// Centralizes error handling and provides consistent error responses

// Error types enum for consistent categorization
const ErrorTypes = {
  VALIDATION: 'validation_error',
  AUTHENTICATION: 'authentication_error',
  AUTHORIZATION: 'authorization_error',
  RESOURCE_NOT_FOUND: 'resource_not_found',
  BLOCKCHAIN: 'blockchain_error',
  TRANSACTION: 'transaction_error',
  API_SERVICE: 'api_service_error',
  AI_SERVICE: 'ai_service_error',
  DATABASE: 'database_error',
  RATE_LIMIT: 'rate_limit_error',
  INTERNAL: 'internal_server_error'
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, type, statusCode, details = null) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Format error response for API
 * @param {Error} err - The error object
 * @returns {Object} Formatted error response
 */
function formatErrorResponse(err) {
  // Default error type and status code
  const errorType = err.type || ErrorTypes.INTERNAL;
  const statusCode = err.statusCode || 500;
  
  // Base error response
  const errorResponse = {
    status: 'error',
    type: errorType,
    message: err.message || 'An unexpected error occurred',
    timestamp: err.timestamp || new Date().toISOString(),
    path: null // Will be set in the middleware function
  };
  
  // Add stack trace in development environment
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }
  
  // Add details if available
  if (err.details) {
    errorResponse.details = err.details;
  }
  
  return { statusCode, errorResponse };
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error(`Error processing ${req.method} ${req.originalUrl}:`, err);
  
  // Format error response
  const { statusCode, errorResponse } = formatErrorResponse(err);
  
  // Add request path to error response
  errorResponse.path = req.originalUrl;
  
  // Special handling for validation errors
  if (err.name === 'ValidationError' || err.type === ErrorTypes.VALIDATION) {
    return res.status(400).json(errorResponse);
  }
  
  // Handle JWT authentication errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    errorResponse.type = ErrorTypes.AUTHENTICATION;
    return res.status(401).json(errorResponse);
  }
  
  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * Catch async errors in route handlers
 * @param {Function} fn - Async route handler function
 * @returns {Function} Middleware function with error handling
 */
function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// validation.js - Request validation middleware for CompounDefi
// Validates incoming requests to ensure data integrity and security

const { AppError, ErrorTypes } = require('./errorHandler');
const { isAddress } = require('../utils/validators');

/**
 * Validate wallet address format
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateWalletAddress(req, res, next) {
  const address = req.params.address || req.body.walletAddress || req.query.walletAddress;
  
  if (!address) {
    return next(new AppError('Wallet address is required', ErrorTypes.VALIDATION, 400));
  }
  
  if (!isAddress(address)) {
    return next(new AppError('Invalid wallet address format', ErrorTypes.VALIDATION, 400));
  }
  
  next();
}

/**
 * Validate AI recommendation parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateRecommendationParams(req, res, next) {
  const { amount, riskProfile } = req.query;
  
  // Validate amount
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return next(new AppError('Invalid amount parameter', ErrorTypes.VALIDATION, 400, {
      field: 'amount',
      error: 'Amount must be a positive number'
    }));
  }
  
  // Validate risk profile
  const validRiskProfiles = ['conservative', 'balanced', 'aggressive'];
  if (!riskProfile || !validRiskProfiles.includes(riskProfile.toLowerCase())) {
    return next(new AppError('Invalid risk profile', ErrorTypes.VALIDATION, 400, {
      field: 'riskProfile',
      error: `Risk profile must be one of: ${validRiskProfiles.join(', ')}`,
      providedValue: riskProfile
    }));
  }
  
  next();
}

/**
 * Validate strategy execution parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateStrategyExecution(req, res, next) {
  const { walletAddress, operations } = req.body;
  
  // Validate wallet address
  if (!walletAddress || !isAddress(walletAddress)) {
    return next(new AppError('Invalid wallet address', ErrorTypes.VALIDATION, 400));
  }
  
  // Validate operations array
  if (!operations || !Array.isArray(operations) || operations.length === 0) {
    return next(new AppError('Operations must be a non-empty array', ErrorTypes.VALIDATION, 400));
  }
  
  // Validate each operation
  const invalidOperations = operations.filter(op => {
    return (
      !op.protocol ||
      !op.type ||
      !op.amount ||
      isNaN(parseFloat(op.amount)) ||
      parseFloat(op.amount) <= 0 ||
      !op.contractAddress ||
      !op.contractAddress.startsWith('0x')
    );
  });
  
  if (invalidOperations.length > 0) {
    return next(new AppError('Invalid operations found', ErrorTypes.VALIDATION, 400, {
      invalidOperations: invalidOperations.map(op => ({
        protocol: op.protocol,
        type: op.type,
        errors: getOperationErrors(op)
      }))
    }));
  }
  
  next();
}

/**
 * Helper function to identify errors in an operation
 * @param {Object} operation - Operation object
 * @returns {Array} List of errors
 */
function getOperationErrors(operation) {
  const errors = [];
  
  if (!operation.protocol) {
    errors.push('Missing protocol');
  }
  
  if (!operation.type) {
    errors.push('Missing operation type');
  }
  
  if (!operation.amount) {
    errors.push('Missing amount');
  } else if (isNaN(parseFloat(operation.amount)) || parseFloat(operation.amount) <= 0) {
    errors.push('Invalid amount (must be a positive number)');
  }
  
  if (!operation.contractAddress) {
    errors.push('Missing contract address');
  } else if (!operation.contractAddress.startsWith('0x')) {
    errors.push('Invalid contract address format');
  }
  
  return errors;
}

/**
 * Validate user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateUserPreferences(req, res, next) {
  const { riskProfile, activeSection, darkMode } = req.body;
  
  // Validate risk profile if provided
  if (riskProfile !== undefined) {
    const validRiskProfiles = ['conservative', 'balanced', 'aggressive'];
    if (!validRiskProfiles.includes(riskProfile.toLowerCase())) {
      return next(new AppError('Invalid risk profile', ErrorTypes.VALIDATION, 400, {
        field: 'riskProfile',
        error: `Risk profile must be one of: ${validRiskProfiles.join(', ')}`
      }));
    }
  }
  
  // Validate active section if provided
  if (activeSection !== undefined) {
    const validSections = [
      'market-overview', 
      'protocol-comparison', 
      'wallet-analysis', 
      'ai-recommendation', 
      'news-feed',
      'portfolio-balancer'
    ];
    
    if (!validSections.includes(activeSection)) {
      return next(new AppError('Invalid active section', ErrorTypes.VALIDATION, 400, {
        field: 'activeSection',
        error: `Active section must be one of: ${validSections.join(', ')}`
      }));
    }
  }
  
  // Validate dark mode if provided
  if (darkMode !== undefined && typeof darkMode !== 'boolean') {
    return next(new AppError('Invalid dark mode value', ErrorTypes.VALIDATION, 400, {
      field: 'darkMode',
      error: 'Dark mode must be a boolean value'
    }));
  }
  
  next();
}

/**
 * Validate auto-rebalance settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateRebalanceSettings(req, res, next) {
  const { walletAddress, enabled, interval, threshold, slippage } = req.body;
  
  // Validate wallet address
  if (!walletAddress || !isAddress(walletAddress)) {
    return next(new AppError('Invalid wallet address', ErrorTypes.VALIDATION, 400));
  }
  
  // Validate enabled flag if provided
  if (enabled !== undefined && typeof enabled !== 'boolean') {
    return next(new AppError('Invalid enabled value', ErrorTypes.VALIDATION, 400, {
      field: 'enabled',
      error: 'Enabled must be a boolean value'
    }));
  }
  
  // Validate interval if provided
  if (interval !== undefined) {
    if (isNaN(parseInt(interval)) || interval < 1 || interval > 168) {
      return next(new AppError('Invalid interval', ErrorTypes.VALIDATION, 400, {
        field: 'interval',
        error: 'Interval must be between 1 and 168 hours'
      }));
    }
  }
  
  // Validate threshold if provided
  if (threshold !== undefined) {
    if (isNaN(parseFloat(threshold)) || threshold < 0.5 || threshold > 20) {
      return next(new AppError('Invalid threshold', ErrorTypes.VALIDATION, 400, {
        field: 'threshold',
        error: 'Threshold must be between 0.5% and 20%'
      }));
    }
  }
  
  // Validate slippage if provided
  if (slippage !== undefined) {
    if (isNaN(parseFloat(slippage)) || slippage < 0.1 || slippage > 5) {
      return next(new AppError('Invalid slippage', ErrorTypes.VALIDATION, 400, {
        field: 'slippage',
        error: 'Slippage must be between 0.1% and 5%'
      }));
    }
  }
  
  next();
}

module.exports = {
  validateWalletAddress,
  validateRecommendationParams,
  validateStrategyExecution,
  validateUserPreferences,
  validateRebalanceSettings
};