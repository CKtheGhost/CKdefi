// walletService.js - Wallet integration service for CompounDefi
// Handles wallet connection, signatures, and Aptos blockchain interactions

import { AptosClient, AptosAccount, FaucetClient, Types } from 'aptos';
import { 
  WalletClient, 
  Network, 
  NetworkToChainId, 
  NetworkToNodeUrl 
} from '@martiandao/aptos-web3-bip44.js';
import apiService from './api';
import storageService from './storageService';

// Default network
const DEFAULT_NETWORK = process.env.REACT_APP_APTOS_NETWORK || 'mainnet';

// Aptos network configurations
const NETWORK_CONFIG = {
  mainnet: {
    nodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
    chainId: 1,
    name: 'Mainnet',
    explorerUrl: 'https://explorer.aptoslabs.com'
  },
  testnet: {
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
    chainId: 2,
    name: 'Testnet',
    explorerUrl: 'https://explorer.aptoslabs.com/testnet'
  },
  devnet: {
    nodeUrl: 'https://fullnode.devnet.aptoslabs.com/v1',
    chainId: 33,
    name: 'Devnet',
    explorerUrl: 'https://explorer.aptoslabs.com/devnet'
  }
};

class WalletService {
  constructor() {
    this.network = DEFAULT_NETWORK;
    this.client = null;
    this.walletClient = null;
    this.account = null;
    this.isConnected = false;
    this.walletType = null; // 'petra', 'martian', 'pontem', etc.
    this.availableWallets = [];
    
    // Initialize wallet service
    this.init();
  }
  
  /**
   * Initialize wallet service
   */
  async init() {
    try {
      // Initialize Aptos client
      this.client = new AptosClient(NETWORK_CONFIG[this.network].nodeUrl);
      
      // Check for available wallets
      this.detectWallets();
      
      // Check if previously connected
      this.restoreConnection();
    } catch (error) {
      console.error('Failed to initialize wallet service:', error);
    }
  }
  
  /**
   * Detect available wallet extensions
   */
  detectWallets() {
    const availableWallets = [];
    
    // Check for Petra wallet
    if (window.petra) {
      availableWallets.push({
        name: 'Petra',
        id: 'petra',
        icon: '/assets/wallet-icons/petra.svg'
      });
    }
    
    // Check for Martian wallet
    if (window.martian) {
      availableWallets.push({
        name: 'Martian',
        id: 'martian',
        icon: '/assets/wallet-icons/martian.svg'
      });
    }
    
    // Check for Pontem wallet
    if (window.pontem) {
      availableWallets.push({
        name: 'Pontem',
        id: 'pontem',
        icon: '/assets/wallet-icons/pontem.svg'
      });
    }
    
    // Check for Rise wallet
    if (window.rise) {
      availableWallets.push({
        name: 'Rise',
        id: 'rise',
        icon: '/assets/wallet-icons/rise.svg'
      });
    }
    
    // Update available wallets
    this.availableWallets = availableWallets;
    
    return availableWallets;
  }
  
  /**
   * Get available wallets
   * @returns {Array} Available wallet extensions
   */
  getAvailableWallets() {
    return this.availableWallets;
  }
  
  /**
   * Restore previous wallet connection
   */
  async restoreConnection() {
    const savedWallet = storageService.getWallet();
    if (savedWallet && savedWallet.type && savedWallet.address) {
      try {
        await this.connectWallet(savedWallet.type);
      } catch (error) {
        console.error('Failed to restore wallet connection:', error);
        // Clear saved wallet data on connection failure
        storageService.clearWallet();
      }
    }
  }
  
  /**
   * Connect to a wallet
   * @param {string} walletType - Type of wallet to connect
   * @returns {Object} Wallet account info
   */
  async connectWallet(walletType) {
    try {
      let account;
      
      switch (walletType) {
        case 'petra':
          if (!window.petra) {
            throw new Error('Petra wallet extension not found');
          }
          await window.petra.connect();
          account = await window.petra.account();
          this.walletClient = window.petra;
          break;
          
        case 'martian':
          if (!window.martian) {
            throw new Error('Martian wallet extension not found');
          }
          await window.martian.connect();
          account = await window.martian.account();
          this.walletClient = window.martian;
          break;
          
        case 'pontem':
          if (!window.pontem) {
            throw new Error('Pontem wallet extension not found');
          }
          await window.pontem.connect();
          account = await window.pontem.account();
          this.walletClient = window.pontem;
          break;
          
        case 'rise':
          if (!window.rise) {
            throw new Error('Rise wallet extension not found');
          }
          await window.rise.connect();
          account = await window.rise.account();
          this.walletClient = window.rise;
          break;
          
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }
      
      // Update wallet status
      this.account = account;
      this.walletType = walletType;
      this.isConnected = true;
      
      // Save wallet connection
      storageService.saveWallet({
        type: walletType,
        address: account.address
      });
      
      // Authenticate with backend
      await this.authenticateWallet();
      
      return account;
    } catch (error) {
      console.error(`Error connecting to ${walletType} wallet:`, error);
      this.disconnect();
      throw error;
    }
  }
  
  /**
   * Disconnect from wallet
   */
  disconnect() {
    this.account = null;
    this.isConnected = false;
    this.walletType = null;
    this.walletClient = null;
    
    // Clear wallet data
    storageService.clearWallet();
  }
  
  /**
   * Check if wallet is connected
   * @returns {boolean} Connection status
   */
  checkConnection() {
    return this.isConnected && !!this.account;
  }
  
  /**
   * Get connected account
   * @returns {Object} Wallet account
   */
  getAccount() {
    return this.account;
  }
  
  /**
   * Authenticate with the backend using wallet signature
   */
  async authenticateWallet() {
    try {
      if (!this.account || !this.walletClient) {
        throw new Error('Wallet not connected');
      }
      
      // Get nonce from server
      const nonceResponse = await apiService.user.getWalletNonce(this.account.address);
      const message = nonceResponse.message;
      
      // Sign the message with wallet
      const signature = await this.signMessage(message);
      
      // Verify signature with backend and get token
      const authResponse = await apiService.user.registerWithWallet(
        this.account.address,
        signature,
        message
      );
      
      return authResponse;
    } catch (error) {
      console.error('Error authenticating wallet:', error);
      throw error;
    }
  }
  
  /**
   * Sign a message with the connected wallet
   * @param {string} message - Message to sign
   * @returns {string} Signature
   */
  async signMessage(message) {
    try {
      if (!this.walletClient || !this.account) {
        throw new Error('Wallet not connected');
      }
      
      let signature;
      
      // Different wallets have slightly different signing methods
      switch (this.walletType) {
        case 'petra':
          signature = await window.petra.signMessage({
            message,
            address: this.account.address
          });
          break;
          
        case 'martian':
          signature = await window.martian.signMessage({
            message,
            address: this.account.address
          });
          break;
          
        case 'pontem':
          signature = await window.pontem.signMessage(message);
          break;
          
        case 'rise':
          signature = await window.rise.signMessage({
            message,
            address: this.account.address
          });
          break;
          
        default:
          throw new Error(`Unsupported wallet type: ${this.walletType}`);
      }
      
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }
  
  /**
   * Sign and submit a transaction
   * @param {Object} transaction - Transaction payload
   * @returns {Object} Transaction result
   */
  async signAndSubmitTransaction(transaction) {
    try {
      if (!this.walletClient || !this.account) {
        throw new Error('Wallet not connected');
      }
      
      // Sign and submit transaction
      const response = await this.walletClient.signAndSubmitTransaction(transaction);
      
      return {
        hash: response.hash,
        success: true
      };
    } catch (error) {
      console.error('Error signing and submitting transaction:', error);
      throw error;
    }
  }
  
  /**
   * Create a staking transaction for APT
   * @param {string} protocol - Staking protocol
   * @param {number} amount - Amount to stake
   * @returns {Object} Transaction payload
   */
  createStakingTransaction(protocol, amount) {
    // Get contract address for protocol
    const contractAddress = this.getContractAddress(protocol);
    
    // Get function name for staking
    const functionName = this.getFunctionName(protocol, 'stake');
    
    // Convert amount to correct format (octas)
    const amountInOctas = (amount * 100000000).toFixed(0);
    
    // Create transaction payload
    const transaction = {
      type: 'entry_function_payload',
      function: `${contractAddress}${functionName}`,
      type_arguments: [],
      arguments: [amountInOctas.toString()]
    };
    
    return transaction;
  }
  
  /**
   * Create an unstaking transaction for APT
   * @param {string} protocol - Staking protocol
   * @param {number} amount - Amount to unstake
   * @returns {Object} Transaction payload
   */
  createUnstakingTransaction(protocol, amount) {
    // Get contract address for protocol
    const contractAddress = this.getContractAddress(protocol);
    
    // Get function name for unstaking
    const functionName = this.getFunctionName(protocol, 'unstake');
    
    // Convert amount to correct format (octas)
    const amountInOctas = (amount * 100000000).toFixed(0);
    
    // Create transaction payload
    const transaction = {
      type: 'entry_function_payload',
      function: `${contractAddress}${functionName}`,
      type_arguments: [],
      arguments: [amountInOctas.toString()]
    };
    
    return transaction;
  }
  
  /**
   * Get contract address for a protocol
   * @param {string} protocol - Protocol name
   * @returns {string} Contract address
   */
  getContractAddress(protocol) {
    const contracts = {
      amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
      thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
      tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
      ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
      aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
      echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
      pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
      liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12"
    };
    
    return contracts[protocol.toLowerCase()] || null;
  }
  
  /**
   * Get function name for a protocol and operation
   * @param {string} protocol - Protocol name
   * @param {string} operation - Operation type
   * @returns {string} Function name
   */
  getFunctionName(protocol, operation) {
    const functionMappings = {
      'amnis': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake', 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw', 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input'
      },
      'thala': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt', 
        'lend': '::lending::supply_apt', 
        'withdraw': '::lending::withdraw_apt', 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input'
      },
      'tortuga': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt' 
      },
      'ditto': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake' 
      },
      'aries': { 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw' 
      },
      'echo': { 
        'lend': '::lending::supply',
        'withdraw': '::lending::withdraw' 
      }
    };
    
    // Check for protocol-specific function
    if (functionMappings[protocol.toLowerCase()]?.[operation.toLowerCase()]) {
      return functionMappings[protocol.toLowerCase()][operation.toLowerCase()];
    }
    
    // Default function names by operation type
    const defaultFunctions = {
      'stake': '::staking::stake',
      'unstake': '::staking::unstake',
      'lend': '::lending::supply',
      'withdraw': '::lending::withdraw',
      'addLiquidity': '::router::add_liquidity',
      'removeLiquidity': '::router::remove_liquidity',
      'swap': '::router::swap_exact_input'
    };
    
    return defaultFunctions[operation.toLowerCase()] || `::${operation.toLowerCase()}::execute`;
  }
  
  /**
   * Get transaction URL in explorer
   * @param {string} txHash - Transaction hash
   * @returns {string} Explorer URL
   */
  getExplorerUrl(txHash) {
    const baseUrl = NETWORK_CONFIG[this.network].explorerUrl;
    return `${baseUrl}/txn/${txHash}`;
  }
  
  /**
   * Get account URL in explorer
   * @param {string} address - Account address
   * @returns {string} Explorer URL
   */
  getAccountExplorerUrl(address) {
    const baseUrl = NETWORK_CONFIG[this.network].explorerUrl;
    return `${baseUrl}/account/${address}`;
  }
  
  /**
   * Get amount in APT format from octas
   * @param {string|number} octas - Amount in octas
   * @returns {number} Amount in APT
   */
  convertOctasToApt(octas) {
    return parseFloat(octas) / 100000000;
  }
  
  /**
   * Get amount in octas format from APT
   * @param {number} apt - Amount in APT
   * @returns {string} Amount in octas as string
   */
  convertAptToOctas(apt) {
    return (parseFloat(apt) * 100000000).toFixed(0);
  }
}

export default new WalletService();