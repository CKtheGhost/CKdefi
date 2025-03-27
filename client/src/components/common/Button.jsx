import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  ...props 
}) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-md transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;