import React, { useState } from 'react';
import { BaseLabel } from '@/components/atoms';
import { useTranslations } from 'next-intl';

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  id,
  name,
  required = false,
  autoComplete,
}) => {
  const t = useTranslations('Login');
  const [showPassword, setShowPassword] = useState(false);

  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');
  const fieldName = name || label.toLowerCase().replace(/\s+/g, '_');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <BaseLabel
        htmlFor={fieldId}
        className="block text-base font-semibold text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </BaseLabel>
      <div className="relative">
        <input
          id={fieldId}
          name={fieldName}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
          title={showPassword ? t('hidePassword') : t('showPassword')}
        >
          {showPassword ? (
            // Ícone de olho fechado (senha visível) - versão simples
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                clipRule="evenodd"
              />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          ) : (
            // Ícone de olho aberto (senha oculta) - versão simples
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
