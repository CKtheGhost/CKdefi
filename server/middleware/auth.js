// auth.js - Authentication middleware for CompounDefi API
// Handles wallet authentication and request verification

const jwt = require('jsonwebtoken');
const { Ed25519PublicKey } = require('@aptos-labs/ts-sdk');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRY = '24h'; // Token expiry time

/**
 * Verify wallet signature to authenticate requests
 * Allows public endpoints to pass through without authentication
 */
function verifyWalletAuth(req, res, next) {
  // Public endpoints that don't require authentication
  const publicEndpoints = [
    { path: '/api/status', method: 'GET' },
    { path: '/api/tokens/latest', method: 'GET' },
    { path: '/api/news/latest', method: 'GET' },
    { path: '/api/contracts', method: 'GET' }
  ];
  
  // Check if the request is for a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    req.path.startsWith(endpoint.path) && req.method === endpoint.method
  );
  
  if (isPublicEndpoint) {
    return next(); // Allow access to public endpoints
  }
  
  // Get authentication token from header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    // Extract token from Authorization header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user data to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Verify that the wallet address in request belongs to the authenticated user
 * Used for routes that operate on specific wallet addresses
 */
function verifyWalletOwnership(req, res, next) {
  // Skip verification for admin users if needed
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  // Get wallet address from params or body
  const walletAddress = req.params.address || req.body.walletAddress;
  
  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }
  
  // Verify that the wallet address belongs to the authenticated user
  if (req.user && req.user.address !== walletAddress) {
    return res.status(403).json({ 
      error: 'You are not authorized to access this wallet\'s data' 
    });
  }
  
  next();
}

/**
 * Generate JWT token for authenticated wallet
 * @param {string} address - Wallet address
 * @param {Object} metadata - Additional user metadata
 * @returns {string} JWT token
 */
function generateToken(address, metadata = {}) {
  return jwt.sign({ 
    address,
    ...metadata
  }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify a wallet signature to authenticate user
 * @param {string} address - Wallet address
 * @param {string} message - Original message that was signed
 * @param {string} signature - Signature to verify
 * @returns {boolean} True if signature is valid
 */
async function verifyWalletSignature(address, message, signature) {
  try {
    // Convert hex address to public key
    const publicKey = new Ed25519PublicKey(address);
    
    // Verify signature
    const isValid = await publicKey.verifySignature({
      message: new TextEncoder().encode(message),
      signature: Buffer.from(signature, 'hex')
    });
    
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

module.exports = {
  verifyWalletAuth,
  verifyWalletOwnership,
  generateToken,
  verifyWalletSignature
};