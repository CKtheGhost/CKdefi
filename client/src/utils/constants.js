// constants.js - Application-wide constants for CompounDefi

// API endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export const API_ENDPOINTS = {
  STATUS: '/status',
  TOKENS: '/tokens/latest',
  NEWS: '/news/latest',
  WALLET: (address) => `/wallet/${address}`,
  TRANSACTIONS: (address) => `/wallet/${address}/transactions`,
  STAKING_RATES: '/staking/rates',
  CONTRACTS: '/contracts',
  AI_RECOMMENDATION: '/recommendations/ai',
  EXECUTE_STRATEGY: '/execute-strategy',
  AUTO_REBALANCE: {
    STATUS: '/auto-rebalance/status',
    SETTINGS: '/auto-rebalance/settings',
    EXECUTE: '/auto-rebalance/execute'
  },
  USER_PREFERENCES: '/user/preferences'
};

// Risk profiles
export const RISK_PROFILES = {
  CONSERVATIVE: 'conservative',
  BALANCED: 'balanced',
  AGGRESSIVE: 'aggressive',
  MAX_YIELD: 'maxYield'
};

// Protocol categories
export const PROTOCOL_CATEGORIES = {
  STAKING: 'staking',
  LENDING: 'lending',
  DEX: 'dex',
  YIELD: 'yield',
  STABLECOIN: 'stablecoin'
};

// Default investment amounts
export const DEFAULT_AMOUNTS = [10, 50, 100, 500, 1000, 5000];

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#10b981',
  TERTIARY: '#8b5cf6',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  SAFE: '#34d399',
  NEUTRAL: '#9ca3af'
};

// Protocol logos and metadata
export const PROTOCOL_META = {
  amnis: {
    name: 'Amnis Finance',
    logo: '/assets/protocols/amnis.png',
    color: '#3b82f6',
    category: PROTOCOL_CATEGORIES.STAKING,
    website: 'https://amnis.finance'
  },
  thala: {
    name: 'Thala',
    logo: '/assets/protocols/thala.png',
    color: '#8b5cf6',
    category: PROTOCOL_CATEGORIES.STAKING,
    website: 'https://thala.fi'
  },
  tortuga: {
    name: 'Tortuga',
    logo: '/assets/protocols/tortuga.png',
    color: '#10b981',
    category: PROTOCOL_CATEGORIES.STAKING,
    website: 'https://tortuga.finance'
  },
  ditto: {
    name: 'Ditto',
    logo: '/assets/protocols/ditto.png',
    color: '#f59e0b',
    category: PROTOCOL_CATEGORIES.STAKING,
    website: 'https://ditto.money'
  },
  echo: {
    name: 'Echo Finance',
    logo: '/assets/protocols/echo.png',
    color: '#ef4444',
    category: PROTOCOL_CATEGORIES.LENDING,
    website: 'https://echo.finance'
  },
  aries: {
    name: 'Aries Markets',
    logo: '/assets/protocols/aries.png',
    color: '#34d399',
    category: PROTOCOL_CATEGORIES.LENDING,
    website: 'https://aries.markets'
  },
  pancakeswap: {
    name: 'PancakeSwap',
    logo: '/assets/protocols/pancakeswap.png',
    color: '#9ca3af',
    category: PROTOCOL_CATEGORIES.DEX,
    website: 'https://pancakeswap.finance'
  },
  liquidswap: {
    name: 'Liquidswap',
    logo: '/assets/protocols/liquidswap.png',
    color: '#4b5563',
    category: PROTOCOL_CATEGORIES.DEX,
    website: 'https://liquidswap.com'
  }
};

// Transaction types
export const TRANSACTION_TYPES = {
  STAKE: 'stake',
  UNSTAKE: 'unstake',
  LEND: 'lend',
  WITHDRAW: 'withdraw',
  ADD_LIQUIDITY: 'addLiquidity',
  REMOVE_LIQUIDITY: 'removeLiquidity',
  SWAP: 'swap',
  TRANSFER: 'transfer',
  OTHER: 'other'
};

// Time periods for charts
export const TIME_PERIODS = {
  DAY: '1d',
  WEEK: '7d',
  MONTH: '30d',
  QUARTER: '90d',
  YEAR: '365d'
};

// Auto-rebalance settings
export const REBALANCE_SETTINGS = {
  MIN_THRESHOLD: 5,
  MAX_SLIPPAGE: 2,
  DEFAULT_INTERVAL: 24 * 60 * 60 * 1000 // 24 hours
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'compoundefi_auth_token',
  USER_PREFERENCES: 'compoundefi_user_preferences',
  WALLET_ADDRESS: 'compoundefi_wallet_address',
  THEME: 'compoundefi_theme',
  LAST_CONNECTION: 'compoundefi_last_connection'
};

// Animation durations
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 500,
  LONG: 1000
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Explorer URLs
export const EXPLORER_URLS = {
  MAINNET: 'https://explorer.aptoslabs.com',
  TESTNET: 'https://explorer.aptoslabs.com/testnet'
};

// Asset types
export const ASSET_TYPES = {
  NATIVE: 'native',
  STAKED: 'staked',
  LP: 'liquidity',
  TOKEN: 'token'
};