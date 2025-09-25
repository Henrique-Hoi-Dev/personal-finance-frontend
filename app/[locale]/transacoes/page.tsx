'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import {
  TransactionFilters,
  TransactionActions,
  TransactionTable,
} from '@/components/molecules';
import { TransactionModal } from '@/components/organisms';
import { useAuth } from '@/hooks/useAuth';
import { useTransacoesStore } from '@/store/transacoes.store';
import { useContasStore } from '@/store/contas.store';
import { Transacao } from '@/types';
import { TransactionFormData } from '@/components/molecules';

export default function TransacoesPage() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { transacoes, loading, fetchTransacoes } = useTransacoesStore();
  const { contas, fetchContas } = useContasStore();
  const router = useRouter();
  const t = useTranslations('Transacoes');

  // Filter states
  const [tipoFilter, setTipoFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState<'receita' | 'despesa'>('receita');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/pt/login');
      return;
    }

    if (isHydrated && isAuthenticated) {
      fetchTransacoes();
      fetchContas();
    }
  }, [isHydrated, isAuthenticated, fetchTransacoes, router]);

  // Filter transactions based on current filters
  const filteredTransacoes = transacoes.filter((transacao) => {
    const matchesTipo = !tipoFilter || transacao.tipo === tipoFilter;
    const matchesCategoria =
      !categoriaFilter ||
      transacao.categoria.toLowerCase().includes(categoriaFilter.toLowerCase());

    return matchesTipo && matchesCategoria;
  });

  const handleAddIncome = () => {
    setModalTipo('receita');
    setIsModalOpen(true);
  };

  const handleAddExpense = () => {
    setModalTipo('despesa');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmitTransaction = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create transaction
      console.log('Creating transaction:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh transactions list
      await fetchTransacoes();

      // Close modal
      handleCloseModal();
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Action Buttons */}
        <div className="flex justify-end">
          <TransactionActions
            onAddIncome={handleAddIncome}
            onAddExpense={handleAddExpense}
          />
        </div>

        {/* Filters */}
        <TransactionFilters
          tipo={tipoFilter}
          categoria={categoriaFilter}
          onTipoChange={setTipoFilter}
          onCategoriaChange={setCategoriaFilter}
        />

        {/* Transactions Table */}
        <TransactionTable transacoes={filteredTransacoes} loading={loading} />

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tipo={modalTipo}
          contas={contas}
          onSubmit={handleSubmitTransaction}
          loading={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
}
