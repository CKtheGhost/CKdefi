import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import WalletConnect from '../common/WalletConnect';

/**
 * Hero component for the landing page
 */
const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500/10 rounded-full blur-3xl transform translate-y-1/3 -translate-x-1/4"></div>
      </div>
      
      {/* Matrix-like animation in background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div id="matrix-animation" className="w-full h-full"></div>
      </div>
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Maximize Your Yield
              </span> with AI-Powered DeFi
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              CompounDefi aggregates all major Aptos DeFi protocols and uses AI to optimize your portfolio for maximum returns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <WalletConnect 
                size="lg" 
                className="w-full sm:w-auto"
              />
              
              <Button 
                variant="ghost"
                size="lg"
                className="border border-blue-500/50"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
            
            <div className="mt-8 flex items-center">
              <p className="text-gray-400 text-sm mr-4">Supported protocols:</p>
              <div className="flex -space-x-2">
                <img src="/protocols/amnis.png" alt="Amnis" className="w-8 h-8 rounded-full bg-gray-800 p-1" />
                <img src="/protocols/thala.png" alt="Thala" className="w-8 h-8 rounded-full bg-gray-800 p-1" />
                <img src="/protocols/tortuga.png" alt="Tortuga" className="w-8 h-8 rounded-full bg-gray-800 p-1" />
                <img src="/protocols/aries.png" alt="Aries" className="w-8 h-8 rounded-full bg-gray-800 p-1" />
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">+12</div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              {/* Dashboard preview */}
              <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <img 
                  src="/images/dashboard-preview.png" 
                  alt="CompounDefi Dashboard" 
                  className="w-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    // Fallback to a gradient placeholder
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                        <div class="text-white text-xl font-bold">CompounDefi Dashboard</div>
                      </div>
                    `;
                  }}
                />
              </div>
              
              {/* Stats overlay */}
              <div className="absolute -bottom-6 -left-6 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-gray-700 max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <h3 className="font-medium">Performance Stats</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-400">Current APY</p>
                    <p className="text-green-400 font-bold">8.75%</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Optimized APY</p>
                    <p className="text-green-400 font-bold">12.42%</p>
                  </div>
                </div>
              </div>
              
              {/* AI badge */}
              <div className="absolute -top-4 -right-4 bg-blue-900/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl border border-blue-700">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-bold text-blue-400">AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;