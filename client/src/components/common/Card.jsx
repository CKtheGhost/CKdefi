// src/components/common/Card.jsx
import React from 'react';

const Card = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = '', children, ...rest }) => (
  <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`} {...rest}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...rest }) => (
  <h3 className={`text-xl font-semibold text-gray-800 dark:text-white ${className}`} {...rest}>
    {children}
  </h3>
);

const CardDescription = ({ className = '', children, ...rest }) => (
  <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${className}`} {...rest}>
    {children}
  </p>
);

const CardContent = ({ className = '', children, ...rest }) => (
  <div className={`p-6 ${className}`} {...rest}>
    {children}
  </div>
);

export { CardHeader, CardTitle, CardDescription, CardContent };
export default Card;