// rpc.js - RPC configuration and utilities for CompounDefi
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

// Define alternative RPC endpoints with fallbacks
const APTOS_RPC_ENDPOINTS = {
  MAINNET: [
    "https://fullnode.mainnet.aptoslabs.com/v1",
    "https://aptos-mainnet.nodereal.io/v1/94b7ed5c0b7e423fa0c7b6fb595e6fc0/v1",
    "https://aptos-mainnet-rpc.publicnode.com",
    "https://rpc.ankr.com/aptos"
  ],
  TESTNET: [
    "https://fullnode.testnet.aptoslabs.com/v1",
    "https://aptos-testnet.nodereal.io/v1/94b7ed5c0b7e423fa0c7b6fb595e6fc0/v1",
    "https://aptos-testnet-rpc.publicnode.com"
  ]
};

// Client instances
let mainnetClient = null;
let testnetClient = null;

/**
 * Get a working RPC endpoint through testing each one
 * @param {string[]} endpoints - Array of RPC endpoints to try
 * @param {number} timeoutMs - Timeout in milliseconds for each attempt
 * @returns {Promise<string>} Working RPC endpoint
 */
async function getWorkingRpcEndpoint(endpoints, timeoutMs = 5000) {
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing RPC endpoint: ${endpoint}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const response = await fetch(`${endpoint}/info`, { 
        signal: controller.signal,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`Successfully connected to RPC endpoint: ${endpoint}`);
        return endpoint;
      }
    } catch (error) {
      console.error(`Failed to connect to RPC endpoint ${endpoint}:`, error.message);
    }
  }
  
  console.warn(`All RPC endpoints failed, defaulting to first one: ${endpoints[0]}`);
  return endpoints[0];
}

/**
 * Initialize Aptos client for the specified network
 * @param {string} networkName - Network name ('mainnet' or 'testnet')
 * @returns {Promise<Aptos>} Aptos client instance
 */
async function initializeAptosClient(networkName = 'mainnet') {
  try {
    const network = networkName.toLowerCase() === 'testnet' ? Network.TESTNET : Network.MAINNET;
    const endpoints = network === Network.TESTNET ? APTOS_RPC_ENDPOINTS.TESTNET : APTOS_RPC_ENDPOINTS.MAINNET;
    
    // Get a working endpoint
    const workingEndpoint = await getWorkingRpcEndpoint(endpoints);
    
    // Create Aptos config
    const aptosConfig = new AptosConfig({ 
      network,
      clientConfig: {
        FULLNODE_URL: workingEndpoint,
        INDEXER_URL: network === Network.TESTNET 
          ? "https://indexer.testnet.aptoslabs.com/v1/graphql"
          : "https://indexer.mainnet.aptoslabs.com/v1/graphql"
      },
      timeout: 15000
    });
    
    // Create and verify client
    const client = new Aptos(aptosConfig);
    await client.getLedgerInfo();
    
    console.log(`Aptos ${networkName} client initialized successfully`);
    return client;
  } catch (error) {
    console.error(`Failed to initialize Aptos ${networkName} client:`, error);
    
    // Fall back to default configuration
    const network = networkName.toLowerCase() === 'testnet' ? Network.TESTNET : Network.MAINNET;
    const aptosConfig = new AptosConfig({ network, timeout: 15000 });
    return new Aptos(aptosConfig);
  }
}

/**
 * Get Aptos client for specified network
 * @param {string} networkName - Network name ('mainnet' or 'testnet')
 * @returns {Promise<Aptos>} Aptos client
 */
async function getAptosClient(networkName = 'mainnet') {
  if (networkName.toLowerCase() === 'testnet') {
    if (!testnetClient) {
      testnetClient = await initializeAptosClient('testnet');
    }
    return testnetClient;
  } else {
    if (!mainnetClient) {
      mainnetClient = await initializeAptosClient('mainnet');
    }
    return mainnetClient;
  }
}

/**
 * Check if a transaction has been confirmed
 * @param {string} txHash - Transaction hash
 * @param {string} networkName - Network name ('mainnet' or 'testnet')
 * @returns {Promise<Object>} Transaction status
 */
async function checkTransactionStatus(txHash, networkName = 'mainnet') {
  try {
    const client = await getAptosClient(networkName);
    const transaction = await client.getTransactionByHash(txHash);
    
    return {
      confirmed: transaction?.success === true,
      status: transaction?.success ? 'confirmed' : 'failed',
      vmStatus: transaction?.vm_status,
      gasUsed: transaction?.gas_used,
      timestamp: transaction?.timestamp,
      version: transaction?.version,
      hash: txHash,
      success: transaction?.success
    };
  } catch (error) {
    console.error(`Error checking transaction status (${txHash}):`, error);
    return {
      confirmed: false,
      status: 'unknown',
      hash: txHash,
      error: error.message
    };
  }
}

/**
 * Simulate a transaction to estimate gas and check for errors
 * @param {Object} transaction - Transaction payload
 * @param {string} networkName - Network name ('mainnet' or 'testnet')
 * @returns {Promise<Object>} Simulation results
 */
async function simulateTransaction(transaction, networkName = 'mainnet') {
  try {
    const client = await getAptosClient(networkName);
    
    // Convert to payload format expected by the SDK if needed
    const payload = transaction.function ? 
      {
        function: transaction.function,
        type_arguments: transaction.type_arguments || [],
        arguments: transaction.arguments || []
      } : transaction;
    
    const result = await client.simulateTransaction({
      sender: transaction.sender,
      payload
    });
    
    return {
      success: result.success,
      gasUsed: result.gas_used,
      vmStatus: result.vm_status,
      details: result
    };
  } catch (error) {
    console.error('Transaction simulation error:', error);
    return {
      success: false,
      error: error.message,
      details: null
    };
  }
}

/**
 * Monitor a transaction until it's confirmed or fails
 * @param {string} txHash - Transaction hash
 * @param {string} networkName - Network name ('mainnet' or 'testnet')
 * @param {number} maxAttempts - Maximum polling attempts
 * @param {number} interval - Polling interval in milliseconds
 * @returns {Promise<Object>} Final transaction status
 */
async function monitorTransaction(txHash, networkName = 'mainnet', maxAttempts = 30, interval = 2000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await checkTransactionStatus(txHash, networkName);
    
    if (status.status !== 'unknown') {
      return status;
    }
    
    // Wait before trying again
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return {
    confirmed: false,
    status: 'timeout',
    hash: txHash,
    error: 'Transaction monitoring timed out'
  };
}

module.exports = {
  APTOS_RPC_ENDPOINTS,
  getAptosClient,
  checkTransactionStatus,
  simulateTransaction,
  monitorTransaction
};