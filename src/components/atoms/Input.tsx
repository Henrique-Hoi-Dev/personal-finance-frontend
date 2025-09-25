import React from 'react';

interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  id,
  name,
  required = false,
  autoComplete,
  className = '',
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
    />
  );
};
