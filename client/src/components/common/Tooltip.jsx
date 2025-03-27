import React, { useState } from 'react';

export const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg -top-10 left-1/2 transform -translate-x-1/2 w-max max-w-xs">
          {content}
        </div>
      )}
    </div>
  );
};