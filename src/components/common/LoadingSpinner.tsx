import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.primary;
  const selectedSize = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${selectedColor} ${selectedSize}`}></div>
    </div>
  );
};

export default LoadingSpinner;
