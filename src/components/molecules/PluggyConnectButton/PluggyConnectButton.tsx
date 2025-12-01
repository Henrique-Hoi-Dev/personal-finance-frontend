'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { usePluggy } from '@/hooks/usePluggy';
import { usePluggyStore } from '@/store/pluggy.store';

export function PluggyConnectButton() {
  const t = useTranslations('Pluggy');
  const { connectBank, isLoading, isSDKLoaded, error } = usePluggy();
  const { hasBankConnected } = usePluggyStore();

  // Mostra toast de erro quando houver erro (apenas uma vez)
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 5000,
      });
    }
  }, [error]);

  const handleClick = () => {
    if (!isSDKLoaded) {
      if (error) {
        toast.error(error);
      }
      return;
    }
    connectBank();
  };

  // Determina o texto do botão
  const getButtonText = () => {
    if (isLoading) {
      return t('connecting');
    }
    if (hasBankConnected) {
      return t('connectAnotherBank');
    }
    return t('connectBank');
  };

  return (
    <button
      onClick={handleClick}
      disabled={true} // Feature futura - desativado temporariamente
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
      title="Feature em desenvolvimento - em breve"
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )}
      <span className="hidden sm:inline">{getButtonText()}</span>
      <span className="sm:hidden">{getButtonText()}</span>
      {error && (
        <svg
          className="w-4 h-4 ml-1 text-red-200"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
