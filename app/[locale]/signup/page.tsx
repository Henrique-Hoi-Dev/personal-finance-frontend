'use client';

import React from 'react';
import { SignupForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { useAuth } from '@/hooks/useAuth';
import { BaseLoading } from '@/components/atoms';

export default function SignupPage() {
  const { isHydrated } = useAuth();

  if (!isHydrated) {
    return <BaseLoading text="Carregando..." />;
  }

  return (
    <AuthLayout pageType="signup">
      <SignupForm />
    </AuthLayout>
  );
}
