'use client';

import React from 'react';
import { ForgotPasswordForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('ForgotPassword');

  return (
    <AuthLayout
      pageType="login"
      title={t('title')}
      subtitle={t('title')}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
