// aptosClient.js
// Utility for Aptos blockchain interactions with advanced error handling and retry mechanisms

const { Aptos, AptosConfig, Network, ApiError } = require('@aptos-labs/ts-sdk');
const axios = require('axios');
const { performance } = require('perf_hooks');

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

class AptosClient {
  constructor(options = {}) {
    this.network = options.network || process.env.APTOS_NETWORK || 'MAINNET';
    this.timeout = options.timeout || 15000;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.endpointIndex = 0;
    this.aptosClient = null;
    this.healthCheckInterval = options.healthCheckInterval || 10 * 60 * 1000; // 10 minutes
    this.lastHealthCheck = 0;

    this.initialize();
  }

  async initialize() {
    try {
      const endpoints = this.network === 'TESTNET' ? APTOS_RPC_ENDPOINTS.TESTNET : APTOS_RPC_ENDPOINTS.MAINNET;
      const selectedEndpoint = await this.findBestEndpoint(endpoints);

      const network = this.network === 'TESTNET' ? Network.TESTNET : Network.MAINNET;
      const aptosConfig = new AptosConfig({
        network,
        clientConfig: {
          FULLNODE_URL: selectedEndpoint,
          INDEXER_URL: network === Network.TESTNET 
            ? "https://indexer.testnet.aptoslabs.com/v1/graphql"
            : "https://indexer.mainnet.aptoslabs.com/v1/graphql"
        },
        timeout: this.timeout
      });

      this.aptosClient = new Aptos(aptosConfig);
      
      // Setup health check interval
      if (this.healthCheckInterval > 0) {
        setInterval(() => this.performHealthCheck(), this.healthCheckInterval);
      }
      
      console.log(`AptosClient initialized successfully using endpoint: ${selectedEndpoint}`);
      return this.aptosClient;
    } catch (error) {
      console.error('Failed to initialize AptosClient:', error);
      throw new Error(`AptosClient initialization failed: ${error.message}`);
    }
  }

  async findBestEndpoint(endpoints) {
    const results = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const start = performance.now();
          const response = await axios.get(`${endpoint}/info`, { 
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
          });
          const latency = performance.now() - start;
          
          return {
            endpoint,
            success: response.status === 200,
            latency,
            height: response.data?.ledger_version || 0
          };
        } catch (error) {
          return {
            endpoint,
            success: false,
            latency: Infinity,
            height: 0
          };
        }
      })
    );

    // Filter successful responses and sort by latency
    const successfulEndpoints = results
      .filter(result => result.success)
      .sort((a, b) => a.latency - b.latency);

    if (successfulEndpoints.length === 0) {
      console.warn('No responsive Aptos endpoints found, using first endpoint as fallback');
      return endpoints[0];
    }

    // Check if the fastest endpoint is significantly behind in block height
    const highestHeight = Math.max(...successfulEndpoints.map(e => parseInt(e.height)));
    const fastestEndpoint = successfulEndpoints[0];
    
    // If the fastest endpoint is more than 10 blocks behind, choose the next fastest that's up to date
    if (highestHeight - parseInt(fastestEndpoint.height) > 10) {
      const upToDateEndpoints = successfulEndpoints.filter(
        e => highestHeight - parseInt(e.height) <= 10
      );
      
      if (upToDateEndpoints.length > 0) {
        return upToDateEndpoints[0].endpoint;
      }
    }

    return fastestEndpoint.endpoint;
  }
  
  async performHealthCheck() {
    try {
      const now = Date.now();
      
      // Skip if last check was recent
      if (now - this.lastHealthCheck < this.healthCheckInterval / 2) {
        return;
      }
      
      this.lastHealthCheck = now;
      
      // Check Aptos client health
      await this.aptosClient.getLedgerInfo();
      
      // If we're here, the client is healthy
      console.log('Aptos client health check passed');
    } catch (error) {
      console.error('Aptos client health check failed:', error);
      
      // Attempt to reinitialize with a different endpoint
      try {
        console.log('Attempting to reinitialize Aptos client with different endpoint');
        this.endpointIndex = (this.endpointIndex + 1) % 
          (this.network === 'TESTNET' ? APTOS_RPC_ENDPOINTS.TESTNET.length : APTOS_RPC_ENDPOINTS.MAINNET.length);
          
        await this.initialize();
      } catch (reinitError) {
        console.error('Failed to reinitialize Aptos client:', reinitError);
      }
    }
  }
  
  async getClient() {
    if (!this.aptosClient) {
      await this.initialize();
    }
    return this.aptosClient;
  }

  // Wrapper function with retry logic
  async withRetry(operation, ...args) {
    let lastError;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        // Ensure we have a client
        const client = await this.getClient();
        
        // Execute the operation
        return await operation.apply(client, args);
      } catch (error) {
        lastError = error;
        console.warn(`Operation failed (attempt ${attempt + 1}/${this.maxRetries}):`, error.message);
        
        // Check if error is node-related and we should try a different endpoint
        if (this.shouldSwitchEndpoint(error)) {
          try {
            console.log('Switching to alternate Aptos endpoint due to error');
            await this.initialize();
          } catch (reinitError) {
            console.error('Failed to switch endpoints:', reinitError);
          }
        }
        
        // Wait before retry
        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
        }
      }
    }
    
    throw lastError || new Error('Operation failed after maximum retry attempts');
  }

  shouldSwitchEndpoint(error) {
    // Check for common node connection issues
    return (
      error instanceof ApiError ||
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('connect') ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('500') ||
      error.message.includes('503') ||
      error.message.includes('429')
    );
  }

  // High-level functions with retry logic
  async getLedgerInfo() {
    return this.withRetry(this.aptosClient.getLedgerInfo);
  }

  async getAccountInfo(address) {
    return this.withRetry(this.aptosClient.getAccountInfo, address);
  }

  async getAccountResources(address) {
    return this.withRetry(this.aptosClient.getAccountResources, address);
  }

  async getAccountResource(address, resourceType) {
    return this.withRetry(this.aptosClient.getAccountResource, address, resourceType);
  }

  async getAccountModules(address) {
    return this.withRetry(this.aptosClient.getAccountModules, address);
  }

  async getAccountModule(address, moduleName) {
    return this.withRetry(this.aptosClient.getAccountModule, address, moduleName);
  }

  async getTransactions(queries) {
    return this.withRetry(this.aptosClient.getTransactions, queries);
  }

  async getTransactionByHash(hash) {
    return this.withRetry(this.aptosClient.getTransactionByHash, hash);
  }

  async getTransactionByVersion(version) {
    return this.withRetry(this.aptosClient.getTransactionByVersion, version);
  }

  async simulateTransaction(transaction) {
    return this.withRetry(this.aptosClient.simulateTransaction, transaction);
  }

  async submitTransaction(transaction) {
    return this.withRetry(this.aptosClient.submitTransaction, transaction);
  }

  async signAndSubmitTransaction(signer, transaction) {
    return this.withRetry(this.aptosClient.signAndSubmitTransaction, signer, transaction);
  }

  async waitForTransaction(txHash) {
    try {
      for (let attempt = 0; attempt < 30; attempt++) {
        try {
          const transaction = await this.getTransactionByHash(txHash);
          if (transaction && transaction.success !== undefined) {
            return transaction;
          }
        } catch (error) {
          if (error.message.includes('404') || error.message.includes('not found')) {
            // Transaction not found yet, continue waiting
          } else {
            throw error;
          }
        }

        // Wait 2 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      throw new Error('Timeout waiting for transaction confirmation');
    } catch (error) {
      console.error(`Error waiting for transaction ${txHash}:`, error);
      throw error;
    }
  }

  async getTokenBalance(address, tokenType) {
    try {
      const resources = await this.getAccountResources(address);
      
      // Look for CoinStore resource with specified token type
      const coinResource = resources.find(r => 
        r.type.startsWith('0x1::coin::CoinStore<') && 
        r.type.includes(tokenType)
      );
      
      if (coinResource && coinResource.data) {
        return coinResource.data.coin.value;
      }
      
      return '0'; // Default to 0 if not found
    } catch (error) {
      console.error(`Error fetching token balance for ${address}:`, error);
      throw error;
    }
  }

  async getAptosBalance(address) {
    try {
      return await this.getTokenBalance(address, '0x1::aptos_coin::AptosCoin');
    } catch (error) {
      console.error(`Error fetching APT balance for ${address}:`, error);
      throw error;
    }
  }

  async getAccountNFTs(address) {
    try {
      const resources = await this.getAccountResources(address);
      
      // Filter for token store resources
      const tokenStores = resources.filter(r => 
        r.type.includes('0x3::token::TokenStore')
      );
      
      if (tokenStores.length === 0) {
        return [];
      }
      
      // Extract token data
      let tokens = [];
      for (const store of tokenStores) {
        const tokenData = store.data.tokens;
        if (tokenData && Array.isArray(tokenData.data)) {
          tokens = tokens.concat(tokenData.data);
        }
      }
      
      return tokens;
    } catch (error) {
      console.error(`Error fetching NFTs for ${address}:`, error);
      throw error;
    }
  }

  async getProtocolStakingInfo(protocolAddress) {
    try {
      // Get protocol staking related resources
      const resources = await this.getAccountResources(protocolAddress);
      
      // Find staking related resources
      const stakingResources = resources.filter(r => 
        r.type.includes('::staking::') || 
        r.type.includes('::stake::') || 
        r.type.includes('::pool::')
      );
      
      return stakingResources;
    } catch (error) {
      console.error(`Error fetching staking info for ${protocolAddress}:`, error);
      throw error;
    }
  }
}

module.exports = {
  AptosClient,
  APTOS_RPC_ENDPOINTS
};