import React from 'react';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 bg-opacity-90 dark:bg-opacity-90 z-50">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin animation-delay-500"></div>
        </div>
        
        <div className="mt-6 text-center">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">
            {message}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This may take a moment as we analyze market conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;