import React from 'react';
import Notifications from '../common/Notifications';

const OnboardingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-900 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-400">CompounDefi</div>
            <div className="text-sm text-gray-400">Onboarding Process</div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-8">
        {children}
      </main>
      
      <footer className="py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CompounDefi. All rights reserved.
          </p>
        </div>
      </footer>
      
      <Notifications />
    </div>
  );
};

export default OnboardingLayout;