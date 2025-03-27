// server/utils/logger.js
// Logging utility for CompounDefi server

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format (more readable for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'compoundefi' },
  transports: [
    // Write to all logs with level 'info' and below to combined.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// If we're not in production, also log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Create a stream object for Morgan integration
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

// Custom log method that includes a transaction ID for tracking requests
logger.logWithTxId = (level, txId, message, meta = {}) => {
  logger.log(level, message, { ...meta, txId });
};

// Add additional methods for module-specific logging
logger.ai = (message, meta = {}) => {
  logger.info(message, { ...meta, module: 'ai' });
};

logger.wallet = (message, meta = {}) => {
  logger.info(message, { ...meta, module: 'wallet' });
};

logger.transactions = (message, meta = {}) => {
  logger.info(message, { ...meta, module: 'transactions' });
};

logger.performance = (message, duration, meta = {}) => {
  logger.info(message, { ...meta, module: 'performance', duration });
};

module.exports = logger;