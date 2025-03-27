// errorHandler.js - Global error handling middleware for CompounDefi
// Centralizes error handling and provides consistent error responses

// Placeholder for a logging library (e.g., Winston)
const logger = {
  error: (msg, err) => console.error(msg, err) // Replace with actual logger
};

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
  constructor(message, type, statusCode, details = null, code = null) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Format error response for API
 * @param {Error} err - The error object
 * @returns {Object} Formatted error response with status code and body
 */
function formatErrorResponse(err) {
  const errorType = err.type || ErrorTypes.INTERNAL;
  const statusCode = err.statusCode || 500;

  const errorResponse = {
    status: 'error',
    type: errorType,
    message: err.message || 'An unexpected error occurred',
    timestamp: err.timestamp || new Date().toISOString(),
    path: null, // Will be set in middleware
    errorId: generateUniqueId() // Unique identifier for tracking
  };

  // Include stack trace and details only in development
  if (process.env.NODE_ENV === 'development') {
    if (err.stack) errorResponse.stack = err.stack;
    if (err.details) errorResponse.details = err.details;
  }

  if (err.code) {
    errorResponse.code = err.code;
  }

  return { statusCode, errorResponse };
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  // Error handling logic
  logger.error(`Error processing ${req.method} ${req.originalUrl}:`, err);
  const { statusCode, errorResponse } = formatErrorResponse(err);
  errorResponse.path = req.originalUrl;

  if (err.name === 'ValidationError' || err.type === ErrorTypes.VALIDATION) {
    return res.status(400).json(errorResponse);
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    errorResponse.type = ErrorTypes.AUTHENTICATION;
    return res.status(401).json(errorResponse);
  }

  if (err.name === 'DatabaseError') { // Example of additional error handling
    errorResponse.type = ErrorTypes.DATABASE;
    return res.status(500).json(errorResponse);
  }

  // Default response for unhandled errors
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

/**
 * Generate a unique error ID (simple implementation)
 * @returns {string} Unique identifier
 */
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15);
}

// Removed the duplicate errorHandler declaration

module.exports = {
  ErrorTypes,
  AppError,
  errorHandler,
  catchAsync,
  notFoundHandler,
  createTransactionError,
  createServiceError
};