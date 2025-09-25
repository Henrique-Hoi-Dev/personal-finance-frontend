'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { useAuth } from '@/hooks/useAuth';

export default function SignupPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push('/pt/dashboard');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout pageType="signup">
      <SignupForm />
    </AuthLayout>
  );
}
