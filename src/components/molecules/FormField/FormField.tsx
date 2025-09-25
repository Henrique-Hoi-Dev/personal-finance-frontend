import React from 'react';
import { BaseLabel, BaseInput } from '@/components/atoms';
import { useTranslations } from 'next-intl';

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  id,
  name,
  required = false,
  autoComplete,
}) => {
  const t = useTranslations('Common');
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');
  const fieldName = name || label.toLowerCase().replace(/\s+/g, '_');

  return (
    <div>
      <BaseLabel
        htmlFor={fieldId}
        className="block text-base font-semibold text-gray-700 mb-2"
      >
        {label} {t('required')}
      </BaseLabel>
      <div>
        <BaseInput
          id={fieldId}
          name={fieldName}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        />
      </div>
    </div>
  );
};
