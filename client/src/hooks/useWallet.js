// useWallet.js - Hook for wallet connectivity and management
import { useState, useEffect, useCallback, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Hook for managing wallet connections and operations on Aptos
 */
export const useWallet = () => {
  // State for wallet connection
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState('');

  // Get notification context for showing status
  const { showNotification } = useContext(NotificationContext);

  /**
   * Connect to wallet
   * Supports multiple wallet providers (Petra, Martian, etc.)
   */
  const connect = useCallback(async (providerName = null) => {
    try {
      setIsConnecting(true);
      setConnectionError(null);

      // Check for available wallet providers
      const providers = [];
      if (window.aptos) providers.push({ name: 'aptos', provider: window.aptos });
      if (window.petra) providers.push({ name: 'petra', provider: window.petra });
      if (window.martian) providers.push({ name: 'martian', provider: window.martian });
      if (window.pontem) providers.push({ name: 'pontem', provider: window.pontem });
      if (window.rise) providers.push({ name: 'rise', provider: window.rise });
      if (window.fewcha) providers.push({ name: 'fewcha', provider: window.fewcha });

      if (providers.length === 0) {
        throw new Error('No wallet providers found. Please install a compatible Aptos wallet extension.');
      }

      // Find specified provider or use first available
      let targetProvider;
      if (providerName) {
        targetProvider = providers.find(p => p.name.toLowerCase() === providerName.toLowerCase());
        if (!targetProvider) {
          throw new Error(`${providerName} wallet not found. Please install the extension.`);
        }
      } else {
        targetProvider = providers[0];
      }

      // Connect to wallet
      const walletProvider = targetProvider.provider;
      const response = await walletProvider.connect();
      
      // Extract wallet address from response (handle different formats)
      const address = typeof response === 'string' 
        ? response 
        : response.address || (response.account?.address) || 
          (typeof response.account === 'function' ? (await response.account()).address : null);

      if (!address) {
        throw new Error('Failed to retrieve wallet address');
      }

      // Get network info if available
      let network = null;
      let networkId = null;
      try {
        if (walletProvider.network) {
          network = await walletProvider.network();
        } else if (walletProvider.getNetwork) {
          network = await walletProvider.getNetwork();
        } else if (walletProvider.chainId) {
          networkId = await walletProvider.chainId();
        }
      } catch (networkError) {
        console.warn('Failed to fetch network information:', networkError);
      }

      const networkLabel = getNetworkLabel(network || networkId);
      
      // Update wallet state
      setWallet(response);
      setWalletAddress(address);
      setIsConnected(true);
      setProvider(walletProvider);
      setNetworkName(networkLabel);
      
      // Store wallet address in local storage for persistence
      localStorage.setItem('connectedWallet', address);
      localStorage.setItem('walletProvider', targetProvider.name);
      
      showNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: `Successfully connected to ${targetProvider.name} wallet`
      });
      
      return { address, provider: walletProvider };
    } catch (error) {
      console.error('Wallet connection error:', error);
      const errorMessage = getWalletErrorMessage(error);
      setConnectionError(errorMessage);
      
      showNotification({
        type: 'error',
        title: 'Connection Failed',
        message: errorMessage
      });
      
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [showNotification]);

  /**
   * Disconnect from the wallet
   */
  const disconnect = useCallback(async () => {
    try {
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
      
      // Clear wallet state
      setWallet(null);
      setWalletAddress('');
      setIsConnected(false);
      setProvider(null);
      
      // Remove stored wallet info
      localStorage.removeItem('connectedWallet');
      localStorage.removeItem('walletProvider');
      
      showNotification({
        type: 'info',
        title: 'Wallet Disconnected',
        message: 'Successfully disconnected wallet'
      });
      
      return true;
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      
      showNotification({
        type: 'error',
        title: 'Disconnection Failed',
        message: `Failed to disconnect wallet: ${error.message}`
      });
      
      return false;
    }
  }, [provider, showNotification]);

  /**
   * Sign and submit a transaction
   */
  const signAndSubmitTransaction = useCallback(async (transaction) => {
    if (!isConnected || !provider) {
      throw new Error('Wallet not connected');
    }
    
    try {
      showNotification({
        type: 'info',
        title: 'Transaction Initiated',
        message: 'Please confirm the transaction in your wallet'
      });
      
      const result = await provider.signAndSubmitTransaction(transaction);
      
      // Extract transaction hash from result (handles different provider formats)
      const hash = result.hash || result.txHash || result.transaction?.hash;
      
      if (!hash) {
        throw new Error('Transaction submitted but no transaction hash returned');
      }
      
      showNotification({
        type: 'success',
        title: 'Transaction Submitted',
        message: `Transaction submitted to the blockchain`
      });
      
      return { success: true, hash, result };
    } catch (error) {
      console.error('Transaction error:', error);
      
      // Check if user rejected transaction
      if (error.message?.includes('reject') || error.message?.includes('cancel') || error.message?.includes('denied')) {
        showNotification({
          type: 'warning',
          title: 'Transaction Cancelled',
          message: 'You cancelled the transaction'
        });
        
        return { success: false, error: 'User cancelled transaction' };
      }
      
      showNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: `Error: ${error.message}`
      });
      
      return { success: false, error: error.message };
    }
  }, [isConnected, provider, showNotification]);

  /**
   * Check transaction status
   */
  const checkTransactionStatus = useCallback(async (txHash) => {
    try {
      // First try using provider's built-in method if available
      if (provider && provider.getTransaction) {
        const txInfo = await provider.getTransaction(txHash);
        return {
          confirmed: txInfo?.success === true,
          status: txInfo?.success ? 'confirmed' : 'failed',
          vmStatus: txInfo?.vm_status,
          hash: txHash,
          success: txInfo?.success
        };
      }
      
      // Otherwise, use Aptos Explorer API
      const response = await fetch(`https://fullnode.mainnet.aptoslabs.com/v1/transactions/by_hash/${txHash}`);
      
      if (!response.ok) {
        throw new Error(`Explorer API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        confirmed: data.success === true,
        status: data.success ? 'confirmed' : 'failed',
        vmStatus: data.vm_status,
        gasUsed: data.gas_used,
        timestamp: data.timestamp,
        version: data.version,
        hash: txHash,
        success: data.success
      };
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return {
        confirmed: false,
        status: 'pending',
        hash: txHash,
        error: error.message
      };
    }
  }, [provider]);

  /**
   * Restore wallet connection on component mount if available
   */
  useEffect(() => {
    const restoreSavedConnection = async () => {
      const savedAddress = localStorage.getItem('connectedWallet');
      const savedProvider = localStorage.getItem('walletProvider');
      
      if (savedAddress && !isConnected && !isConnecting) {
        try {
          await connect(savedProvider);
        } catch (error) {
          console.error('Failed to restore wallet connection:', error);
          localStorage.removeItem('connectedWallet');
          localStorage.removeItem('walletProvider');
        }
      }
    };
    
    restoreSavedConnection();
  }, [connect, isConnected, isConnecting]);

  /**
   * Set up wallet event listeners
   */
  useEffect(() => {
    const handleAccountChange = (account) => {
      if (account) {
        const address = account.address || (typeof account === 'object' ? account.address : account);
        if (address && address !== walletAddress) {
          setWalletAddress(address);
          localStorage.setItem('connectedWallet', address);
          
          showNotification({
            type: 'info',
            title: 'Account Changed',
            message: 'Your wallet account has changed'
          });
        }
      } else {
        // Account disconnected
        setWallet(null);
        setWalletAddress('');
        setIsConnected(false);
        localStorage.removeItem('connectedWallet');
        localStorage.removeItem('walletProvider');
      }
    };
    
    const handleNetworkChange = (network) => {
      if (network) {
        const networkLabel = getNetworkLabel(network);
        setNetworkName(networkLabel);
        
        showNotification({
          type: 'info',
          title: 'Network Changed',
          message: `Switched to ${networkLabel}`
        });
      }
    };
    
    // Set up provider event listeners
    if (provider) {
      if (provider.onAccountChange) {
        provider.onAccountChange(handleAccountChange);
      }
      
      if (provider.onNetworkChange) {
        provider.onNetworkChange(handleNetworkChange);
      }
    }
    
    // Global event listeners for wallet changes
    window.addEventListener('aptos:accountChanged', (event) => {
      if (event.detail) {
        handleAccountChange(event.detail);
      }
    });
    
    window.addEventListener('aptos:networkChanged', (event) => {
      if (event.detail) {
        handleNetworkChange(event.detail.network);
      }
    });
    
    window.addEventListener('aptos:disconnected', () => {
      setWallet(null);
      setWalletAddress('');
      setIsConnected(false);
      localStorage.removeItem('connectedWallet');
      localStorage.removeItem('walletProvider');
      
      showNotification({
        type: 'info',
        title: 'Wallet Disconnected',
        message: 'Your wallet has been disconnected'
      });
    });
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('aptos:accountChanged', handleAccountChange);
      window.removeEventListener('aptos:networkChanged', handleNetworkChange);
      window.removeEventListener('aptos:disconnected', () => {});
    };
  }, [provider, walletAddress, showNotification]);

  /**
   * Utility function to get wallet error message
   */
  const getWalletErrorMessage = (error) => {
    const errorMessage = error.message || String(error);
    
    if (errorMessage.includes('not installed') || errorMessage.includes('not detected')) {
      return 'Wallet extension not installed. Please install a compatible wallet.';
    }
    
    if (errorMessage.includes('user rejected') || errorMessage.includes('canceled')) {
      return 'Connection request was rejected. Please approve the connection in your wallet.';
    }
    
    if (errorMessage.includes('timeout')) {
      return 'Connection timed out. Please try again.';
    }
    
    return `Wallet connection failed: ${errorMessage}`;
  };

  /**
   * Utility function to get network label
   */
  const getNetworkLabel = (network) => {
    if (!network) return 'Unknown';
    
    if (typeof network === 'string') {
      return network.charAt(0).toUpperCase() + network.slice(1);
    }
    
    if (network === 1 || network === '1') return 'Mainnet';
    if (network === 2 || network === '2') return 'Testnet';
    if (network === 'mainnet') return 'Mainnet';
    if (network === 'testnet') return 'Testnet';
    
    return 'Unknown';
  };

  return {
    isConnected,
    isConnecting,
    wallet,
    walletAddress,
    provider,
    connectionError,
    networkName,
    connect,
    disconnect,
    signAndSubmitTransaction,
    checkTransactionStatus
  };
};

export default useWallet;