// src/components/landing/ConnectSection.jsx
import React from 'react';
import Button from '../common/Button';

const ConnectSection = ({ onConnect }) => {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to optimize your DeFi yields?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
          Connect your wallet to access AI-powered yield optimization, personalized recommendations, and auto-rebalancing features.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onConnect}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg shadow-lg"
          >
            Connect Wallet
          </Button>
          <Button
            href="#features"
            className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg rounded-lg"
          >
            Learn More
          </Button>
        </div>
        <div className="mt-10 text-blue-200">
          <p>Supported wallets: Petra, Martian, Pontem, Rise</p>
        </div>
      </div>
    </section>
  );
};

export default ConnectSection;