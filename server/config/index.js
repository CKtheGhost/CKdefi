// index.js - Central export for all configuration
const env = require('./env');
const contracts = require('./contracts');
const ai = require('./ai');
const rpc = require('./rpc');
const database = require('./database');

/**
 * Combined configuration for CompounDefi
 */
module.exports = {
  env,
  contracts,
  ai,
  rpc,
  database,
  
  // Export common configurations directly
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  APTOS_NETWORK: env.APTOS_NETWORK,
  
  // Helper method to check if running in production
  isProd: () => env.NODE_ENV === 'production',
  
  // Helper method to check if running in development
  isDev: () => env.NODE_ENV === 'development',
  
  // Helper method to check if debugging is enabled
  isDebug: () => env.DEBUG === true || env.LOG_LEVEL === 'debug',
  
  // Get a contract address by protocol name
  getContractAddress: (protocol) => contracts.getContract(protocol),
  
  // Get function name for a protocol and operation
  getFunctionName: (protocol, operation) => contracts.getFunctionName(protocol, operation),
  
  // Get the best RPC endpoint for the current network
  getBestRpcEndpoint: async () => await rpc.findBestRpcEndpoint(),
  
  // Get explorer URL for a transaction
  getExplorerUrl: (txHash) => rpc.getExplorerUrl(txHash)
};