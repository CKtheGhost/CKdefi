// /server/routes/auth.js - Authentication routes for CompounDefi
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifySignature } = require('../utils/aptosClient');
const { generateToken, verifyToken } = require('../middleware/auth');

/**
 * @route   POST /auth/wallet-verify
 * @desc    Verify wallet ownership using signature
 * @access  Public
 */
router.post('/wallet-verify', async (req, res) => {
  try {
    const { address, message, signature } = req.body;
    
    if (!address || !message || !signature) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: address, message, signature' 
      });
    }
    
    // Verify that the address signed the message
    const isValid = await verifySignature(address, message, signature);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    
    // Generate JWT token
    const token = generateToken(address);
    
    // Save user if they don't exist yet
    // This would connect to your user database in a production app
    
    res.json({
      success: true,
      token,
      address,
      message: 'Wallet verified successfully'
    });
  } catch (error) {
    console.error('Wallet verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Wallet verification failed'
    });
  }
});

/**
 * @route   POST /auth/nonce
 * @desc    Generate a nonce for wallet verification
 * @access  Public
 */
router.post('/nonce', (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ 
        success: false,
        error: 'Wallet address is required'
      });
    }
    
    // Generate random nonce
    const nonce = crypto.randomBytes(32).toString('hex');
    
    // In a production app, you would store this nonce in a database
    // associated with the user's address with an expiration time
    
    // For now, we'll store it in memory (not suitable for production)
    global.nonces = global.nonces || {};
    global.nonces[address] = {
      nonce,
      expires: Date.now() + (5 * 60 * 1000) // 5 minutes
    };
    
    res.json({
      success: true,
      nonce,
      message: `Please sign this message to verify your wallet ownership: ${nonce}`
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate nonce'
    });
  }
});

/**
 * @route   GET /auth/verify-token
 * @desc    Verify JWT token validity
 * @access  Public
 */
router.get('/verify-token', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }
    
    const decoded = verifyToken(token);
    
    res.json({
      success: true,
      address: decoded.address,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

/**
 * @route   POST /auth/logout
 * @desc    Invalidate token (client-side only in this implementation)
 * @access  Public
 */
router.post('/logout', (req, res) => {
  // In a stateful implementation, you would blacklist the token here
  // For a stateless JWT implementation, the client should simply
  // delete the token from localStorage
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @route   POST /auth/social-connect
 * @desc    Connect social account to wallet
 * @access  Private (requires authentication)
 */
router.post('/social-connect', verifyToken, (req, res) => {
  try {
    const { platform, accessToken, username } = req.body;
    const walletAddress = req.user.address;
    
    if (!platform || !accessToken || !username) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: platform, accessToken, username' 
      });
    }
    
    // In a production app, you would verify the social token
    // and associate it with the user's wallet address
    
    res.json({
      success: true,
      message: `Successfully connected ${platform} account`,
      platform,
      username,
      walletAddress
    });
  } catch (error) {
    console.error('Social connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect social account'
    });
  }
});

module.exports = router;