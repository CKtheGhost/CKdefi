// rpc.js - RPC endpoint configuration for Aptos networks
const env = require('./env');

/**
 * RPC endpoint configuration with fallbacks for Aptos networks
 */
module.exports = {
  // Mainnet RPC endpoints (in order of preference)
  MAINNET: [
    "https://fullnode.mainnet.aptoslabs.com/v1",
    "https://aptos-mainnet.nodereal.io/v1/94b7ed5c0b7e423fa0c7b6fb595e6fc0/v1",
    "https://aptos-mainnet-rpc.publicnode.com",
    "https://rpc.ankr.com/aptos",
    "https://aptos-mainnet.gateway.pokt.network/v1/lb/c5a1317d-4c13-4b78-bef5-73de4b5b9c6a"
  ],
  
  // Testnet RPC endpoints (in order of preference)
  TESTNET: [
    "https://fullnode.testnet.aptoslabs.com/v1",
    "https://aptos-testnet.nodereal.io/v1/94b7ed5c0b7e423fa0c7b6fb595e6fc0/v1",
    "https://aptos-testnet-rpc.publicnode.com",
    "https://aptos-testnet.gateway.pokt.network/v1/lb/c5a1317d-4c13-4b78-bef5-73de4b5b9c6a"
  ],
  
  // Devnet RPC endpoints (in order of preference)
  DEVNET: [
    "https://fullnode.devnet.aptoslabs.com/v1"
  ],
  
  // Indexer endpoints for GraphQL queries
  INDEXER: {
    MAINNET: "https://indexer.mainnet.aptoslabs.com/v1/graphql",
    TESTNET: "https://indexer.testnet.aptoslabs.com/v1/graphql",
    DEVNET: "https://indexer.devnet.aptoslabs.com/v1/graphql"
  },
  
  // Network-specific configuration
  NETWORK_CONFIG: {
    MAINNET: {
      chainId: 1,
      name: "Aptos Mainnet",
      explorerUrl: "https://explorer.aptoslabs.com"
    },
    TESTNET: {
      chainId: 2,
      name: "Aptos Testnet",
      explorerUrl: "https://explorer.aptoslabs.com?network=testnet"
    },
    DEVNET: {
      chainId: 34,
      name: "Aptos Devnet",
      explorerUrl: "https://explorer.aptoslabs.com?network=devnet"
    }
  },
  
  // Get the current network from environment
  getCurrentNetwork() {
    return env.APTOS_NETWORK || 'MAINNET';
  },
  
  // Get RPC endpoints for the current network
  getCurrentNetworkRPCs() {
    const network = this.getCurrentNetwork();
    return this[network] || this.MAINNET;
  },
  
  // Get indexer URL for the current network
  getCurrentIndexerUrl() {
    const network = this.getCurrentNetwork();
    return this.INDEXER[network] || this.INDEXER.MAINNET;
  },
  
  // Get network configuration for the current network
  getCurrentNetworkConfig() {
    const network = this.getCurrentNetwork();
    return this.NETWORK_CONFIG[network] || this.NETWORK_CONFIG.MAINNET;
  },
  
  // Get explorer URL for a transaction hash
  getExplorerUrl(txHash) {
    const network = this.getCurrentNetwork();
    const baseUrl = this.NETWORK_CONFIG[network]?.explorerUrl || this.NETWORK_CONFIG.MAINNET.explorerUrl;
    
    if (txHash) {
      return `${baseUrl}/txn/${txHash}`;
    }
    
    return baseUrl;
  },
  
  // Test RPC endpoint connectivity
  async testRpcEndpoint(endpoint, timeout = 5000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${endpoint}/info`, {
        signal: controller.signal,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return { success: true, endpoint };
      }
      
      return { success: false, endpoint, error: `Status: ${response.status}` };
    } catch (error) {
      return { success: false, endpoint, error: error.message };
    }
  },
  
  // Find the best available RPC endpoint
  async findBestRpcEndpoint() {
    const endpoints = this.getCurrentNetworkRPCs();
    const results = await Promise.all(endpoints.map(endpoint => this.testRpcEndpoint(endpoint)));
    
    // Find the first successful endpoint
    const successfulEndpoint = results.find(result => result.success);
    
    if (successfulEndpoint) {
      return successfulEndpoint.endpoint;
    }
    
    // Fall back to first endpoint if none are successful
    console.warn('All RPC endpoints failed, falling back to first one');
    return endpoints[0];
  }
};