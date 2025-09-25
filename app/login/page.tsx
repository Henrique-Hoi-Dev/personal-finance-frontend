'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
