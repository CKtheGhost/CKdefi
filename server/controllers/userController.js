// server/controllers/userController.js
const { generateToken, verifySignature } = require('../middleware/auth');
const logger = require('../utils/logger');
const User = require('../models/user');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registerUser = async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: walletAddress, signature, and message are required' 
      });
    }
    
    // Verify signature
    const isValid = await verifySignature(walletAddress, message, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ walletAddress });
    
    if (user) {
      // User exists, update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({ 
        walletAddress,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          riskProfile: 'balanced',
          darkMode: true,
          autoRebalance: false
        }
      });
      
      logger.info(`New user registered: ${walletAddress}`);
    }
    
    // Generate token
    const token = generateToken(walletAddress);
    
    res.status(200).json({
      success: true,
      token,
      user: {
        walletAddress: user.walletAddress,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    logger.error('Error in user registration:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserProfile = async (req, res) => {
  try {
    const walletAddress = req.user.address;
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        activitySummary: user.activitySummary || {}
      }
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error while fetching user profile' });
  }
};

/**
 * Update user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserPreferences = async (req, res) => {
  try {
    const walletAddress = req.user.address;
    const { preferences } = req.body;
    
    if (!preferences) {
      return res.status(400).json({ error: 'Preferences object is required' });
    }
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update preferences while maintaining existing ones
    user.preferences = {
      ...user.preferences,
      ...preferences
    };
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Server error while updating preferences' });
  }
};

/**
 * Delete user account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUserAccount = async (req, res) => {
  try {
    const walletAddress = req.user.address;
    const { signature, message } = req.body;
    
    if (!signature || !message) {
      return res.status(400).json({ error: 'Signature and message are required for account deletion' });
    }
    
    // Verify signature
    const isValid = await verifySignature(walletAddress, message, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const result = await User.deleteOne({ walletAddress });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    logger.info(`User account deleted: ${walletAddress}`);
    
    res.status(200).json({
      success: true,
      message: 'User account successfully deleted'
    });
  } catch (error) {
    logger.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Server error while deleting account' });
  }
};

/**
 * Get user activity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserActivity = async (req, res) => {
  try {
    const walletAddress = req.user.address;
    
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return activity data with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Get activity from most recent to oldest
    const activities = user.activities || [];
    const paginatedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice((page - 1) * limit, page * limit);
    
    res.status(200).json({
      success: true,
      activities: paginatedActivities,
      pagination: {
        page,
        limit,
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Server error while fetching activity' });
  }
};

/**
 * Log user activity
 * @param {string} walletAddress - User wallet address
 * @param {string} activityType - Type of activity
 * @param {Object} details - Activity details
 */
const logUserActivity = async (walletAddress, activityType, details) => {
  try {
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      logger.warn(`Attempted to log activity for non-existent user: ${walletAddress}`);
      return false;
    }
    
    // Initialize activities array if it doesn't exist
    if (!user.activities) {
      user.activities = [];
    }
    
    // Add new activity
    user.activities.push({
      activityType,
      details,
      timestamp: new Date()
    });
    
    // Limit activities to most recent 100
    if (user.activities.length > 100) {
      user.activities = user.activities.slice(-100);
    }
    
    // Update activity summary
    if (!user.activitySummary) {
      user.activitySummary = {};
    }
    
    if (!user.activitySummary[activityType]) {
      user.activitySummary[activityType] = 0;
    }
    
    user.activitySummary[activityType]++;
    
    await user.save();
    return true;
  } catch (error) {
    logger.error(`Error logging user activity for ${walletAddress}:`, error);
    return false;
  }
};

module.exports = {
  registerUser,
  getUserProfile,
  updateUserPreferences,
  deleteUserAccount,
  getUserActivity,
  logUserActivity
};