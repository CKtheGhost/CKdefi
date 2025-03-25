import React from 'react';

/**
 * Button component with different variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, success, danger, warning, etc.)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  isLoading = false, 
  className = '', 
  children, 
  onClick,
  type = 'button',
  ...rest
}) => {
  // Base styles
  const baseStyles = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  // Variant styles
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-400",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
    info: "bg-cyan-500 hover:bg-cyan-600 text-white focus:ring-cyan-400",
    light: "bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 focus:ring-gray-300",
    dark: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700",
    link: "bg-transparent text-blue-600 hover:text-blue-800 hover:underline p-0 focus:ring-blue-400",
    // 'Ghost' style for subtle buttons
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400",
  };
  
  // Disabled styles
  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
  
  // Computed class string
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size] || sizeStyles.md}
    ${variantStyles[variant] || variantStyles.primary}
    ${disabled || isLoading ? disabledStyles : ''}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;