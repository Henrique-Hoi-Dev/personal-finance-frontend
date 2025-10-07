'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  pageType?: 'login' | 'signup';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  pageType = 'login',
}) => {
  const t = useTranslations('App');
  const tLogin = useTranslations('Login');
  const tSignup = useTranslations('Signup');

  const getDefaultTitle = () => {
    if (title) return title;
    return pageType === 'signup' ? tSignup('title') : tLogin('title');
  };

  const getDefaultSubtitle = () => {
    if (subtitle) return subtitle;
    return pageType === 'signup' ? tSignup('title') : tLogin('title');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1
            className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'var(--font-dancing-script)' }}
          >
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            {getDefaultSubtitle()}
          </p>
        </div>

        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
