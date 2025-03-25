import React from 'react';

/**
 * LoadingScreen component for displaying a full-screen loading animation
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.transparent - Whether the background should be transparent
 */
const LoadingScreen = ({ 
  message = 'Loading...', 
  transparent = false,
  showLogo = true
}) => {
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${transparent ? 'bg-black bg-opacity-50' : 'bg-gray-900'}`}>
      <div className="text-center">
        {showLogo && (
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 relative">
              {/* CompounDefi Logo Animation */}
              <div className="matrix-loader">
                <div className="matrix-dots">
                  {[...Array(25)].map((_, i) => (
                    <div 
                      key={i} 
                      className="matrix-dot"
                      style={{
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: `rgba(0, ${128 + Math.floor(Math.random() * 128)}, ${128 + Math.floor(Math.random() * 128)}, ${0.5 + Math.random() * 0.5})`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-bold text-blue-400 mb-2">CompounDefi</h2>
        
        <p className="text-gray-400">{message}</p>
        
        <div className="mt-4">
          <div className="loader-dots flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;