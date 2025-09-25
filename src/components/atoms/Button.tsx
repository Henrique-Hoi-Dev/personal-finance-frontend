import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseClasses =
    'w-full flex justify-center py-5 px-6 border border-transparent rounded-md shadow-sm text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

  const variantClasses = {
    primary:
      'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={variant === 'primary' ? { backgroundColor: '#2563eb' } : undefined}
    >
      {children}
    </button>
  );
};
