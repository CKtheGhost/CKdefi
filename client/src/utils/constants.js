// src/utils/constants.js
// Application-wide constants

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Core endpoints
  PORTFOLIO: '/api/wallet/{address}',
  MARKET_DATA: '/api/market/data',
  STAKING_DATA: '/api/staking/rates',
  AI_RECOMMENDATION: '/api/recommendations/ai',
  NEWS: '/api/news/latest',
  STATUS: '/api/status',
  
  // Protocol endpoints
  PROTOCOL_STATS: '/api/protocols/stats',
  PROTOCOL_DETAILS: '/api/protocols/{protocol}',
  
  // Auto-optimizer endpoints
  AUTO_REBALANCE: '/api/auto-rebalance',
  
  // User endpoints
  USER_PROFILE: '/api/user/profile',
  USER_PREFERENCES: '/api/user/preferences'
};

/**
 * Cache durations (in milliseconds)
 */
export const CACHE_DURATIONS = {
  MARKET_DATA: 5 * 60 * 1000,    // 5 minutes
  PORTFOLIO: 2 * 60 * 1000,      // 2 minutes
  STAKING_DATA: 10 * 60 * 1000,  // 10 minutes
  NEWS: 15 * 60 * 1000,          // 15 minutes
  PROTOCOLS: 30 * 60 * 1000      // 30 minutes
};

/**
 * Risk profiles for investment strategies
 */
export const RISK_PROFILES = {
  CONSERVATIVE: 'conservative',
  BALANCED: 'balanced',
  AGGRESSIVE: 'aggressive',
  YIELD_OPTIMIZER: 'yield_optimizer',
  STABLECOIN_YIELD: 'stablecoin_yield'
};

/**
 * Contract addresses for Aptos DeFi protocols
 */
export const CONTRACT_ADDRESSES = {
  AMNIS: '0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a',
  THALA: '0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6',
  TORTUGA: '0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53',
  DITTO: '0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5',
  ARIES: '0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3',
  ECHO: '0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed',
  PANCAKESWAP: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
  LIQUIDSWAP: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12',
  CETUS: '0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6'
};

/**
 * Function mappings for protocol operations
 */
export const FUNCTION_MAPPINGS = {
  amnis: { 
    stake: '::staking::stake', 
    unstake: '::staking::unstake', 
    lend: '::lending::supply', 
    withdraw: '::lending::withdraw', 
    addLiquidity: '::router::add_liquidity', 
    removeLiquidity: '::router::remove_liquidity' 
  },
  thala: { 
    stake: '::staking::stake_apt', 
    unstake: '::staking::unstake_apt', 
    lend: '::lending::supply_apt', 
    withdraw: '::lending::withdraw_apt', 
    addLiquidity: '::router::add_liquidity', 
    removeLiquidity: '::router::remove_liquidity' 
  },
  tortuga: { 
    stake: '::staking::stake_apt', 
    unstake: '::staking::unstake_apt' 
  },
  echo: { 
    lend: '::lending::supply', 
    withdraw: '::lending::withdraw' 
  },
  ditto: { 
    stake: '::staking::stake', 
    unstake: '::staking::unstake' 
  },
  aries: { 
    lend: '::lending::supply', 
    withdraw: '::lending::withdraw' 
  },
  cetus: { 
    addLiquidity: '::pool::add_liquidity', 
    removeLiquidity: '::pool::remove_liquidity' 
  },
  pancakeswap: { 
    addLiquidity: '::router::add_liquidity', 
    removeLiquidity: '::router::remove_liquidity', 
    swap: '::router::swap_exact_input' 
  },
  liquidswap: { 
    addLiquidity: '::router::add_liquidity', 
    removeLiquidity: '::router::remove_liquidity' 
  }
};

/**
 * Default auto-optimizer settings
 */
export const DEFAULT_OPTIMIZER_SETTINGS = {
  enabled: false,
  interval: 24, // hours
  rebalanceThreshold: 5, // percent
  maxSlippage: 1, // percent
  preserveStakedPositions: true,
  maxOperationsPerRebalance: 6
};

/**
 * User preferences defaults
 */
export const DEFAULT_USER_PREFERENCES = {
  riskProfile: RISK_PROFILES.BALANCED,
  theme: 'dark',
  autoOptimize: false,
  notificationsEnabled: true,
  newsFrequency: 'daily',
  dashboardLayout: 'default'
};