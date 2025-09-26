'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import { ContaCard, ContaDetails, ContaModal } from '@/components/molecules';
import { useContasStore } from '@/store/contas.store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Conta } from '@/types';

export default function ContasPage() {
  const { contas, loading, fetchContas, addConta, removeConta } =
    useContasStore();
  const t = useTranslations('Contas');
  const [selectedConta, setSelectedConta] = useState<Conta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [localContas, setLocalContas] = useState<Conta[]>([]);

  const updateSelectedConta = (updatedConta: Conta) => {
    setSelectedConta(updatedConta);

    setLocalContas((prevContas) =>
      prevContas.map((conta) =>
        conta.id === updatedConta.id ? updatedConta : conta
      )
    );
  };

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  useEffect(() => {
    if (contas.length > 0) {
      setLocalContas(contas);
    }
  }, [contas]);

  const handleCreateConta = async (data: any) => {
    setIsCreating(true);
    try {
      await addConta(data);
      setIsModalOpen(false);
      await fetchContas();
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteConta = async () => {
    if (!selectedConta) return;

    try {
      await removeConta(selectedConta.id);

      await fetchContas();

      setSelectedConta(null);
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="h-full bg-gray-50">
          <div className="flex justify-between">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-sm">{t('description')}</p>
            </div>
            <div className="p-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t('addAccount')}
              </button>
            </div>
          </div>
          <div className="flex h-full">
            {/* Painel Esquerdo - Lista de Contas */}
            <div className="w-1/2 flex flex-col">
              <div className="mt-4">
                <h2 className="pl-6 text-lg font-semibold text-gray-900">
                  {t('yourAccounts')}
                </h2>
              </div>
              {/* Lista de Contas */}
              <div className="flex-1 w-full p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">{t('loading')}</span>
                  </div>
                ) : localContas.length > 0 ? (
                  localContas.map((conta) => (
                    <ContaCard
                      key={conta.id}
                      conta={conta}
                      isSelected={selectedConta?.id === conta.id}
                      onClick={() => setSelectedConta(conta)}
                      onDelete={handleDeleteConta}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                      {t('noAccounts')}
                    </div>
                    <p className="text-gray-400">
                      {t('noAccountsDescription')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Painel Direito - Detalhes da Conta */}
            <div className="w-1/2 flex flex-col">
              <div className="mt-4">
                <h2 className="pl-6 text-lg font-semibold text-gray-900">
                  {t('accountDetails') + ' ' + (selectedConta?.name ?? '')}
                </h2>
              </div>
              <div className="flex-1 p-6">
                <ContaDetails
                  conta={selectedConta}
                  onClose={() => setSelectedConta(null)}
                  onUpdateConta={updateSelectedConta}
                />
              </div>
            </div>
          </div>

          <ContaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateConta}
            loading={isCreating}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
