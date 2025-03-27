// /app/server/utils/logging.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

function getLogger(moduleName) {
  return logger.child({ module: moduleName });
}

module.exports = { getLogger };