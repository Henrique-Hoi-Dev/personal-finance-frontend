'use client';

import React from 'react';
import { SignupForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { useAuth } from '@/hooks/useAuth';
import { BaseLoading } from '@/components/atoms';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const { isHydrated } = useAuth();
  const tCommon = useTranslations('Common');

  if (!isHydrated) {
    return <BaseLoading text={tCommon('loading')} />;
  }

  return (
    <AuthLayout pageType="signup">
      <SignupForm />
    </AuthLayout>
  );
}
