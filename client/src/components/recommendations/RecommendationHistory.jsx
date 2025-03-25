import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { formatDistanceToNow } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatNumber } from '../../utils/formatters';

const RecommendationHistory = ({ onSelectRecommendation }) => {
  const { recommendationHistory, loadRecommendationHistory } = useContext(DataContext);
  const [expandedItem, setExpandedItem] = useState(null);
  
  useEffect(() => {
    loadRecommendationHistory();
  }, [loadRecommendationHistory]);
  
  const handleSelect = (recommendation) => {
    if (onSelectRecommendation) {
      onSelectRecommendation(recommendation);
    }
  };
  
  // If no history, show empty state
  if (!recommendationHistory || recommendationHistory.length === 0) {
    return (
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No recommendation history</h3>
          <p className="text-gray-400 text-sm mb-4">
            Generate your first AI-powered investment strategy to see it here.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-800 border border-gray-700">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Recommendation History</h2>
        
        <div className="space-y-3">
          {recommendationHistory.map((recommendation, index) => (
            <div 
              key={index} 
              className="p-3 bg-gray-700 rounded-lg transition-all hover:bg-gray-650"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">{recommendation.title || 'Investment Strategy'}</h3>
                  <div className="text-xs text-gray-400 mt-1">
                    {recommendation.timestamp ? 
                      formatDistanceToNow(new Date(recommendation.timestamp), { addSuffix: true }) : 
                      'Recently'
                    }
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-semibold">{recommendation.totalApr || 0}% APR</span>
                  <button 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                  >
                    {expandedItem === index ? 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg> :
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    }
                  </button>
                </div>
              </div>
              
              {expandedItem === index && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-sm text-gray-300 mb-2">
                    {recommendation.summary}
                  </div>
                  
                  {recommendation.allocation && recommendation.allocation.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Allocation</h4>
                      <div className="space-y-1">
                        {recommendation.allocation.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-gray-300">{item.protocol} ({item.product})</span>
                            <span className="text-gray-300">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recommendation.executionResult && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Execution Result</h4>
                      <div className={`text-xs ${recommendation.executionResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {recommendation.executionResult.success ? 
                          `Successfully executed (${recommendation.executionResult.operationsCount || 0} operations)` : 
                          `Execution failed: ${recommendation.executionResult.error || 'Unknown error'}`
                        }
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSelect(recommendation)}
                    >
                      Use This Strategy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RecommendationHistory;