// Tooltip.jsx
import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`absolute z-10 ${positionClasses[position]} bg-gray-800 text-white text-sm rounded-md py-1 px-2 shadow-lg whitespace-nowrap transition-opacity duration-200`}
        >
          {content}
          <div className={`absolute w-2 h-2 ${
            position === 'top' ? 'top-full left-1/2 transform -translate-x-1/2 -mt-1 rotate-45' :
            position === 'bottom' ? 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1 rotate-45' :
            position === 'left' ? 'left-full top-1/2 transform -translate-y-1/2 -ml-1 rotate-45' :
            'right-full top-1/2 transform -translate-y-1/2 -mr-1 rotate-45'
          } bg-gray-800`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;