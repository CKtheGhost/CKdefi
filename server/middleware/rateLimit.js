// rateLimit.js - Rate limiting middleware for CompounDefi API
// Prevents abuse and ensures fair service access

const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Configure standard API rate limiting
const standardApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    error: 'Too many requests, please try again later.',
    nextAllowedRequest: (info) => new Date(info.resetTime).toISOString()
  }
});

// Configure AI recommendation rate limiting (more strict due to resource usage)
const aiRecommendationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 AI recommendations per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'AI recommendation rate limit reached. Please try again later.',
    nextAllowedRequest: (info) => new Date(info.resetTime).toISOString()
  }
});

// More advanced rate limiter for transaction submission
const transactionLimiter = new RateLimiterMemory({
  points: 5, // Number of transactions allowed
  duration: 60, // Per 1 minute
  blockDuration: 60 * 10, // Block for 10 minutes if exceeded
});

// Middleware to apply transaction rate limiting
const transactionRateLimiter = async (req, res, next) => {
  // Get wallet address or IP for rate limiting
  const key = req.user?.address || req.ip;
  
  try {
    await transactionLimiter.consume(key);
    next();
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      // This is a rate limit error
      return res.status(429).json({
        error: 'Transaction rate limit exceeded',
        retryAfter: Math.ceil(error.msBeforeNext / 1000) || 60,
        message: 'Too many transactions submitted. Please try again later.'
      });
    }
    
    // For other errors, pass to next error handler
    next(error);
  }
};

// Custom authenticatedRateLimiter that limits based on wallet address if available
const createAuthenticatedRateLimiter = (options) => {
  const limiter = new RateLimiterMemory({
    points: options.max || 100,
    duration: (options.windowMs || 15 * 60 * 1000) / 1000, // Convert ms to seconds
    blockDuration: options.blockDuration || 60, // Block for 1 minute by default
  });
  
  return async (req, res, next) => {
    const key = req.user?.address || req.ip;
    
    try {
      await limiter.consume(key);
      next();
    } catch (error) {
      if (error.remainingPoints !== undefined) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil(error.msBeforeNext / 1000) || 60,
          message: options.message || 'Too many requests, please try again later.'
        });
      }
      next(error);
    }
  };
};

// Wallet operations specific rate limiter
const walletOperationsLimiter = createAuthenticatedRateLimiter({
  max: 20, // 20 operations
  windowMs: 5 * 60 * 1000, // per 5 minutes
  message: 'Wallet operation rate limit exceeded. Please try again in a few minutes.'
});

module.exports = {
  standardApiLimiter,
  aiRecommendationLimiter,
  transactionRateLimiter,
  walletOperationsLimiter,
  createAuthenticatedRateLimiter
};