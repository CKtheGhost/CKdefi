// caching.js - Response caching middleware for CompounDefi
// Improves performance by caching API responses

const NodeCache = require('node-cache');

// Initialize cache with standard TTL of 5 minutes
const apiCache = new NodeCache({
  stdTTL: 300, // 5 minutes in seconds
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Store without cloning for better performance
});

// Cache time-to-live (TTL) configurations in seconds
const CACHE_TTL = {
  // Market data caching
  stakingData: 10 * 60, // 10 minutes
  tokenData: 5 * 60,    // 5 minutes
  newsData: 15 * 60,    // 15 minutes
  contractData: 60 * 60, // 1 hour
  
  // Protocol data caching
  protocolComparison: 30 * 60, // 30 minutes
  yieldRates: 10 * 60,         // 10 minutes
  
  // AI strategy caching
  generalStrategy: 60 * 60,    // 1 hour
  
  // Short cache for quick responses
  shortCache: 60               // 1 minute
};

/**
 * Generate cache key from request
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
function generateCacheKey(req) {
  const path = req.originalUrl || req.url;
  const method = req.method;
  
  // For authenticated requests, include user in cache key
  if (req.user) {
    return `${method}:${path}:${req.user.address}`;
  }
  
  return `${method}:${path}`;
}

/**
 * Determine TTL based on request path
 * @param {Object} req - Express request object
 * @returns {number} TTL in seconds
 */
function determineTTL(req) {
  const path = req.originalUrl || req.url;
  
  if (path.includes('/tokens/latest')) {
    return CACHE_TTL.tokenData;
  } else if (path.includes('/news/latest')) {
    return CACHE_TTL.newsData;
  } else if (path.includes('/staking')) {
    return CACHE_TTL.stakingData;
  } else if (path.includes('/contracts')) {
    return CACHE_TTL.contractData;
  } else if (path.includes('/protocols/comparison')) {
    return CACHE_TTL.protocolComparison;
  } else if (path.includes('/yield-rates')) {
    return CACHE_TTL.yieldRates;
  } else if (path.includes('/recommendations/general')) {
    return CACHE_TTL.generalStrategy;
  }
  
  // Default to short cache time
  return CACHE_TTL.shortCache;
}

/**
 * Check if request should be cached
 * @param {Object} req - Express request object
 * @returns {boolean} Whether request should be cached
 */
function shouldCache(req) {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return false;
  }
  
  // Don't cache requests with query parameter no-cache=true
  if (req.query && req.query['no-cache'] === 'true') {
    return false;
  }
  
  // Don't cache requests that have an Authorization header
  // (except if it's just for public APIs)
  if (req.headers.authorization && 
      !req.originalUrl.includes('/tokens/') && 
      !req.originalUrl.includes('/news/')) {
    return false;
  }
  
  // Don't cache wallet-specific data
  if (req.originalUrl.includes('/wallet/')) {
    return false;
  }
  
  // Don't cache AI recommendations with wallet address
  if (req.originalUrl.includes('/recommendations/ai') && req.query.walletAddress) {
    return false;
  }
  
  // Don't cache transaction-related endpoints
  if (req.originalUrl.includes('/execute') || 
      req.originalUrl.includes('/transaction') || 
      req.originalUrl.includes('/rebalance')) {
    return false;
  }
  
  return true;
}

/**
 * Cache middleware
 * @param {Object} options - Cache options
 * @returns {Function} Express middleware function
 */
function cacheMiddleware(options = {}) {
  return (req, res, next) => {
    // Skip caching if the request shouldn't be cached
    if (!shouldCache(req)) {
      return next();
    }
    
    // Generate cache key
    const key = options.key || generateCacheKey(req);
    
    // Try to retrieve from cache
    const cachedResponse = apiCache.get(key);
    
    if (cachedResponse) {
      // Add cache-related headers
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', 'public, max-age=300');
      
      // Return cached response
      return res.status(cachedResponse.status)
        .json(cachedResponse.data);
    }
    
    // If not cached, store the original send method
    const originalSend = res.send;
    
    // Override send method to cache response
    res.send = function(body) {
      // Only cache successful responses
      if (res.statusCode < 400) {
        // Parse response body if it's JSON
        let data;
        try {
          data = typeof body === 'string' ? JSON.parse(body) : body;
        } catch {
          data = body;
        }
        
        // Determine TTL
        const ttl = options.ttl || determineTTL(req);
        
        // Cache the response
        apiCache.set(key, {
          status: res.statusCode,
          data: data
        }, ttl);
        
        // Add cache-related headers
        res.set('X-Cache', 'MISS');
        res.set('Cache-Control', `public, max-age=${ttl}`);
      }
      
      // Call original send method
      originalSend.call(this, body);
    };
    
    next();
  };
}

/**
 * Clear specific cache entries
 * @param {string|RegExp} pattern - Pattern to match keys
 */
function clearCache(pattern) {
  if (!pattern) {
    return;
  }
  
  const keys = apiCache.keys();
  
  if (pattern instanceof RegExp) {
    // Clear by regex pattern
    const matchingKeys = keys.filter(key => pattern.test(key));
    matchingKeys.forEach(key => apiCache.del(key));
  } else if (typeof pattern === 'string') {
    // Clear by string match
    const matchingKeys = keys.filter(key => key.includes(pattern));
    matchingKeys.forEach(key => apiCache.del(key));
  }
}

/**
 * Clear cache for specific endpoints
 * @param {string} endpoint - Endpoint path
 */
function clearEndpointCache(endpoint) {
  clearCache(endpoint);
}

/**
 * Clear all cache
 */
function clearAllCache() {
  apiCache.flushAll();
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
function getCacheStats() {
  return {
    keys: apiCache.keys().length,
    hits: apiCache.getStats().hits,
    misses: apiCache.getStats().misses,
    ksize: apiCache.getStats().ksize,
    vsize: apiCache.getStats().vsize
  };
}

// Export functions
module.exports = {
  cacheMiddleware,
  clearCache,
  clearEndpointCache,
  clearAllCache,
  getCacheStats,
  CACHE_TTL
};