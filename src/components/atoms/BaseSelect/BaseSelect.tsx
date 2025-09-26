import React from 'react';
import { BaseLabel } from '../BaseLabel/BaseLabel';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface BaseSelectProps {
  id?: string;
  name?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BaseSelect: React.FC<BaseSelectProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base',
  };

  const baseClasses = `
    w-full border rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${
      error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300'
    }
    ${disabled ? 'bg-gray-50' : 'bg-white'}
    ${className}
  `.trim();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-1">
      {label && (
        <BaseLabel htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </BaseLabel>
      )}

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`${baseClasses} appearance-none pr-10`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
