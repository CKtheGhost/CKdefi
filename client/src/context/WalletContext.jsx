import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';

export const WalletContext = createContext();

// Export the WalletProvider
export const WalletProvider = ({ children }) => {
  return <WalletProviderInner>{children}</WalletProviderInner>;
};

function WalletProviderInner({ children }) {
  const { 
    connect, disconnect, account, network, connected, wallet, 
    signAndSubmitTransaction, signTransaction 
  } = useWalletContext();
  
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simplified notification function
  const showNotification = (notification) => {
    console.log(notification);
  };

  // Update wallet address when account changes
  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address);
      localStorage.setItem('connectedWallet', account.address);
      fetchWalletData(account.address);
    } else {
      setWalletAddress('');
      setWalletData(null);
      localStorage.removeItem('connectedWallet');
    }
  }, [account]);

  // Simplified fetch wallet data
  const fetchWalletData = useCallback(async (address = null) => {
    // Mock implementation
    return null;
  }, []);

  // Refresh wallet data
  const refreshWalletData = useCallback(async () => {
    // Mock implementation
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async (walletName = '') => {
    try {
      await connect();
      return true;
    } catch (err) {
      console.error('Connect wallet error:', err);
      return false;
    }
  }, [connect]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      return true;
    } catch (err) {
      console.error('Disconnect wallet error:', err);
      return false;
    }
  }, [disconnect]);

  // Execute transaction
  const executeTransaction = useCallback(async (transaction) => {
    // Mock implementation
    return { success: false, error: 'Not implemented' };
  }, []);

  // Validate transaction
  const validateTransaction = useCallback(async (transaction) => {
    // Mock implementation
    return { valid: false, error: 'Not implemented' };
  }, []);

  const value = {
    // Connection state
    connected,
    wallet,
    account,
    walletAddress,
    walletData,
    network,
    isLoading,
    isRefreshing,
    error,
    isConnected: connected,
    
    // Actions
    connectWallet,
    disconnectWallet,
    fetchWalletData,
    refreshWalletData,
    executeTransaction,
    validateTransaction,
    signTransaction
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook for using wallet context - renamed to avoid conflict
export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;