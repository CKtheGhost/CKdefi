// /server/routes/wallets.js - Wallet interaction routes for CompounDefi
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const portfolioTracker = require('../modules/portfolio_tracker');
const transactionManager = require('../modules/transaction_manager');

// Initialize Aptos client
const aptosConfig = new AptosConfig({ 
  network: process.env.APTOS_NETWORK === 'TESTNET' ? Network.TESTNET : Network.MAINNET
});
const aptos = new Aptos(aptosConfig);

/**
 * @route   GET /wallets/:address/transactions
 * @desc    Get transaction history for a wallet
 * @access  Public
 */
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    const transactions = await aptos.getAccountTransactions({
      accountAddress: address,
      limit: parseInt(limit),
      start: parseInt(offset)
    });
    
    // Process and classify transactions
    const processedTransactions = [];
    
    for (const tx of transactions) {
      try {
        const processed = {
          hash: tx.hash,
          timestamp: tx.timestamp,
          success: tx.success,
          version: tx.version,
          type: classifyTransactionType(tx),
          gasUsed: tx.gas_used,
          sender: tx.sender,
          details: extractTransactionDetails(tx)
        };
        
        processedTransactions.push(processed);
      } catch (err) {
        console.error(`Error processing transaction ${tx.hash}:`, err);
        // Skip problematic transactions
      }
    }
    
    res.json({
      address,
      transactions: processedTransactions,
      total: processedTransactions.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * @route   GET /wallets/:address/resources
 * @desc    Get on-chain resources for a wallet
 * @access  Public
 */
router.get('/:address/resources', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    const resources = await aptos.getAccountResources({
      accountAddress: address,
    });
    
    // Process resources to a more usable format
    const processedResources = resources.map(resource => ({
      type: resource.type,
      data: resource.data
    }));
    
    res.json({
      address,
      resources: processedResources,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching wallet resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

/**
 * @route   GET /wallets/:address/nfts
 * @desc    Get NFTs owned by a wallet
 * @access  Public
 */
router.get('/:address/nfts', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    // This would connect to an NFT indexer in a production app
    // For now, we'll use a simplified approach
    const nfts = await portfolioTracker.getNFTData(address);
    
    res.json({
      address,
      nfts,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

/**
 * @route   POST /wallets/:address/simulate-transaction
 * @desc    Simulate a transaction without executing it
 * @access  Public
 */
router.post('/:address/simulate-transaction', async (req, res) => {
  try {
    const { address } = req.params;
    const { transaction } = req.body;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    if (!transaction) {
      return res.status(400).json({ error: 'Transaction payload is required' });
    }
    
    // Simulate transaction
    const result = await transactionManager.simulateTransaction(transaction, address);
    
    res.json({
      address,
      success: result.success,
      gasEstimate: result.gas_used,
      vmStatus: result.vm_status,
      changes: result.changes,
      simulationTimestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error simulating transaction:', error);
    res.status(500).json({ error: 'Failed to simulate transaction' });
  }
});

/**
 * @route   POST /wallets/:address/broadcast-transaction
 * @desc    Broadcast a signed transaction to the network
 * @access  Public (should be protected in production)
 */
router.post('/:address/broadcast-transaction', async (req, res) => {
  try {
    const { address } = req.params;
    const { signedTransaction } = req.body;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    if (!signedTransaction) {
      return res.status(400).json({ error: 'Signed transaction payload is required' });
    }
    
    // Submit transaction
    const result = await transactionManager.submitTransaction(signedTransaction);
    
    res.json({
      address,
      transactionHash: result.hash,
      success: true,
      submitTimestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error broadcasting transaction:', error);
    res.status(500).json({ error: 'Failed to broadcast transaction' });
  }
});

/**
 * @route   GET /wallets/:address/tokens
 * @desc    Get token balances for a wallet
 * @access  Public
 */
router.get('/:address/tokens', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    const tokens = await portfolioTracker.getTokenBalances(address);
    
    res.json({
      address,
      tokens,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

/**
 * @route   GET /wallets/:address/staking
 * @desc    Get staking positions for a wallet
 * @access  Public
 */
router.get('/:address/staking', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x') || address.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }
    
    const stakingPositions = await portfolioTracker.getStakingPositions(address);
    
    res.json({
      address,
      stakingPositions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching staking positions:', error);
    res.status(500).json({ error: 'Failed to fetch staking positions' });
  }
});

// Helper functions
function classifyTransactionType(transaction) {
  if (!transaction.payload) return 'unknown';
  
  const functionName = transaction.payload.function?.toLowerCase() || '';
  
  if (functionName.includes('::staking::')) {
    return 'staking';
  } else if (functionName.includes('::coin::')) {
    return 'token_transfer';
  } else if (functionName.includes('::swap::') || functionName.includes('::exchange::')) {
    return 'swap';
  } else if (functionName.includes('::pool::') || functionName.includes('::liquidity::')) {
    return 'liquidity';
  } else if (functionName.includes('::lending::') || functionName.includes('::borrow::')) {
    return 'lending';
  } else if (functionName.includes('::nft::') || functionName.includes('::token::')) {
    return 'nft';
  }
  
  return 'contract_interaction';
}

function extractTransactionDetails(transaction) {
  // Basic extraction - this would be more comprehensive in production
  const details = {
    function: transaction.payload?.function || '',
    arguments: transaction.payload?.arguments || [],
    typeArguments: transaction.payload?.type_arguments || []
  };
  
  // Attempt to determine protocol
  const functionName = details.function.toLowerCase();
  if (functionName.includes('amnis')) {
    details.protocol = 'Amnis';
  } else if (functionName.includes('thala')) {
    details.protocol = 'Thala';
  } else if (functionName.includes('tortuga')) {
    details.protocol = 'Tortuga';
  } else if (functionName.includes('liquidswap')) {
    details.protocol = 'Liquidswap';
  } else if (functionName.includes('pancake')) {
    details.protocol = 'PancakeSwap';
  } else if (functionName.includes('ditto')) {
    details.protocol = 'Ditto';
  }
  
  return details;
}

module.exports = router;