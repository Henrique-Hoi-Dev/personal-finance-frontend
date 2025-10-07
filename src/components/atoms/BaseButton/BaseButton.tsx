import React from 'react';
import { BaseLoading } from '../BaseLoading';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const BaseButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = true,
}) => {
  const baseClasses =
    'flex justify-center items-center border border-transparent rounded-md shadow-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis';

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs sm:text-sm',
    md: 'py-3 px-4 text-sm sm:text-base h-12',
    lg: 'py-4 sm:py-5 px-4 sm:px-6 text-sm sm:text-lg h-12',
  };

  const variantClasses = {
    primary:
      'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'text-gray-700 border bg-white hover:bg-gray-50 focus:ring-gray-500 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed',
    danger:
      'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
    success:
      'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
    >
      {loading ? <BaseLoading size="sm" color="white" /> : children}
    </button>
  );
};
