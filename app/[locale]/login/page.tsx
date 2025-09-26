'use client';

import React from 'react';
import { LoginForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';

export default function LoginPage() {
  return (
    <AuthLayout pageType="login">
      <LoginForm />
    </AuthLayout>
  );
}
