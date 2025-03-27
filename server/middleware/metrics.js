// server/middleware/metrics.js
const promClient = require('prom-client');

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add a default label to all metrics
register.setDefaultLabels({
  app: 'compoundefi'
});

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Register the custom metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestCounter);

/**
 * Middleware to collect metrics for each request
 */
const metricsMiddleware = (req, res, next) => {
  // Skip metrics route to avoid infinite loops
  if (req.path === '/metrics') {
    return next();
  }

  // Start timer for request duration
  const end = httpRequestDurationMicroseconds.startTimer();
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to capture metrics
  res.end = function(...args) {
    // Execute original end function
    originalEnd.apply(res, args);
    
    // Record request metrics
    const route = req.route ? req.route.path : req.path;
    const statusCode = res.statusCode;
    const method = req.method;
    
    // Record request duration
    end({ route, method, status_code: statusCode });
    
    // Increment request counter
    httpRequestCounter.inc({ route, method, status_code: statusCode });
  };
  
  next();
};

/**
 * Metrics endpoint handler
 */
const getMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).end();
  }
};

// Export the middleware and metrics endpoint handler
module.exports = {
  metricsMiddleware,
  getMetrics
};