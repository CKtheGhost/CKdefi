import { useState, useEffect, useCallback } from 'react';
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from 'aptos';

// Create a hook for wallet functionality
export const useWallet = () => {
  // Use the wallet adapter from Aptos
  const { 
    connect, disconnect, account, network, wallet: aptosWallet, 
    connected, signMessage: aptosSignMessage, signAndSubmitTransaction
  } = useAptosWallet();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [wallet, setWallet] = useState(null);
  
  const aptosClient = new AptosClient(
    network?.name?.toLowerCase() === 'testnet' 
      ? 'https://fullnode.testnet.aptoslabs.com/v1'
      : 'https://fullnode.mainnet.aptoslabs.com/v1'
  );

  // Set wallet info when account changes
  useEffect(() => {
    if (account && connected) {
      setWallet({
        address: account.address,
        publicKey: account.publicKey,
        name: aptosWallet?.name || 'Unknown Wallet',
        icon: aptosWallet?.icon || null,
        network: network?.name || 'mainnet'
      });
      
      // Get balance when account changes
      fetchBalance(account.address);
    } else {
      setWallet(null);
      setBalance(null);
    }
  }, [account, connected, aptosWallet, network]);

  // Fetch APT balance
  const fetchBalance = useCallback(async (address) => {
    if (!address) return;
    
    try {
      setLoading(true);
      const resources = await aptosClient.getAccountResources(address);
      
      // Find APT coin
      const aptosCoin = resources.find(r => 
        r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
      );
      
      if (aptosCoin) {
        const balance = parseInt(aptosCoin.data.coin.value) / 100000000; // Convert from octas
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to load wallet balance');
      setBalance(0);
    } finally {
      setLoading(false);
    }
  }, [aptosClient]);

  // Sign a message with the wallet
  const signMessage = useCallback(async (message) => {
    if (!connected) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setLoading(true);
      const response = await aptosSignMessage({
        message,
        address: account?.address
      });
      
      return response?.signature || null;
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err.message || 'Failed to sign message');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, account, aptosSignMessage]);

  // Submit a transaction
  const submitTransaction = useCallback(async (payload) => {
    if (!connected) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setLoading(true);
      const response = await signAndSubmitTransaction(payload);
      
      // Wait for transaction confirmation
      await aptosClient.waitForTransaction(response.hash);
      
      // Refresh balance after transaction
      fetchBalance(account.address);
      
      return response;
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, [connected, account, signAndSubmitTransaction, aptosClient, fetchBalance]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      await connect();
      return true;
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      return false;
    } finally {
      setLoading(false);
    }
  }, [connect]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      setLoading(true);
      await disconnect();
      return true;
    } catch (err) {
      console.error('Disconnect error:', err);
      setError(err.message || 'Failed to disconnect wallet');
      return false;
    } finally {
      setLoading(false);
    }
  }, [disconnect]);

  return {
    wallet,
    balance,
    connected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    signMessage,
    submitTransaction,
    fetchBalance
  };
};

export default useWallet;
