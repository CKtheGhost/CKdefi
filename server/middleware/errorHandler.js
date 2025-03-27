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

/**
 * Not found handler middleware
 */
function notFoundHandler(req, res, next) {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server`, 
    ErrorTypes.RESOURCE_NOT_FOUND, 
    404
  );
  next(err);
}

/**
 * Create blockchain transaction error
 * @param {string} message - Error message
 * @param {Object} details - Transaction details
 * @returns {AppError} Blockchain error
 */
function createTransactionError(message, details) {
  return new AppError(
    message || 'Transaction failed',
    ErrorTypes.TRANSACTION,
    400,
    details
  );
}

/**
 * Create API service error
 * @param {string} message - Error message
 * @param {Object} details - Service details
 * @returns {AppError} API service error
 */
function createServiceError(message, details) {
  return new AppError(
    message || 'Service unavailable',
    ErrorTypes.API_SERVICE,
    503,
    details
  );
}

module.exports = {
  ErrorTypes,
  AppError,
  errorHandler,
  catchAsync,
  notFoundHandler,
  createTransactionError,
  createServiceError
};