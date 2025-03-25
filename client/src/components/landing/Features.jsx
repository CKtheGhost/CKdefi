import React from 'react';
import Card from '../common/Card';

/**
 * Features section component for the landing page
 */
const Features = () => {
  // Define features
  const features = [
    {
      id: 'aggregation',
      title: 'DeFi Aggregation',
      description: 'Access all major Aptos DeFi protocols in one place. Stake, lend, farm, and provide liquidity without jumping between dApps.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'ai-analysis',
      title: 'AI Market Analysis',
      description: 'Our AI continuously analyzes market conditions, protocol performance, and on-chain data to identify the best yield opportunities.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 'personalized',
      title: 'Personalized Strategies',
      description: 'Get tailored investment strategies based on your risk profile and portfolio. Our AI adapts recommendations to your specific needs.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      ),
      color: 'green'
    },
    {
      id: 'one-click',
      title: 'One-Click Execution',
      description: 'Execute complex investment strategies with a single click. Our smart contracts handle all the transactions securely and efficiently.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'yellow'
    },
    {
      id: 'auto-rebalance',
      title: 'Auto-Rebalancer',
      description: 'Set up automatic portfolio rebalancing to maintain optimal yield across market conditions. Adjust frequency and thresholds to your preference.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: 'red'
    },
    {
      id: 'real-time',
      title: 'Real-Time Analytics',
      description: 'Track your portfolio performance, APY, and potential optimizations in real-time. Get insights into how your assets are performing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'cyan'
    }
  ];

  // Generate gradient based on color
  const getGradient = (color) => {
    const gradients = {
      blue: 'from-blue-600 to-blue-400',
      purple: 'from-purple-600 to-purple-400',
      green: 'from-green-600 to-green-400',
      yellow: 'from-yellow-600 to-yellow-400',
      red: 'from-red-600 to-red-400',
      cyan: 'from-cyan-600 to-cyan-400'
    };
    return gradients[color] || 'from-blue-600 to-blue-400';
  };

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            CompounDefi combines cutting-edge AI with DeFi protocols to create the smartest yield optimizer on Aptos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="h-full">
              <Card className="h-full border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
                <div className="flex flex-col h-full">
                  <div className={`mb-6 w-12 h-12 rounded-lg bg-gradient-to-br ${getGradient(feature.color)} flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  
                  <p className="text-gray-400 flex-grow">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;