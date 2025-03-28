import { AptosClient, FaucetClient, TokenClient, CoinClient } from 'aptos';
import { Types } from 'aptos';

// Supported wallet providers
const WALLET_PROVIDERS = {
  PETRA: 'petra',
  MARTIAN: 'martian',
  PONTEM: 'pontem',
  RISE: 'rise',
  // Add other wallet providers as needed
};

class WalletService {
  constructor(network = 'mainnet') {
    this.network = network;
    this.client = this.getClientForNetwork(network);
    this.coinClient = new CoinClient(this.client);
    this.tokenClient = new TokenClient(this.client);
    this.currentProvider = null;
    this.connectedAddress = null;
  }

  // Initialize client based on selected network
  getClientForNetwork(network) {
    const networkUrls = {
      mainnet: 'https://fullnode.mainnet.aptoslabs.com/v1',
      testnet: 'https://fullnode.testnet.aptoslabs.com/v1',
      devnet: 'https://fullnode.devnet.aptoslabs.com/v1',
      local: 'http://localhost:8080/v1',
    };

    const url = networkUrls[network] || networkUrls.mainnet;
    return new AptosClient(url);
  }

  // Get the Aptos client instance
  getClient() {
    return this.client;
  }

  // Check if wallet extension is installed
  async checkWalletExtension(provider) {
    switch (provider) {
      case WALLET_PROVIDERS.PETRA:
        return !!window.aptos;
      case WALLET_PROVIDERS.MARTIAN:
        return !!window.martian;
      case WALLET_PROVIDERS.PONTEM:
        return !!window.pontem;
      case WALLET_PROVIDERS.RISE:
        return !!window.rise;
      default:
        // If no specific provider, check for any compatible wallet
        return !!(window.aptos || window.martian || window.pontem || window.rise);
    }
  }

  // Get available wallet providers
  async getAvailableWallets() {
    const available = [];
    
    if (await this.checkWalletExtension(WALLET_PROVIDERS.PETRA)) {
      available.push({
        name: 'Petra',
        id: WALLET_PROVIDERS.PETRA,
        icon: '/assets/images/wallets/petra.png',
        installed: true
      });
    }
    
    if (await this.checkWalletExtension(WALLET_PROVIDERS.MARTIAN)) {
      available.push({
        name: 'Martian',
        id: WALLET_PROVIDERS.MARTIAN,
        icon: '/assets/images/wallets/martian.png',
        installed: true
      });
    }
    
    if (await this.checkWalletExtension(WALLET_PROVIDERS.PONTEM)) {
      available.push({
        name: 'Pontem',
        id: WALLET_PROVIDERS.PONTEM,
        icon: '/assets/images/wallets/pontem.png',
        installed: true
      });
    }
    
    if (await this.checkWalletExtension(WALLET_PROVIDERS.RISE)) {
      available.push({
        name: 'Rise',
        id: WALLET_PROVIDERS.RISE,
        icon: '/assets/images/wallets/rise.png',
        installed: true
      });
    }
    
    // Add non-installed wallets for discovery
    if (!available.some(wallet => wallet.id === WALLET_PROVIDERS.PETRA)) {
      available.push({
        name: 'Petra',
        id: WALLET_PROVIDERS.PETRA,
        icon: '/assets/images/wallets/petra.png',
        installed: false,
        url: 'https://petra.app/'
      });
    }
    
    // Add other non-installed wallets as needed
    
    return available;
  }

  // Connect to wallet
  async connect(preferredProvider = null) {
    try {
      // Check if wallet extensions are available
      const hasExtension = await this.checkWalletExtension(preferredProvider);
      if (!hasExtension) {
        throw new Error('No compatible wallet extension found. Please install a wallet extension first.');
      }
      
      // Get provider instance
      let provider;
      let providerName;
      
      if (preferredProvider === WALLET_PROVIDERS.PETRA || (!preferredProvider && window.aptos)) {
        provider = window.aptos;
        providerName = 'Petra';
      } else if (preferredProvider === WALLET_PROVIDERS.MARTIAN || (!preferredProvider && window.martian)) {
        provider = window.martian;
        providerName = 'Martian';
      } else if (preferredProvider === WALLET_PROVIDERS.PONTEM || (!preferredProvider && window.pontem)) {
        provider = window.pontem;
        providerName = 'Pontem';
      } else if (preferredProvider === WALLET_PROVIDERS.RISE || (!preferredProvider && window.rise)) {
        provider = window.rise;
        providerName = 'Rise';
      } else {
        throw new Error('No supported wallet provider found');
      }
      
      // Connect to the provider
      await provider.connect();
      
      // Get account information
      const account = await provider.account();
      const { address, publicKey } = account;
      
      if (!address) {
        throw new Error('Failed to get wallet address');
      }
      
      // Store connected provider and address
      this.currentProvider = provider;
      this.connectedAddress = address;
      this.providerName = providerName;
      
      // Return wallet information
      return {
        address,
        publicKey,
        provider: preferredProvider || this.detectProviderType(provider),
        providerName
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Detect wallet provider type
  detectProviderType(provider) {
    if (provider === window.aptos) return WALLET_PROVIDERS.PETRA;
    if (provider === window.martian) return WALLET_PROVIDERS.MARTIAN;
    if (provider === window.pontem) return WALLET_PROVIDERS.PONTEM;
    if (provider === window.rise) return WALLET_PROVIDERS.RISE;
    return 'unknown';
  }

  // Disconnect from wallet
  async disconnect() {
    try {
      if (this.currentProvider && this.currentProvider.disconnect) {
        await this.currentProvider.disconnect();
      }
      
      this.currentProvider = null;
      this.connectedAddress = null;
      this.providerName = null;
      
      return true;
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      throw new Error(`Failed to disconnect wallet: ${error.message}`);
    }
  }

  // Get wallet balance
  async getBalance(address = this.connectedAddress) {
    if (!address) {
      throw new Error('Wallet address not provided');
    }
    
    try {
      const resources = await this.client.getAccountResources(address);
      
      // Find APT coin resource
      const accountResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      
      if (!accountResource) {
        return 0;
      }
      
      // Convert from octas (10^8) to APT
      const balance = parseInt(accountResource.data.coin.value) / 100000000;
      
      return balance;
    } catch (error) {
      console.error('Balance fetch error:', error);
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  }

  // Execute transaction
  async executeTransaction(payload, options = {}) {
    if (!this.currentProvider || !this.connectedAddress) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Create transaction payload
      const txPayload = {
        function: payload.function,
        type_arguments: payload.type_arguments || [],
        arguments: payload.arguments || []
      };
      
      // Set transaction options
      const txOptions = {
        max_gas_amount: options.maxGasAmount || '1000',
        gas_unit_price: options.gasUnitPrice || '100',
        ...options
      };
      
      // Sign and submit transaction
      const pendingTransaction = await this.currentProvider.signAndSubmitTransaction(txPayload, txOptions);
      
      // Wait for transaction confirmation
      const txResult = await this.client.waitForTransactionWithResult(
        pendingTransaction.hash,
        { timeoutSecs: options.timeoutSecs || 30 }
      );
      
      // Check transaction status
      if (txResult.success === false) {
        throw new Error('Transaction failed: ' + (txResult.vm_status || 'Unknown error'));
      }
      
      return {
        success: true,
        hash: pendingTransaction.hash,
        result: txResult
      };
    } catch (error) {
      console.error('Transaction execution error:', error);
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  // Get transaction status
  async getTransactionStatus(txHash) {
    try {
      const txInfo = await this.client.getTransactionByHash(txHash);
      return {
        status: txInfo.success ? 'success' : 'failed',
        info: txInfo
      };
    } catch (error) {
      console.error('Transaction status check error:', error);
      throw new Error(`Failed to check transaction status: ${error.message}`);
    }
  }

  // Get recent transactions
  async getRecentTransactions(address = this.connectedAddress, limit = 10) {
    if (!address) {
      throw new Error('Wallet address not provided');
    }
    
    try {
      const transactions = await this.client.getAccountTransactions(address, { limit });
      
      return transactions.map(tx => {
        return {
          hash: tx.hash,
          type: this.determineTransactionType(tx),
          timestamp: tx.timestamp,
          success: tx.success,
          gasUsed: tx.gas_used,
          version: tx.version
        };
      });
    } catch (error) {
      console.error('Recent transactions fetch error:', error);
      throw new Error(`Failed to fetch recent transactions: ${error.message}`);
    }
  }

  // Determine transaction type (staking, swap, etc.)
  determineTransactionType(tx) {
    try {
      if (!tx.payload) return 'unknown';
      
      const functionName = tx.payload.function?.toLowerCase() || '';
      
      if (functionName.includes('::staking::')) return 'staking';
      if (functionName.includes('::unstake') || functionName.includes('::withdraw')) return 'unstaking';
      if (functionName.includes('::swap')) return 'swap';
      if (functionName.includes('::transfer')) return 'transfer';
      if (functionName.includes('::add_liquidity')) return 'add liquidity';
      if (functionName.includes('::remove_liquidity')) return 'remove liquidity';
      if (functionName.includes('::mint')) return 'mint';
      if (functionName.includes('::burn')) return 'burn';
      if (functionName.includes('::claim')) return 'claim rewards';
      
      return 'transaction';
    } catch (error) {
      return 'transaction';
    }
  }
}

export default WalletService;