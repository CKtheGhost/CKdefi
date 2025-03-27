// index.js - Export all middleware modules for CompounDefi
// Central export file to simplify middleware imports

const auth = require('./auth');
const rateLimit = require('./rateLimit');
const errorHandler = require('./errorHandler');
const validation = require('./validation');
const logging = require('./logging');
const caching = require('./caching');
const metrics = require('./metrics');

/**
 * Apply all middleware to Express app
 * @param {Object} app - Express app
 * @param {Object} options - Configuration options
 */
function applyMiddleware(app, options = {}) {
  const {
    enableMetrics = true,
    enableLogging = true,
    enableCaching = true,
    enableRateLimiting = true
  } = options;
  
  // Apply middleware in the correct order
  
  // 1. Logging middleware (early to capture all requests)
  if (enableLogging) {
    app.use(logging.requestLogger({
      logLevel: process.env.LOG_LEVEL || 'INFO',
      slowThreshold: 1000,
      excludePaths: ['/health', '/metrics', '/ready']
    }));
  }
  
  // 2. Metrics middleware
  if (enableMetrics) {
    app.use(metrics.metricsMiddleware());
    metrics.setupMetricsEndpoint(app, { server: options.server });
  }
  
  // 3. Rate limiting middleware
  if (enableRateLimiting) {
    // Apply rate limiting to API routes
    app.use('/api/', rateLimit.standardApiLimiter);
    
    // Apply specific rate limits to resource-intensive endpoints
    app.use('/api/recommendations/ai', rateLimit.aiRecommendationLimiter);
    app.use('/api/execute-strategy', rateLimit.transactionRateLimiter);
    app.use('/api/wallet/:address', rateLimit.walletOperationsLimiter);
  }
  
  // 4. Authentication middleware (applied selectively per route)
  // NOTE: Auth middleware is not applied globally here
  // It should be applied to specific routes in route files
  
  // 5. Caching middleware
  if (enableCaching) {
    app.use(caching.cacheMiddleware());
  }
  
  // 6. Special logging for AI requests and transactions
  if (enableLogging) {
    app.use(logging.aiServiceLogger);
    app.use(logging.transactionLogger);
  }
  
  // Error handling middleware (applied last)
  app.use(errorHandler.notFoundHandler);
  app.use(errorHandler.errorHandler);
}

module.exports = {
  auth,
  rateLimit,
  errorHandler,
  validation,
  logging,
  caching,
  metrics,
  applyMiddleware
};