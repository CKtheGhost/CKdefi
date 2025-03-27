// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const { Ed25519PublicKey } = require('@aptos-labs/ts-sdk');

// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'compoundefi-secret-key';
const JWT_EXPIRY = '24h'; // Token expiry time

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Generate JWT token
 * @param {string} address - Wallet address
 * @param {Object} metadata - Additional metadata
 * @returns {string} JWT token
 */
const generateToken = (address, metadata = {}) => {
  return jwt.sign({ 
    address,
    ...metadata
  }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

/**
 * Verify wallet signature
 * @param {string} address - Wallet address
 * @param {string} message - Message that was signed
 * @param {string} signature - Signature to verify
 * @returns {boolean} Whether signature is valid
 */
const verifySignature = async (address, message, signature) => {
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
};

module.exports = {
  verifyToken,
  generateToken,
  verifySignature
};