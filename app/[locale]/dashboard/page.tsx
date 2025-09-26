'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import { Dashboard } from '@/components/organisms';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
