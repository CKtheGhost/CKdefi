// constants.js - Application constants for CompounDefi

// Application information
export const APP_INFO = {
  NAME: 'CompounDefi',
  VERSION: '2.0.0',
  TAG_LINE: 'AI-powered DeFi Aggregator for Aptos',
  WEBSITE: 'https://compoundefi.io',
  SUPPORT_EMAIL: 'support@compoundefi.io',
  GITHUB_REPO: 'https://github.com/ckthghost/defi-headquarters'
};

// Contract addresses for various Aptos protocols
export const CONTRACT_ADDRESSES = {
  // Liquid Staking Protocols
  AMNIS: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  THALA: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  TORTUGA: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  DITTO: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  
  // Lending/Borrowing Protocols
  ARIES: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  ECHELON: "0xf8197c9fa1a397568a47b7a6c5a9b09fa97c8f29f9dcc347232c22e3b24b1f09",
  ECHO: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
  JOULE: "0x1ef1320ef4b26367611d6ffa8abd34b04bd479abfa12590af1eac71fdd8731b3",
  ABEL: "0x7e783b399436bb5c7e520cefd40d797720cbd117af918fee6f5f2ca50c3a284e",
  
  // DEXes and AMMs
  PANCAKESWAP: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
  LIQUIDSWAP: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
  CETUS: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6",
  SUSHI: "0x52cd2babe81b8aa7e5b4958c6bb294b1aaaeec23f711fb71e9aad5bf3f67eab9",
  AUX: "0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541",
  
  // Yield Optimizers
  MERKLE: "0xc0188ad3f42e66b5bd3596e642b8f72749b67d84dafa8348e34014b64175ed5a",
  FETCH: "0x5ae6789dd2fec1a9ec9cccf1a4fecd46af7c5645cdefee965ac7263035724c77",
  
  // Stablecoin and Minting Protocols
  THALA_STABLECOIN: "0x7fd500c11216f0fe3095e6c5d88a696c3e585a77d28c37def5b0afc380c3293f",
  MOMENTO: "0xecf044bc5344e3d40e10fca8250a5e927f5a7a8f4abe3a52adf8f215eb9cff9a",
  
  // Other DeFi
  PONTEM: "0x8b7311d78d47e37d09435b8dc37c14afd977c5cbc3c4b6506e6e9d0e2d1c7bdb",
  APT_FARM: "0xc84e28b9ed4ca8f7faa28a74b958a8cb7c5d6c1a78edb2d8d74562f7fa7ef8fe"
};

// Protocol categories and names
export const PROTOCOLS = {
  LIQUID_STAKING: ['amnis', 'thala', 'tortuga', 'ditto'],
  LENDING: ['aries', 'echelon', 'echo', 'joule', 'abel'],
  DEX: ['pancakeswap', 'liquidswap', 'cetus', 'sushi', 'aux'],
  YIELD: ['merkle', 'fetch'],
  STABLECOINS: ['thala_stablecoin', 'momento'],
  OTHER: ['pontem', 'apt_farm']
};

// All protocol names flattened
export const ALL_PROTOCOLS = [
  ...PROTOCOLS.LIQUID_STAKING,
  ...PROTOCOLS.LENDING,
  ...PROTOCOLS.DEX,
  ...PROTOCOLS.YIELD,
  ...PROTOCOLS.STABLECOINS,
  ...PROTOCOLS.OTHER
];

// Protocol display names (used for UI)
export const PROTOCOL_DISPLAY_NAMES = {
  amnis: 'Amnis Finance',
  thala: 'Thala Labs',
  tortuga: 'Tortuga Finance',
  ditto: 'Ditto Finance',
  aries: 'Aries Markets',
  echelon: 'Echelon DeFi',
  echo: 'Echo Finance',
  joule: 'Joule Protocol',
  abel: 'Abel Finance',
  pancakeswap: 'PancakeSwap',
  liquidswap: 'Liquid Swap',
  cetus: 'Cetus Protocol',
  sushi: 'SushiSwap',
  aux: 'AUX Exchange',
  merkle: 'Merkle Finance',
  fetch: 'Fetch Optimizer',
  thala_stablecoin: 'Thala MOD',
  momento: 'Momento USD',
  pontem: 'Pontem Network',
  apt_farm: 'APT Farm'
};

// Protocol logos (placeholder URL pattern)
export const PROTOCOL_LOGOS = {
  amnis: '/assets/images/protocols/amnis.png',
  thala: '/assets/images/protocols/thala.png',
  tortuga: '/assets/images/protocols/tortuga.png',
  ditto: '/assets/images/protocols/ditto.png',
  aries: '/assets/images/protocols/aries.png',
  echelon: '/assets/images/protocols/echelon.png',
  echo: '/assets/images/protocols/echo.png',
  joule: '/assets/images/protocols/joule.png',
  abel: '/assets/images/protocols/abel.png',
  pancakeswap: '/assets/images/protocols/pancakeswap.png',
  liquidswap: '/assets/images/protocols/liquidswap.png',
  cetus: '/assets/images/protocols/cetus.png',
  sushi: '/assets/images/protocols/sushi.png',
  aux: '/assets/images/protocols/aux.png',
  merkle: '/assets/images/protocols/merkle.png',
  fetch: '/assets/images/protocols/fetch.png',
  thala_stablecoin: '/assets/images/protocols/thala_mod.png',
  momento: '/assets/images/protocols/momento.png',
  pontem: '/assets/images/protocols/pontem.png',
  apt_farm: '/assets/images/protocols/apt_farm.png'
};

// Risk profiles
export const RISK_PROFILES = {
  CONSERVATIVE: 'conservative',
  BALANCED: 'balanced',
  AGGRESSIVE: 'aggressive',
  YIELD_OPTIMIZER: 'yield_optimizer',
  STABLECOIN_YIELD: 'stablecoin_yield'
};

// Risk profile display names
export const RISK_PROFILE_DISPLAY_NAMES = {
  conservative: 'Conservative',
  balanced: 'Balanced',
  aggressive: 'Aggressive',
  yield_optimizer: 'Yield Optimizer',
  stablecoin_yield: 'Stablecoin Yield'
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
  DEPOSIT: 'deposit',
  BORROW: 'borrow',
  REPAY: 'repay',
  MINT: 'mint',
  BURN: 'burn',
  TRANSFER: 'transfer'
};

// Transaction status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

// API endpoints
export const API_ENDPOINTS = {
  MARKET_DATA: '/api/market/data',
  PORTFOLIO: '/api/wallet/{address}',
  AI_RECOMMENDATION: '/api/recommendations/ai',
  AUTO_REBALANCE: '/api/auto-rebalance',
  STAKING_DATA: '/api/staking/latest',
  NEWS: '/api/news/latest',
  TOKEN_DATA: '/api/tokens/latest',
  USER_PREFERENCES: '/api/user/preferences',
  PROTOCOL_COMPARISON: '/api/protocols/comparison',
  STATUS: '/api/status'
};

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
  MARKET_DATA: 5 * 60 * 1000, // 5 minutes
  PORTFOLIO: 2 * 60 * 1000, // 2 minutes
  TOKEN_DATA: 3 * 60 * 1000, // 3 minutes
  STAKING_DATA: 10 * 60 * 1000, // 10 minutes
  NEWS: 15 * 60 * 1000 // 15 minutes
};

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6', // blue-500
  SECONDARY: '#10b981', // green-500
  TERTIARY: '#8b5cf6', // purple-500
  QUATERNARY: '#f59e0b', // amber-500
  ACCENT: '#ef4444', // red-500
  ACCENT_SECONDARY: '#ec4899', // pink-500
  NEUTRAL: '#6b7280', // gray-500
  SUCCESS: '#22c55e', // green-500
  WARNING: '#eab308', // yellow-500
  ERROR: '#ef4444', // red-500
  INFO: '#0ea5e9' // sky-500
};