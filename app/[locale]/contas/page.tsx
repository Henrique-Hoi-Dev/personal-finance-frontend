'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import { ContaCard, ContaDetails } from '@/components/molecules';
import { useAuth } from '@/hooks/useAuth';
import { useContasStore } from '@/store/contas.store';
import { Conta } from '@/types';

export default function ContasPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { contas, loading, fetchContas } = useContasStore();
  const router = useRouter();
  const t = useTranslations('Contas');
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/pt/login');
      return;
    }

    if (isHydrated && isAuthenticated) {
      fetchContas();
    }
  }, [isHydrated, isAuthenticated, fetchContas, router]);

  if (!isHydrated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2 text-gray-600">{t('loading')}</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2 text-gray-600">{t('redirecting')}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-gray-600">{t('loadingAccounts')}</span>
          </div>
        )}

        {/* Two Column Layout */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Account List */}
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('yourAccounts')}
                </h2>
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  {t('addAccount')}
                </button>
              </div>

              {/* Accounts List */}
              {contas.length > 0 ? (
                <div className="space-y-3">
                  {contas.map((conta) => (
                    <ContaCard
                      key={conta.id}
                      conta={conta}
                      isSelected={selectedConta?.id === conta.id}
                      onClick={() => setSelectedConta(conta)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {t('noAccountsFound')}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('noAccountsMessage')}
                  </p>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    {t('addAccount')}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Account Details */}
            <div className="lg:col-span-2">
              <ContaDetails conta={selectedConta} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
