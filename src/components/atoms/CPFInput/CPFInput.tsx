import React from 'react';
import { BaseInput } from '../BaseInput/BaseInput';

interface CPFInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

export const CPFInput: React.FC<CPFInputProps> = ({
  value,
  onChange,
  placeholder = '000.000.000-00',
  id,
  name,
  required = false,
  className = '',
  error,
}) => {
  return (
    <BaseInput
      id={id}
      name={name}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="off"
      dataFormType="other"
      dataLpignore={true}
      className={className}
      error={error}
    />
  );
};
