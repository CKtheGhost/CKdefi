// validators.js - Input validation utilities for CompounDefi

/**
 * Validate a wallet address
 * @param {string} address - Wallet address to validate
 * @returns {boolean} Whether the address is valid
 */
export const isValidAddress = (address) => {
  if (!address) return false;
  
  // Aptos address format: 0x followed by 64 hex characters
  const aptosAddressPattern = /^0x[a-fA-F0-9]{64}$/;
  return aptosAddressPattern.test(address);
};

/**
 * Validate an APT amount (must be a positive number)
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum allowed amount (default: 0)
 * @param {number} max - Maximum allowed amount (optional)
 * @returns {boolean} Whether the amount is valid
 */
export const isValidAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (amount === undefined || amount === null) return false;
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return !isNaN(numAmount) && numAmount >= min && numAmount <= max;
};

/**
 * Validate a percentage value
 * @param {number|string} percentage - Percentage to validate
 * @param {number} min - Minimum allowed percentage (default: 0)
 * @param {number} max - Maximum allowed percentage (default: 100)
 * @returns {boolean} Whether the percentage is valid
 */
export const isValidPercentage = (percentage, min = 0, max = 100) => {
  if (percentage === undefined || percentage === null) return false;
  
  const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  return !isNaN(numPercentage) && numPercentage >= min && numPercentage <= max;
};

/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Basic email pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

/**
 * Validate a risk profile selection
 * @param {string} profile - Risk profile to validate
 * @returns {boolean} Whether the profile is valid
 */
export const isValidRiskProfile = (profile) => {
  if (!profile) return false;
  
  const validProfiles = ['conservative', 'balanced', 'aggressive', 'yield_optimizer', 'stablecoin_yield'];
  return validProfiles.includes(profile.toLowerCase());
};

/**
 * Validate a protocol name
 * @param {string} protocol - Protocol name to validate
 * @param {Array} allowedProtocols - List of allowed protocols (optional)
 * @returns {boolean} Whether the protocol is valid
 */
export const isValidProtocol = (protocol, allowedProtocols = null) => {
  if (!protocol) return false;
  
  // Default allowed protocols
  const defaultProtocols = [
    'amnis', 'thala', 'tortuga', 'ditto',  // Liquid staking
    'aries', 'echelon', 'echo', 'joule', 'abel',  // Lending
    'pancakeswap', 'liquidswap', 'cetus', 'sushi', 'aux',  // DEXes
    'merkle', 'fetch',  // Yield optimizers
    'thala_stablecoin', 'momento',  // Stablecoins
    'pontem', 'apt_farm'  // Others
  ];
  
  const protocols = allowedProtocols || defaultProtocols;
  return protocols.includes(protocol.toLowerCase());
};

/**
 * Validate a transaction hash
 * @param {string} hash - Transaction hash to validate
 * @returns {boolean} Whether the hash is valid
 */
export const isValidTransactionHash = (hash) => {
  if (!hash) return false;
  
  // Transaction hash format: 0x followed by 64 hex characters
  const hashPattern = /^0x[a-fA-F0-9]{64}$/;
  return hashPattern.test(hash);
};

/**
 * Validate a contract address
 * @param {string} address - Contract address to validate
 * @returns {boolean} Whether the address is valid
 */
export const isValidContractAddress = (address) => {
  // Same format as wallet address for Aptos
  return isValidAddress(address);
};

/**
 * Validate a date string
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} Whether the date is valid
 */
export const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

/**
 * Validate a protocol operation type
 * @param {string} operationType - Operation type to validate
 * @returns {boolean} Whether the operation type is valid
 */
export const isValidOperationType = (operationType) => {
  if (!operationType) return false;
  
  const validOperations = [
    'stake', 'unstake',
    'lend', 'withdraw',
    'addLiquidity', 'removeLiquidity',
    'swap', 'deposit', 
    'borrow', 'repay',
    'mint', 'burn'
  ];
  
  return validOperations.includes(operationType);
};

/**
 * Validate a recommendation form input
 * @param {Object} formData - Recommendation form data
 * @returns {Object} Validation result { isValid, errors }
 */
export const validateRecommendationForm = (formData) => {
  const errors = {};
  
  // Validate amount
  if (!formData.amount) {
    errors.amount = 'Amount is required';
  } else if (!isValidAmount(formData.amount, 0.1)) {
    errors.amount = 'Amount must be at least 0.1 APT';
  }
  
  // Validate risk profile
  if (!formData.riskProfile) {
    errors.riskProfile = 'Risk profile is required';
  } else if (!isValidRiskProfile(formData.riskProfile)) {
    errors.riskProfile = 'Invalid risk profile';
  }
  
  // If walletAddress is provided, validate it
  if (formData.walletAddress && !isValidAddress(formData.walletAddress)) {
    errors.walletAddress = 'Invalid wallet address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate auto-optimizer settings
 * @param {Object} settings - Auto-optimizer settings
 * @returns {Object} Validation result { isValid, errors }
 */
export const validateOptimizerSettings = (settings) => {
  const errors = {};
  
  // Validate rebalance threshold
  if (settings.rebalanceThreshold !== undefined) {
    if (!isValidPercentage(settings.rebalanceThreshold, 0.5, 20)) {
      errors.rebalanceThreshold = 'Threshold must be between 0.5% and 20%';
    }
  }
  
  // Validate max slippage
  if (settings.maxSlippage !== undefined) {
    if (!isValidPercentage(settings.maxSlippage, 0.1, 5)) {
      errors.maxSlippage = 'Slippage must be between 0.1% and 5%';
    }
  }
  
  // Validate interval
  if (settings.interval !== undefined) {
    if (!isValidAmount(settings.interval, 1, 168)) {
      errors.interval = 'Interval must be between 1 and 168 hours';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate a portfolio rebalance operation
 * @param {Object} operation - Rebalance operation
 * @returns {boolean} Whether the operation is valid
 */
export const isValidRebalanceOperation = (operation) => {
  if (!operation) return false;
  
  return (
    isValidProtocol(operation.protocol) &&
    isValidOperationType(operation.type) &&
    isValidAmount(operation.amount) &&
    isValidContractAddress(operation.contractAddress)
  );
};