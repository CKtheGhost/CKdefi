// walletService.js - Wallet interaction service for CompounDefi

import { trackWalletConnection } from '../utils/analyticsUtils';

// Supported wallet providers and their detection methods
const WALLET_PROVIDERS = {
  PETRA: 'petra',
  MARTIAN: 'martian',
  PONTEM: 'pontem',
  RISE: 'rise',
  BITKEEP: 'bitkeep'
};

/**
 * Class that handles interactions with blockchain wallets
 */
class WalletService {
  constructor() {
    this.walletAddress = null;
    this.connectedProvider = null;
    this.connectionListeners = [];
    this.disconnectionListeners = [];
    this.networkChangeListeners = [];
    this.initialized = false;
    this.initializationPromise = null;
    
    // Bind methods to maintain this context
    this.initialize = this.initialize.bind(this);
    this.detectWalletProviders = this.detectWalletProviders.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.disconnectWallet = this.disconnectWallet.bind(this);
    this.getWalletAddress = this.getWalletAddress.bind(this);
    this.isConnected = this.isConnected.bind(this);
    this.addConnectionListener = this.addConnectionListener.bind(this);
    this.removeConnectionListener = this.removeConnectionListener.bind(this);
    this.addDisconnectionListener = this.addDisconnectionListener.bind(this);
    this.removeDisconnectionListener = this.removeDisconnectionListener.bind(this);
    this.handleAccountChanged = this.handleAccountChanged.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);
    this.signTransaction = this.signTransaction.bind(this);
    this.signAndSubmitTransaction = this.signAndSubmitTransaction.bind(this);
    
    // Initialize from local storage if available
    this.loadStoredConnection();
  }

  /**
   * Initialize the wallet service
   * @returns {Promise<boolean>} Whether initialization was successful
   */
  async initialize() {
    if (this.initialized) return true;
    
    // Use existing initialization promise if already in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = new Promise(async (resolve) => {
      try {
        const availableProviders = await this.detectWalletProviders();
        
        // Setup event listeners for each available provider
        for (const provider of availableProviders) {
          this.setupEventListeners(provider);
        }
        
        // Check if there's a stored connection to restore
        const storedAddress = localStorage.getItem('walletAddress');
        const storedProvider = localStorage.getItem('walletProvider');
        
        if (storedAddress && storedProvider) {
          // Verify the stored connection is still valid
          const isValid = await this.verifyStoredConnection(storedAddress, storedProvider);
          if (isValid) {
            this.walletAddress = storedAddress;
            this.connectedProvider = storedProvider;
            this.notifyConnectionListeners();
          } else {
            // Clear invalid stored connection
            localStorage.removeItem('walletAddress');
            localStorage.removeItem('walletProvider');
          }
        }
        
        this.initialized = true;
        resolve(true);
      } catch (error) {
        console.error('Failed to initialize wallet service:', error);
        resolve(false);
      } finally {
        this.initializationPromise = null;
      }
    });
    
    return this.initializationPromise;
  }

  /**
   * Load stored wallet connection from local storage
   */
  loadStoredConnection() {
    const storedAddress = localStorage.getItem('walletAddress');
    const storedProvider = localStorage.getItem('walletProvider');
    
    if (storedAddress && storedProvider) {
      this.walletAddress = storedAddress;
      this.connectedProvider = storedProvider;
    }
  }

  /**
   * Verify a stored wallet connection is still valid
   * @param {string} address - Wallet address
   * @param {string} provider - Wallet provider name
   * @returns {Promise<boolean>} Whether connection is valid
   */
  async verifyStoredConnection(address, provider) {
    try {
      const providerInstance = window[provider];
      if (!providerInstance) return false;
      
      // Check if wallet is still connected
      let isConnected = false;
      
      if (typeof providerInstance.isConnected === 'function') {
        isConnected = await providerInstance.isConnected();
      } else if (providerInstance.connected !== undefined) {
        isConnected = providerInstance.connected;
      }
      
      if (!isConnected) return false;
      
      // Get current account and check if it matches stored address
      let currentAccount;
      
      if (typeof providerInstance.account === 'function') {
        currentAccount = await providerInstance.account();
      } else if (typeof providerInstance.getAccount === 'function') {
        currentAccount = await providerInstance.getAccount();
      } else {
        currentAccount = providerInstance.account;
      }
      
      return currentAccount && currentAccount.address === address;
    } catch (error) {
      console.error('Error verifying stored connection:', error);
      return false;
    }
  }

  /**
   * Detect available wallet providers
   * @returns {Promise<Array<string>>} Array of available provider names
   */
  async detectWalletProviders() {
    const availableProviders = [];
    
    // Check for each supported wallet provider
    for (const [key, providerName] of Object.entries(WALLET_PROVIDERS)) {
      if (window[providerName]) {
        availableProviders.push(providerName);
      }
    }
    
    return availableProviders;
  }

  /**
   * Connect to a wallet
   * @param {string} providerName - Optional provider name to use, otherwise auto-detects
   * @returns {Promise<{success: boolean, address: string, error: string|null}>} Connection result
   */
  async connectWallet(providerName = null) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      // If already connected, return current connection
      if (this.isConnected()) {
        return {
          success: true,
          address: this.walletAddress,
          error: null,
          provider: this.connectedProvider
        };
      }
      
      // Detect providers if none specified
      let providersToTry = [];
      if (providerName) {
        providersToTry = [providerName];
      } else {
        providersToTry = await this.detectWalletProviders();
      }
      
      if (providersToTry.length === 0) {
        const error = 'No wallet providers detected. Please install Petra or another Aptos wallet.';
        trackWalletConnection(null, 'none', false, error);
        return { success: false, address: null, error, provider: null };
      }
      
      // Try connecting to each provider until success
      let lastError = null;
      for (const provider of providersToTry) {
        try {
          const providerInstance = window[provider];
          if (!providerInstance) continue;
          
          // Connect to wallet
          let account;
          try {
            const response = await providerInstance.connect();
            if (typeof response.address === 'function') {
              account = { address: await response.address() };
            } else if (response.account) {
              account = response.account;
            } else {
              account = response;
            }
          } catch (connectError) {
            lastError = connectError.message || 'Failed to connect to wallet';
            continue; // Try next provider
          }
          
          if (!account || !account.address) {
            lastError = 'Connected but no account returned';
            continue;
          }
          
          // Success!
          this.walletAddress = account.address;
          this.connectedProvider = provider;
          
          // Store connection for persistence
          localStorage.setItem('walletAddress', account.address);
          localStorage.setItem('walletProvider', provider);
          
          // Setup event listeners for this provider
          this.setupEventListeners(provider);
          
          // Track successful connection
          trackWalletConnection(account.address, provider, true);
          
          // Notify listeners
          this.notifyConnectionListeners();
          
          return {
            success: true,
            address: account.address,
            error: null,
            provider
          };
        } catch (providerError) {
          lastError = providerError.message || `Error connecting to ${provider}`;
        }
      }
      
      // If we reach here, all connection attempts failed
      trackWalletConnection(null, providersToTry[0], false, lastError);
      return {
        success: false,
        address: null,
        error: lastError || 'Failed to connect to any wallet provider',
        provider: null
      };
    } catch (error) {
      const errorMessage = error.message || 'Unknown wallet connection error';
      trackWalletConnection(null, providerName, false, errorMessage);
      return {
        success: false,
        address: null,
        error: errorMessage,
        provider: null
      };
    }
  }

  /**
   * Disconnect from current wallet
   * @returns {Promise<{success: boolean, error: string|null}>} Disconnection result
   */
  async disconnectWallet() {
    try {
      if (!this.connectedProvider || !this.walletAddress) {
        return { success: true, error: null }; // Already disconnected
      }
      
      const provider = window[this.connectedProvider];
      if (provider && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }
      
      // Clean up regardless of whether provider's disconnect succeeded
      const oldAddress = this.walletAddress;
      const oldProvider = this.connectedProvider;
      
      this.walletAddress = null;
      this.connectedProvider = null;
      
      // Clear stored connection
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletProvider');
      
      // Notify disconnection listeners
      this.notifyDisconnectionListeners();
      
      // Track disconnection
      trackWalletConnection(oldAddress, oldProvider, true);
      
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error.message || 'Unknown wallet disconnection error';
      console.error('Disconnection error:', errorMessage);
      
      // Force disconnect on client side even if provider call failed
      this.walletAddress = null;
      this.connectedProvider = null;
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletProvider');
      
      // Notify disconnection listeners
      this.notifyDisconnectionListeners();
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Check if wallet is connected
   * @returns {boolean} Whether wallet is connected
   */
  isConnected() {
    return Boolean(this.walletAddress && this.connectedProvider);
  }

  /**
   * Get current wallet address
   * @returns {string|null} Current wallet address or null if not connected
   */
  getWalletAddress() {
    return this.walletAddress;
  }

  /**
   * Get current wallet provider
   * @returns {string|null} Current wallet provider name or null if not connected
   */
  getWalletProvider() {
    return this.connectedProvider;
  }

  /**
   * Sign a transaction
   * @param {Object} transaction - Transaction payload
   * @returns {Promise<Object>} Signed transaction
   */
  async signTransaction(transaction) {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    const provider = window[this.connectedProvider];
    if (!provider) {
      throw new Error('Wallet provider not available');
    }
    
    if (typeof provider.signTransaction !== 'function') {
      throw new Error('Wallet provider does not support transaction signing');
    }
    
    return await provider.signTransaction(transaction);
  }

  /**
   * Sign and submit a transaction
   * @param {Object} transaction - Transaction payload
   * @returns {Promise<Object>} Transaction result
   */
  async signAndSubmitTransaction(transaction) {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    const provider = window[this.connectedProvider];
    if (!provider) {
      throw new Error('Wallet provider not available');
    }
    
    if (typeof provider.signAndSubmitTransaction !== 'function') {
      throw new Error('Wallet provider does not support transaction submission');
    }
    
    try {
      const result = await provider.signAndSubmitTransaction(transaction);
      return result;
    } catch (error) {
      // Enhance error with additional context
      const enhancedError = new Error(error.message || 'Transaction signing failed');
      enhancedError.originalError = error;
      enhancedError.code = error.code;
      enhancedError.transaction = transaction;
      throw enhancedError;
    }
  }

  /**
   * Set up event listeners for wallet provider
   * @param {string} providerName - Provider name
   */
  setupEventListeners(providerName) {
    const provider = window[providerName];
    if (!provider) return;
    
    // Handle account change events
    if (typeof provider.onAccountChange === 'function') {
      provider.onAccountChange(this.handleAccountChanged);
    }
    
    // Set up event listeners for Petra and compatible wallets
    window.addEventListener('aptos:accountChanged', (event) => {
      if (event.detail && event.detail.address) {
        this.handleAccountChanged(event.detail);
      }
    });
    
    window.addEventListener('aptos:disconnected', () => {
      if (this.connectedProvider === providerName) {
        this.walletAddress = null;
        this.connectedProvider = null;
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('walletProvider');
        this.notifyDisconnectionListeners();
      }
    });
    
    window.addEventListener('aptos:networkChanged', (event) => {
      const network = event.detail?.network;
      if (network && this.connectedProvider === providerName) {
        this.notifyNetworkChangeListeners(network);
      }
    });
  }

  /**
   * Handle account change event
   * @param {Object} account - New account info
   */
  handleAccountChanged(account) {
    const newAddress = account.address;
    
    if (newAddress && newAddress !== this.walletAddress) {
      const oldAddress = this.walletAddress;
      this.walletAddress = newAddress;
      
      // Update stored address
      localStorage.setItem('walletAddress', newAddress);
      
      // If previously disconnected, this is a new connection
      if (!oldAddress) {
        this.notifyConnectionListeners();
      }
    } else if (!newAddress && this.walletAddress) {
      // Address cleared, means disconnection
      this.walletAddress = null;
      this.connectedProvider = null;
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletProvider');
      this.notifyDisconnectionListeners();
    }
  }

  /**
   * Add a wallet connection listener
   * @param {Function} listener - Listener function
   */
  addConnectionListener(listener) {
    if (typeof listener === 'function' && !this.connectionListeners.includes(listener)) {
      this.connectionListeners.push(listener);
    }
  }

  /**
   * Remove a wallet connection listener
   * @param {Function} listener - Listener function to remove
   */
  removeConnectionListener(listener) {
    this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
  }

  /**
   * Add a wallet disconnection listener
   * @param {Function} listener - Listener function
   */
  addDisconnectionListener(listener) {
    if (typeof listener === 'function' && !this.disconnectionListeners.includes(listener)) {
      this.disconnectionListeners.push(listener);
    }
  }

  /**
   * Remove a wallet disconnection listener
   * @param {Function} listener - Listener function to remove
   */
  removeDisconnectionListener(listener) {
    this.disconnectionListeners = this.disconnectionListeners.filter(l => l !== listener);
  }

  /**
   * Add a network change listener
   * @param {Function} listener - Listener function
   */
  addNetworkChangeListener(listener) {
    if (typeof listener === 'function' && !this.networkChangeListeners.includes(listener)) {
      this.networkChangeListeners.push(listener);
    }
  }

  /**
   * Remove a network change listener
   * @param {Function} listener - Listener function to remove
   */
  removeNetworkChangeListener(listener) {
    this.networkChangeListeners = this.networkChangeListeners.filter(l => l !== listener);
  }

  /**
   * Notify all connection listeners
   */
  notifyConnectionListeners() {
    this.connectionListeners.forEach(listener => {
      try {
        listener({
          address: this.walletAddress,
          provider: this.connectedProvider
        });
      } catch (error) {
        console.error('Error in wallet connection listener:', error);
      }
    });
  }

  /**
   * Notify all disconnection listeners
   */
  notifyDisconnectionListeners() {
    this.disconnectionListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in wallet disconnection listener:', error);
      }
    });
  }

  /**
   * Notify all network change listeners
   * @param {string} network - New network
   */
  notifyNetworkChangeListeners(network) {
    this.networkChangeListeners.forEach(listener => {
      try {
        listener(network);
      } catch (error) {
        console.error('Error in network change listener:', error);
      }
    });
  }

  /**
   * Get all available wallet providers
   * @returns {Promise<Array<{name: string, installed: boolean}>>} List of wallet providers
   */
  async getAvailableWalletProviders() {
    const availableProviders = await this.detectWalletProviders();
    
    return Object.values(WALLET_PROVIDERS).map(provider => ({
      name: provider,
      installed: availableProviders.includes(provider),
      current: provider === this.connectedProvider
    }));
  }

  /**
   * Check if a specific wallet provider is available
   * @param {string} providerName - Provider name to check
   * @returns {boolean} Whether provider is available
   */
  isProviderAvailable(providerName) {
    return Boolean(window[providerName]);
  }

  /**
   * Switch network on the connected wallet
   * @param {string} network - Network to switch to ('mainnet' or 'testnet')
   * @returns {Promise<boolean>} Whether switch was successful
   */
  async switchNetwork(network) {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    const provider = window[this.connectedProvider];
    if (!provider) {
      throw new Error('Wallet provider not available');
    }
    
    if (typeof provider.setNetwork === 'function') {
      try {
        await provider.setNetwork(network);
        return true;
      } catch (error) {
        console.error('Failed to switch network:', error);
        return false;
      }
    } else if (typeof provider.changeNetwork === 'function') {
      try {
        await provider.changeNetwork(network);
        return true;
      } catch (error) {
        console.error('Failed to change network:', error);
        return false;
      }
    } else {
      throw new Error('Wallet provider does not support network switching');
    }
  }
}

// Create singleton instance
const walletService = new WalletService();

export default walletService;