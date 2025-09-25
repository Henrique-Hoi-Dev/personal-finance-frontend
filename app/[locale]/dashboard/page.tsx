'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import { Dashboard } from '@/components/organisms';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const t = useTranslations('Dashboard');

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/pt/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('redirecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
