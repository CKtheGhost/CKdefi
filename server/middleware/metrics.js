// metrics.js - Performance metrics middleware for CompounDefi
// Collects and exposes metrics for monitoring application performance

const promClient = require('prom-client');
const { createTerminus } = require('@godaddy/terminus');

// Initialize metrics registry
const registry = new promClient.Registry();

// Add default metrics (memory, CPU, etc.)
promClient.collectDefaultMetrics({ register: registry });

// Define custom metrics

// HTTP request duration histogram
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2.5, 5, 10]
});

// HTTP request counter
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// AI recommendation metrics
const aiRecommendationCounter = new promClient.Counter({
  name: 'ai_recommendations_total',
  help: 'Total number of AI recommendations generated',
  labelNames: ['risk_profile', 'has_wallet', 'success']
});

const aiRecommendationDuration = new promClient.Histogram({
  name: 'ai_recommendation_duration_seconds',
  help: 'Duration of AI recommendation generation in seconds',
  labelNames: ['risk_profile', 'has_wallet'],
  buckets: [0.5, 1, 2, 5, 10, 20, 30, 60]
});

// Transaction execution metrics
const transactionCounter = new promClient.Counter({
  name: 'transactions_total',
  help: 'Total number of blockchain transactions',
  labelNames: ['protocol', 'operation_type', 'status']
});

const transactionDuration = new promClient.Histogram({
  name: 'transaction_duration_seconds',
  help: 'Duration of blockchain transactions in seconds',
  labelNames: ['protocol', 'operation_type'],
  buckets: [1, 5, 10, 30, 60, 120, 300]
});

// Strategy execution metrics
const strategyCounter = new promClient.Counter({
  name: 'strategy_executions_total',
  help: 'Total number of strategy executions',
  labelNames: ['operation_count', 'success']
});

// Auto-rebalance metrics
const rebalanceCounter = new promClient.Counter({
  name: 'auto_rebalances_total',
  help: 'Total number of auto-rebalance operations',
  labelNames: ['trigger_type', 'success']
});

// Token price metrics
const tokenPriceGauge = new promClient.Gauge({
  name: 'token_price_usd',
  help: 'Current token price in USD',
  labelNames: ['token_symbol']
});

// Register all metrics
registry.registerMetric(httpRequestDurationMicroseconds);
registry.registerMetric(httpRequestCounter);
registry.registerMetric(aiRecommendationCounter);
registry.registerMetric(aiRecommendationDuration);
registry.registerMetric(transactionCounter);
registry.registerMetric(transactionDuration);
registry.registerMetric(strategyCounter);
registry.registerMetric(rebalanceCounter);
registry.registerMetric(tokenPriceGauge);

/**
 * Metrics middleware to track HTTP request metrics
 * @returns {Function} Express middleware function
 */
function metricsMiddleware() {
  return (req, res, next) => {
    // Skip metrics endpoint to avoid circular measurements
    if (req.path === '/metrics') {
      return next();
    }
    
    // Extract route and normalize it by replacing params with placeholders
    const route = req.route ? 
      req.baseUrl + req.route.path : 
      req.path.toLowerCase()
        .replace(/\d+/g, ':id')
        .replace(/0x[a-fA-F0-9]{64}/g, ':address');
    
    // Start timer
    const end = httpRequestDurationMicroseconds.startTimer();
    
    // Save original end method
    const originalEnd = res.end;
    
    // Override end method to capture response
    res.end = function(...args) {
      // Record metrics
      const statusCode = res.statusCode;
      const method = req.method;
      
      // Increment request counter
      httpRequestCounter.inc({ method, route, status_code: statusCode });
      
      // Observe request duration
      end({ method, route, status_code: statusCode });
      
      // Call original end method
      originalEnd.apply(res, args);
    };
    
    next();
  };
}

/**
 * Setup metrics endpoint
 * @param {Object} app - Express app
 * @param {Object} options - Options
 */
function setupMetricsEndpoint(app, options = {}) {
  app.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', registry.contentType);
      res.end(await registry.metrics());
    } catch (err) {
      res.status(500).end(err);
    }
  });
  
  // Setup health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Setup readiness check endpoint
  app.get('/ready', async (req, res) => {
    // Check if all critical dependencies are available
    const readinessChecks = await runReadinessChecks();
    
    if (readinessChecks.isReady) {
      res.status(200).json({ 
        status: 'ready', 
        checks: readinessChecks.results,
        timestamp: new Date().toISOString() 
      });
    } else {
      res.status(503).json({ 
        status: 'not ready', 
        checks: readinessChecks.results,
        timestamp: new Date().toISOString() 
      });
    }
  });
  
  // If a server is provided, set up terminus
  if (options.server) {
    createTerminus(options.server, {
      // Health check handler
      healthChecks: {
        '/health': async () => {
          return { status: 'ok' };
        },
        '/ready': async () => {
          const checks = await runReadinessChecks();
          if (!checks.isReady) {
            throw new Error('Service not ready');
          }
          return { status: 'ready' };
        }
      },
      // Cleanup handler
      onSignal: async () => {
        console.log('Server is shutting down...');
        // Perform cleanup tasks here (close connections, etc.)
      },
      // Called when all cleanup is complete
      onShutdown: async () => {
        console.log('Cleanup finished, server is shutting down');
      }
    });
  }
}

/**
 * Record AI recommendation metrics
 * @param {Object} data - Recommendation data
 */
function recordAIRecommendation(data) {
  const { riskProfile, walletAddress, success, duration } = data;
  
  // Increment counter
  aiRecommendationCounter.inc({ 
    risk_profile: riskProfile || 'unknown', 
    has_wallet: !!walletAddress, 
    success: success ? 'true' : 'false' 
  });
  
  // Record duration if available
  if (duration) {
    aiRecommendationDuration.observe(
      { risk_profile: riskProfile || 'unknown', has_wallet: !!walletAddress }, 
      duration
    );
  }
}

/**
 * Record transaction metrics
 * @param {Object} data - Transaction data
 */
function recordTransaction(data) {
  const { protocol, type, success, duration } = data;
  
  // Increment counter
  transactionCounter.inc({ 
    protocol: protocol || 'unknown', 
    operation_type: type || 'unknown', 
    status: success ? 'success' : 'failed' 
  });
  
  // Record duration if available
  if (duration) {
    transactionDuration.observe(
      { protocol: protocol || 'unknown', operation_type: type || 'unknown' }, 
      duration
    );
  }
}

/**
 * Record strategy execution metrics
 * @param {Object} data - Strategy execution data
 */
function recordStrategyExecution(data) {
  const { operationCount, success } = data;
  
  // Map operation count to a bucket
  let countBucket = '0';
  if (operationCount > 0 && operationCount <= 3) {
    countBucket = '1-3';
  } else if (operationCount > 3 && operationCount <= 6) {
    countBucket = '4-6';
  } else if (operationCount > 6) {
    countBucket = '7+';
  }
  
  // Increment counter
  strategyCounter.inc({ 
    operation_count: countBucket, 
    success: success ? 'true' : 'false' 
  });
}

/**
 * Record auto-rebalance metrics
 * @param {Object} data - Auto-rebalance data
 */
function recordRebalance(data) {
  const { triggerType, success } = data;
  
  // Increment counter
  rebalanceCounter.inc({ 
    trigger_type: triggerType || 'scheduled', 
    success: success ? 'true' : 'false' 
  });
}

/**
 * Update token price gauge
 * @param {string} token - Token symbol
 * @param {number} price - Current price in USD
 */
function updateTokenPrice(token, price) {
  if (token && !isNaN(price)) {
    tokenPriceGauge.set({ token_symbol: token }, price);
  }
}

/**
 * Run readiness checks for all required services
 * @returns {Object} Readiness check results
 */
async function runReadinessChecks() {
  const results = {};
  let isReady = true;
  
  // Check Aptos RPC availability
  try {
    const aptosCheck = await checkAptosRPC();
    results.aptos = { status: aptosCheck ? 'ok' : 'failed' };
    if (!aptosCheck) isReady = false;
  } catch (error) {
    results.aptos = { status: 'failed', error: error.message };
    isReady = false;
  }
  
  // Check AI service availability
  try {
    const aiCheck = await checkAIService();
    results.ai = { status: aiCheck ? 'ok' : 'failed' };
    if (!aiCheck) isReady = false;
  } catch (error) {
    results.ai = { status: 'failed', error: error.message };
    isReady = false;
  }
  
  // Add more readiness checks as needed
  
  return { isReady, results };
}

/**
 * Check Aptos RPC availability
 * @returns {boolean} Availability status
 */
async function checkAptosRPC() {
  try {
    // Check if the Aptos client module is available
    const aptosClient = require('../utils/aptosClient');
    
    // Try to get ledger info
    const ledgerInfo = await aptosClient.getLedgerInfo();
    return !!ledgerInfo;
  } catch (error) {
    console.error('Aptos RPC check failed:', error);
    return false;
  }
}

/**
 * Check AI service availability
 * @returns {boolean} Availability status
 */
async function checkAIService() {
  try {
    // Check if either OpenAI or Anthropic API is available
    if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('AI service check failed:', error);
    return false;
  }
}

module.exports = {
  metricsMiddleware,
  setupMetricsEndpoint,
  recordAIRecommendation,
  recordTransaction,
  recordStrategyExecution,
  recordRebalance,
  updateTokenPrice,
  registry
};