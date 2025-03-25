// src/components/wallet/WalletHeader.jsx

import React from 'react';
import { formatNumber } from '../../utils/formatters';

const WalletHeader = ({ portfolioData, isLoading, onRefresh }) => {
 const totalValue = portfolioData?.totalValueUSD || 0;
 const aptPrice = portfolioData?.apt?.price || 0;
 const riskProfile = portfolioData?.riskProfile || 'balanced';
 const dailyChange = portfolioData?.performance?.dailyChange || '0.00';
 const address = portfolioData?.wallet || '';
 
 return (
   <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
     <div className="flex justify-between items-center mb-4">
       <div className="flex items-center">
         <img 
           src="/assets/images/aptos-logo.svg" 
           alt="Aptos Logo" 
           className="w-10 h-10 mr-3"
         />
         <div>
           <h2 className="text-xl font-bold text-white">Wallet Analysis</h2>
           <p className="text-sm text-gray-400 truncate md:w-64">
             {address ? `${address.substring(0, 8)}...${address.substring(address.length - 8)}` : 'No wallet connected'}
           </p>
         </div>
       </div>
       <button
         onClick={onRefresh}
         className="p-2 rounded-full hover:bg-gray-700 transition-colors"
         disabled={isLoading}
       >
         <svg 
           className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} 
           fill="none" 
           stroke="currentColor" 
           viewBox="0 0 24 24"
         >
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
         </svg>
       </button>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
       <div className="bg-gray-700 rounded-lg p-4">
         <p className="text-sm text-gray-400">Total Value</p>
         <p className="text-2xl font-bold text-white">${formatNumber(totalValue)}</p>
         <p className="text-sm text-gray-400">
           <span className={`inline-block mr-1 ${parseFloat(dailyChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
             {parseFloat(dailyChange) >= 0 ? '+' : ''}{dailyChange}%
           </span>
           today
         </p>
       </div>
       
       <div className="bg-gray-700 rounded-lg p-4">
         <p className="text-sm text-gray-400">APT Price</p>
         <p className="text-2xl font-bold text-white">${aptPrice.toFixed(2)}</p>
         <p className="text-sm text-gray-400">Native token price</p>
       </div>
       
       <div className="bg-gray-700 rounded-lg p-4">
         <p className="text-sm text-gray-400">Risk Profile</p>
         <p className="text-2xl font-bold text-white capitalize">{riskProfile}</p>
         <p className="text-sm text-gray-400">Based on portfolio composition</p>
       </div>
     </div>
   </div>
 );
};

export default WalletHeader;