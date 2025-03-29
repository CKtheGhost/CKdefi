import React, { useState } from 'react';
import { FiCheckCircle, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const ExecutionFlow = ({ steps, currentStep, results }) => {
  const getStepStatus = (index) => {
    if (currentStep > index) {
      // Step is complete
      const stepResult = results && results[index];
      return stepResult?.success === false ? 'error' : 'complete';
    } else if (currentStep === index) {
      // Current step
      return 'current';
    } else {
      // Future step
      return 'upcoming';
    }
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'complete':
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <FiAlertTriangle className="w-6 h-6 text-red-500" />;
      case 'current':
        return (
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white">
            {currentStep + 1}
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700">
            {steps.indexOf(status) + 1}
          </div>
        );
    }
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  status === 'complete' ? 'bg-green-100 dark:bg-green-900/20' : 
                  status === 'error' ? 'bg-red-100 dark:bg-red-900/20' : 
                  status === 'current' ? 'bg-blue-100 dark:bg-blue-900/20' : 
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {getStepIcon(status)}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  status === 'complete' ? 'text-green-600 dark:text-green-400' : 
                  status === 'error' ? 'text-red-600 dark:text-red-400' : 
                  status === 'current' ? 'text-blue-600 dark:text-blue-400' : 
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700">
                  {status === 'complete' && (
                    <div className="h-full bg-green-500" style={{width: '100%'}}></div>
                  )}
                  {status === 'error' && (
                    <div className="h-full bg-red-500" style={{width: '100%'}}></div>
                  )}
                  {status === 'current' && (
                    <div className="h-full bg-blue-500" style={{width: '50%'}}></div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {results && results[currentStep]?.message && (
        <div className={`mt-4 p-3 rounded-md ${
          results[currentStep].success ? 
          'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-300' : 
          'bg-red-50 text-red-800 dark:bg-red-900/10 dark:text-red-300'
        }`}>
          {results[currentStep].message}
        </div>
      )}
    </div>
  );
};

export default ExecutionFlow;