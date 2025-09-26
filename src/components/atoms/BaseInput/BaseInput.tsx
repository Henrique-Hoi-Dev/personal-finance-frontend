import React from 'react';

interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'date';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  error?: string;
  step?: string;
  min?: string;
  max?: string;
  dataFormType?: string;
  dataLpignore?: boolean;
}

export const BaseInput: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  id,
  name,
  required = false,
  autoComplete,
  className = '',
  error,
  step,
  min,
  max,
  dataFormType,
  dataLpignore = false,
}) => {
  return (
    <div>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        step={step}
        min={min}
        max={max}
        data-form-type={dataFormType}
        data-lpignore={dataLpignore}
        className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
