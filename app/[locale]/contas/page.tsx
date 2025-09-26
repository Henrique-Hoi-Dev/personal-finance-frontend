'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import { ContaCard, ContaDetails } from '@/components/molecules';
import { useContasStore } from '@/store/contas.store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Conta } from '@/types';

export default function ContasPage() {
  const { contas, loading, fetchContas } = useContasStore();
  const t = useTranslations('Contas');
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600">{t('loading')}</span>
            </div>
          ) : contas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                {t('noAccounts')}
              </div>
              <p className="text-gray-400">{t('noAccountsDescription')}</p>
            </div>
          )}

          {selectedConta && (
            <ContaDetails
              conta={selectedConta}
              onClose={() => setSelectedConta(null)}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
