/**
 * Wallet service for interacting with blockchain wallets
 * Supports Petra, Martian, Pontem, and other Aptos wallets
 */

// Available wallet providers
const WALLET_PROVIDERS = {
  PETRA: 'petra',
  MARTIAN: 'martian',
  PONTEM: 'pontem',
  RISE: 'rise',
  FEWCHA: 'fewcha'
};

class WalletService {
  constructor() {
    this.connectedWallet = null;
    this.walletProvider = null;
    this.address = null;
    this.publicKey = null;
    this.networkInfo = null;
    this.isConnected = false;
    this.listeners = [];
    this.aptosClient = null;
  }

  /**
   * Initialize the wallet service
   */
  init() {
    this.detectWallets();
    this.checkPreviousConnection();
    this.setupWindowListeners();
  }

  /**
   * Detect available wallet providers in the browser
   * @returns {Array} Available wallets
   */
  detectWallets() {
    const availableWallets = [];

    if (window.aptos) {
      availableWallets.push({
        name: 'Petra',
        provider: WALLET_PROVIDERS.PETRA,
        icon: '/assets/images/wallets/petra.png',
        instance: window.aptos,
        installed: true
      });
    }

    if (window.martian) {
      availableWallets.push({
        name: 'Martian',
        provider: WALLET_PROVIDERS.MARTIAN,
        icon: '/assets/images/wallets/martian.png',
        instance: window.martian,
        installed: true
      });
    }

    if (window.pontem) {
      availableWallets.push({
        name: 'Pontem',
        provider: WALLET_PROVIDERS.PONTEM,
        icon: '/assets/images/wallets/pontem.png',
        instance: window.pontem,
        installed: true
      });
    }

    // Add Rise Wallet if available
    if (window.rise) {
      availableWallets.push({
        name: 'Rise Wallet',
        provider: WALLET_PROVIDERS.RISE,
        icon: '/assets/images/wallets/rise.png',
        instance: window.rise,
        installed: true
      });
    }

    // Add other wallets as needed

    this.availableWallets = availableWallets;
    return availableWallets;
  }

  /**
   * Check for previous wallet connection and restore it
   */
  async checkPreviousConnection() {
    try {
      const savedProvider = localStorage.getItem('walletProvider');
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (savedProvider && savedAddress) {
        const wallet = this.availableWallets.find(w => w.provider === savedProvider);
        
        if (wallet && wallet.installed) {
          // Attempt to reconnect
          await this.connectWallet(wallet.provider);
        }
      }
    } catch (error) {
      console.error('Failed to restore previous wallet connection:', error);
      this.clearSavedConnection();
    }
  }

  /**
   * Set up window event listeners for wallet changes
   */
  setupWindowListeners() {
    // Listen for account changes
    window.addEventListener('aptos#accountChanged', this.handleAccountChanged.bind(this));
    window.addEventListener('martian#accountChanged', this.handleAccountChanged.bind(this));
    window.addEventListener('pontem#accountChanged', this.handleAccountChanged.bind(this));
    
    // Listen for network changes
    window.addEventListener('aptos#networkChanged', this.handleNetworkChanged.bind(this));
    window.addEventListener('martian#networkChanged', this.handleNetworkChanged.bind(this));
    window.addEventListener('pontem#networkChanged', this.handleNetworkChanged.bind(this));
    
    // Listen for disconnect events
    window.addEventListener('aptos#disconnect', this.handleDisconnect.bind(this));
    window.addEventListener('martian#disconnect', this.handleDisconnect.bind(this));
    window.addEventListener('pontem#disconnect', this.handleDisconnect.bind(this));
  }

  /**
   * Handle account change event
   * @param {Event} event - Account changed event
   */
  async handleAccountChanged(event) {
    console.log('Account changed:', event);
    
    try {
      // Update wallet information
      if (this.connectedWallet) {
        const accountInfo = await this.connectedWallet.account();
        this.updateWalletInfo(accountInfo);
        
        // Notify listeners
        this.notifyListeners('accountChanged', accountInfo);
      }
    } catch (error) {
      console.error('Error handling account change:', error);
      // If account info can't be retrieved, disconnect
      this.disconnect();
    }
  }

  /**
   * Handle network change event
   * @param {Event} event - Network changed event
   */
  async handleNetworkChanged(event) {
    console.log('Network changed:', event);
    
    try {
      // Update network information
      if (this.connectedWallet) {
        const network = await this.connectedWallet.network();
        this.networkInfo = network;
        
        // Notify listeners
        this.notifyListeners('networkChanged', network);
      }
    } catch (error) {
      console.error('Error handling network change:', error);
    }
  }

  /**
   * Handle wallet disconnect event
   */
  handleDisconnect() {
    this.disconnect();
    // Notify listeners
    this.notifyListeners('disconnect');
  }

  /**
   * Connect to a wallet
   * @param {string} provider - Wallet provider name
   * @returns {Object} Connection result
   */
  async connectWallet(provider) {
    try {
      // Find the wallet provider
      const wallet = this.availableWallets.find(w => w.provider === provider);
      
      if (!wallet || !wallet.installed) {
        throw new Error(`Wallet ${provider} not found or not installed`);
      }
      
      // Connect to wallet
      const response = await wallet.instance.connect();
      const accountInfo = await wallet.instance.account();
      const network = await wallet.instance.network();
      
      // Update wallet information
      this.connectedWallet = wallet.instance;
      this.walletProvider = wallet.provider;
      this.updateWalletInfo(accountInfo);
      this.networkInfo = network;
      this.isConnected = true;
      
      // Save connection info
      this.saveConnection();
      
      // Notify listeners
      this.notifyListeners('connect', this.getWalletInfo());
      
      return this.getWalletInfo();
    } catch (error) {
      console.error('Wallet connection error:', error);
      this.disconnect();
      throw error;
    }
  }

  /**
   * Update wallet information
   * @param {Object} accountInfo - Account information from wallet
   */
  updateWalletInfo(accountInfo) {
    if (accountInfo) {
      this.address = accountInfo.address;
      this.publicKey = accountInfo.publicKey;
    }
  }

  /**
   * Disconnect from current wallet
   */
  disconnect() {
    if (this.connectedWallet) {
      // Try to call disconnect on the wallet if available
      try {
        if (typeof this.connectedWallet.disconnect === 'function') {
          this.connectedWallet.disconnect();
        }
      } catch (error) {
        console.warn('Error disconnecting wallet:', error);
      }
    }
    
    // Reset wallet state
    this.connectedWallet = null;
    this.walletProvider = null;
    this.address = null;
    this.publicKey = null;
    this.isConnected = false;
    
    // Clear saved connection
    this.clearSavedConnection();
    
    // Notify listeners
    this.notifyListeners('disconnect');
  }

  /**
   * Save connection info to localStorage
   */
  saveConnection() {
    if (this.walletProvider && this.address) {
      localStorage.setItem('walletProvider', this.walletProvider);
      localStorage.setItem('walletAddress', this.address);
    }
  }

  /**
   * Clear saved connection info
   */
  clearSavedConnection() {
    localStorage.removeItem('walletProvider');
    localStorage.removeItem('walletAddress');
  }

  /**
   * Get wallet information
   * @returns {Object} Wallet information
   */
  getWalletInfo() {
    return {
      provider: this.walletProvider,
      address: this.address,
      publicKey: this.publicKey,
      isConnected: this.isConnected,
      network: this.networkInfo,
      walletName: this.availableWallets.find(w => w.provider === this.walletProvider)?.name || 'Unknown'
    };
  }

  /**
   * Add a listener for wallet events
   * @param {Function} listener - Listener function
   */
  addListener(listener) {
    if (typeof listener === 'function' && !this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  /**
   * Remove a listener
   * @param {Function} listener - Listener to remove
   */
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all listeners of an event
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in wallet listener:', error);
      }
    });
  }

  /**
   * Execute a transaction
   * @param {Object} payload - Transaction payload
   * @param {Object} options - Transaction options
   * @returns {Object} Transaction result
   */
  async executeTransaction(payload, options = {}) {
    if (!this.isConnected || !this.connectedWallet) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Add default options if not provided
      const txOptions = {
        max_gas_amount: options.maxGasAmount || '2000',
        gas_unit_price: options.gasUnitPrice || '100',
        expiration_timestamp_secs: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        ...options
      };
      
      // Execute transaction
      const pendingTx = await this.connectedWallet.signAndSubmitTransaction(payload, txOptions);
      
      // Notify listeners about the pending transaction
      this.notifyListeners('transactionSubmitted', pendingTx);
      
      // If transaction hash is available, you might want to monitor the transaction
      if (pendingTx.hash) {
        this.monitorTransaction(pendingTx.hash);
      }
      
      return pendingTx;
    } catch (error) {
      console.error('Transaction execution error:', error);
      
      // Notify listeners about the transaction error
      this.notifyListeners('transactionError', error);
      
      throw error;
    }
  }

  /**
   * Monitor a transaction's status
   * @param {string} txHash - Transaction hash
   */
  async monitorTransaction(txHash) {
    // This is a simplified implementation
    // You might want to use a more sophisticated approach for production
    
    try {
      // Start polling for transaction status
      const MAX_ATTEMPTS = 10;
      const POLL_INTERVAL = 2000; // 2 seconds
      
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        // Wait for the polling interval
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
        
        try {
          // Fetch transaction status
          // This assumes you're using the Aptos SDK or have set up aptosClient
          if (this.aptosClient) {
            const txInfo = await this.aptosClient.getTransactionByHash(txHash);
            
            // Check if transaction is confirmed
            if (txInfo && txInfo.success !== undefined) {
              // Transaction is confirmed
              this.notifyListeners('transactionConfirmed', {
                hash: txHash,
                success: txInfo.success,
                data: txInfo
              });
              
              return txInfo;
            }
          }
        } catch (error) {
          console.warn(`Attempt ${attempt + 1} to fetch transaction failed:`, error);
          // Continue polling
        }
      }
      
      // If we've reached this point, we've exceeded the maximum number of attempts
      console.warn(`Transaction monitoring exceeded ${MAX_ATTEMPTS} attempts for hash: ${txHash}`);
      
    } catch (error) {
      console.error('Error monitoring transaction:', error);
    }
  }

  /**
   * Sign a message with the connected wallet
   * @param {string} message - Message to sign
   * @returns {Object} Signature information
   */
  async signMessage(message) {
    if (!this.isConnected || !this.connectedWallet) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Sign message
      const signResponse = await this.connectedWallet.signMessage({
        message: message
      });
      
      return signResponse;
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  /**
   * Check if a wallet extension is installed
   * @param {string} provider - Wallet provider name
   * @returns {boolean} Whether the wallet is installed
   */
  isWalletInstalled(provider) {
    switch (provider) {
      case WALLET_PROVIDERS.PETRA:
        return !!window.aptos;
      case WALLET_PROVIDERS.MARTIAN:
        return !!window.martian;
      case WALLET_PROVIDERS.PONTEM:
        return !!window.pontem;
      case WALLET_PROVIDERS.RISE:
        return !!window.rise;
      case WALLET_PROVIDERS.FEWCHA:
        return !!window.fewcha;
      default:
        return false;
    }
  }

  /**
   * Initialize the Aptos client
   * @param {Object} client - Aptos client instance
   */
  setAptosClient(client) {
    this.aptosClient = client;
  }
}

// Create and export a singleton instance
const walletService = new WalletService();
export default walletService;