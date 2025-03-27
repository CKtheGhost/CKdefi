// logging.js - Request logging middleware for CompounDefi
// Logs request details for monitoring and debugging

const chalk = require('chalk');

/**
 * Calculate request processing duration
 * @param {Array} hrtime - High resolution time tuple from process.hrtime()
 * @returns {number} Duration in milliseconds
 */
function calculateDuration(hrtime) {
  const durationHrTime = process.hrtime(hrtime);
  return (durationHrTime[0] * 1000) + (durationHrTime[1] / 1000000);
}

/**
 * Format and colorize response status
 * @param {number} status - HTTP status code
 * @returns {string} Colorized status
 */
function formatStatus(status) {
  if (status >= 500) {
    return chalk.red(status);
  } else if (status >= 400) {
    return chalk.yellow(status);
  } else if (status >= 300) {
    return chalk.cyan(status);
  } else {
    return chalk.green(status);
  }
}

/**
 * Format log message with level indicator
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 * @returns {string} Formatted log message
 */
function formatLogMessage(level, message) {
  const timestamp = new Date().toISOString();
  
  switch (level) {
    case 'ERROR':
      return `${chalk.gray(timestamp)} ${chalk.bgRed.white(` ${level} `)} ${message}`;
    case 'WARN':
      return `${chalk.gray(timestamp)} ${chalk.bgYellow.black(` ${level} `)} ${message}`;
    case 'INFO':
    default:
      return `${chalk.gray(timestamp)} ${chalk.bgBlue.white(` ${level} `)} ${message}`;
  }
}

/**
 * Request logging middleware
 * @param {Object} options - Logging options
 * @returns {Function} Express middleware function
 */
function requestLogger(options = {}) {
  const {
    logLevel = 'INFO',
    logHeaders = false,
    logBody = false,
    excludePaths = ['/health', '/metrics'],
    slowThreshold = 1000 // ms
  } = options;
  
  // Only log if level is at least as important as the configured level
  const shouldLog = (level) => {
    const levels = { 'ERROR': 3, 'WARN': 2, 'INFO': 1, 'DEBUG': 0 };
    return levels[level] >= levels[logLevel];
  };
  
  return (req, res, next) => {
    // Skip excluded paths
    if (excludePaths.some(path => req.path.includes(path))) {
      return next();
    }
    
    // Record start time
    const startHrTime = process.hrtime();
    const startTimestamp = new Date().toISOString();
    
    // Store original end method
    const originalEnd = res.end;
    
    // Override end method to capture response
    res.end = function(chunk, encoding) {
      // Calculate request duration
      const duration = calculateDuration(startHrTime);
      
      // Restore original end method
      res.end = originalEnd;
      
      // Call original end method
      res.end(chunk, encoding);
      
      // Determine log level based on status and duration
      let level = 'INFO';
      
      if (res.statusCode >= 500) {
        level = 'ERROR';
      } else if (res.statusCode >= 400 || duration > slowThreshold) {
        level = 'WARN';
      }
      
      // Only log if should log this level
      if (shouldLog(level)) {
        const method = chalk.bold(req.method);
        const path = chalk.cyan(req.originalUrl || req.url);
        const status = formatStatus(res.statusCode);
        const durationFormatted = duration < slowThreshold 
          ? chalk.green(`${duration.toFixed(2)}ms`) 
          : chalk.yellow(`${duration.toFixed(2)}ms`);
        
        const message = `${method} ${path} ${status} - ${durationFormatted}`;
        
        // Log the request details
        console.log(formatLogMessage(level, message));
        
        // Log headers if enabled and level is high enough
        if (logHeaders && (level === 'ERROR' || level === 'WARN')) {
          console.log(formatLogMessage('DEBUG', `Request Headers: ${JSON.stringify(req.headers)}`));
        }
        
        // Log body if enabled and level is high enough
        if (logBody && (level === 'ERROR' || level === 'WARN')) {
          if (req.body && Object.keys(req.body).length > 0) {
            // Mask sensitive information
            const sanitizedBody = { ...req.body };
            ['password', 'token', 'secret', 'key', 'apiKey'].forEach(field => {
              if (sanitizedBody[field]) {
                sanitizedBody[field] = '******';
              }
            });
            
            console.log(formatLogMessage('DEBUG', `Request Body: ${JSON.stringify(sanitizedBody)}`));
          }
        }
      }
    };
    
    next();
  };
}

/**
 * AI service logger middleware
 * Logs AI recommendation requests and responses
 */
function aiServiceLogger(req, res, next) {
  // Only log AI recommendation requests
  if (!req.originalUrl.includes('/recommendations/ai')) {
    return next();
  }
  
  const startHrTime = process.hrtime();
  const requestParams = {
    amount: req.query.amount,
    riskProfile: req.query.riskProfile,
    walletAddress: req.query.walletAddress 
      ? `${req.query.walletAddress.substring(0, 6)}...${req.query.walletAddress.substring(62)}` 
      : undefined
  };
  
  console.log(formatLogMessage('INFO', 
    `AI Recommendation Request: ${JSON.stringify(requestParams)}`
  ));
  
  // Store original send method
  const originalSend = res.send;
  
  // Override send method to log response
  res.send = function(body) {
    // Calculate request duration
    const duration = calculateDuration(startHrTime);
    
    // Restore original send method
    res.send = originalSend;
    
    // Parse response body if it's JSON
    let responseData;
    try {
      responseData = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      responseData = { responseSize: body?.length || 0 };
    }
    
    // Log response data without full recommendation details
    const logData = {
      status: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      hasRecommendation: !!responseData.allocation,
      totalApr: responseData.totalApr,
      title: responseData.title,
      allocationCount: responseData.allocation?.length
    };
    
    console.log(formatLogMessage(
      res.statusCode >= 400 ? 'ERROR' : 'INFO',
      `AI Recommendation Response: ${JSON.stringify(logData)}`
    ));
    
    // Call original send method
    return originalSend.call(this, body);
  };
  
  next();
}

/**
 * Transaction logger middleware
 * Logs detailed information about DeFi transactions
 */
function transactionLogger(req, res, next) {
  // Only log transaction execution requests
  if (!req.originalUrl.includes('/execute-strategy') && 
      !req.originalUrl.includes('/execute')) {
    return next();
  }
  
  const startHrTime = process.hrtime();
  const { walletAddress, operations } = req.body;
  
  const logData = {
    walletAddress: walletAddress 
      ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(62)}` 
      : undefined,
    operationCount: operations?.length || 0,
    protocols: operations?.map(op => op.protocol) || [],
    totalAmount: operations?.reduce((sum, op) => sum + parseFloat(op.amount || 0), 0).toFixed(2) || 0
  };
  
  console.log(formatLogMessage('INFO', 
    `Transaction Request: ${JSON.stringify(logData)}`
  ));
  
  // Store original send method
  const originalSend = res.send;
  
  // Override send method to log response
  res.send = function(body) {
    // Calculate request duration
    const duration = calculateDuration(startHrTime);
    
    // Restore original send method
    res.send = originalSend;
    
    // Parse response body if it's JSON
    let responseData;
    try {
      responseData = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      responseData = { responseSize: body?.length || 0 };
    }
    
    // Log response summary
    const responseLog = {
      status: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      success: responseData.success,
      successOperations: responseData.operations?.length || 0,
      failedOperations: responseData.failedOperations?.length || 0
    };
    
    if (responseData.error) {
      responseLog.error = responseData.error;
    }
    
    console.log(formatLogMessage(
      responseData.success ? 'INFO' : 'WARN',
      `Transaction Response: ${JSON.stringify(responseLog)}`
    ));
    
    // Call original send method
    return originalSend.call(this, body);
  };
  
  next();
}

module.exports = {
  requestLogger,
  aiServiceLogger,
  transactionLogger
};