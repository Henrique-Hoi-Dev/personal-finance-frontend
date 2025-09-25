'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const t = useTranslations('App');
  const tLogin = useTranslations('Login');
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'var(--font-dancing-script)' }}
          >
            {title || t('title')}
          </h1>
          <p className="text-lg text-gray-600">{subtitle || tLogin('title')}</p>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
