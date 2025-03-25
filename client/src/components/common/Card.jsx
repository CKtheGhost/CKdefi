import React from 'react';

/**
 * Card component for displaying content in a contained box
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {boolean} props.bordered - Whether to show a border
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {React.ReactNode} props.headerRight - Content to display on the right side of the header
 */
const Card = ({
  title,
  bordered = true,
  className = '',
  children,
  footer,
  headerRight,
  ...rest
}) => {
  return (
    <div 
      className={`
        bg-gray-800 rounded-lg shadow-lg overflow-hidden
        ${bordered ? 'border border-gray-700' : ''}
        ${className}
      `}
      {...rest}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-3 bg-gray-750 border-t border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * Card.Header component for custom header designs
 */
Card.Header = ({ className = '', children, ...rest }) => (
  <div className={`px-6 py-4 border-b border-gray-700 ${className}`} {...rest}>
    {children}
  </div>
);

/**
 * Card.Body component for custom body styling
 */
Card.Body = ({ className = '', children, ...rest }) => (
  <div className={`p-6 ${className}`} {...rest}>
    {children}
  </div>
);

/**
 * Card.Footer component for custom footer designs
 */
Card.Footer = ({ className = '', children, ...rest }) => (
  <div className={`px-6 py-3 bg-gray-750 border-t border-gray-700 ${className}`} {...rest}>
    {children}
  </div>
);

export default Card;