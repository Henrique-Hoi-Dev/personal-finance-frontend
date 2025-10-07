'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/templates';
import {
  TransactionFilters,
  TransactionActions,
  TransactionTable,
} from '@/components/molecules';
import { TransactionModal } from '@/components/organisms';
import { useTransacoesStore } from '@/store/transacoes.store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Transacao } from '@/types';
import { TransactionFormData } from '@/components/molecules';

export default function TransacoesPage() {
  const {
    transacoes,
    loading,
    fetchTransacoes,
    pagination,
    addTransacao,
    removeTransacao,
  } = useTransacoesStore();
  const t = useTranslations('Transacoes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(
    null
  );
  const [filters, setFilters] = useState<{
    accountId: string;
    category: string;
    type: 'INCOME' | 'EXPENSE' | '';
    startDate: string;
    endDate: string;
  }>({
    accountId: '',
    category: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  // Sempre que filtros mudarem, resetar para página 1 (0-based -> 0)
  useEffect(() => {
    fetchTransacoes({
      ...filters,
      type: filters.type || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      page: 0,
      limit: pagination.itemsPerPage,
    });
  }, [fetchTransacoes, filters, pagination.itemsPerPage]);

  const handleCreateTransacao = () => {
    setEditingTransacao(null);
    setIsModalOpen(true);
  };

  const handleEditTransacao = (transacao: Transacao) => {
    setEditingTransacao(transacao);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransacao(null);
  };

  const handleSubmitTransacao = async (data: TransactionFormData) => {
    try {
      if (editingTransacao) {
        // TODO: Implementar updateTransacao quando necessário
        console.log('Editar transação:', editingTransacao.id, data);
      } else {
        const payload: any = {
          description: data.description,
          value: data.value,
          category: data.category,
          date: data.date,
        };

        await addTransacao(payload, data.type);
      }
      await fetchTransacoes({
        ...filters,
        type: filters.type || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleDeleteTransacao = async (id: string) => {
    try {
      await removeTransacao(id);
      await fetchTransacoes({
        ...filters,
        type: filters.type || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTransacoes({
      ...filters,
      type: filters.type || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      page: page,
      limit: pagination.itemsPerPage,
    });
  };

  const filteredTransacoes = (transacoes || []).filter((transacao) => {
    if (filters.accountId && transacao.accountId !== filters.accountId)
      return false;
    if (filters.category && transacao.category !== filters.category)
      return false;
    if (filters.type && transacao.type !== filters.type) return false;
    // Adicionar filtros de data se necessário
    return true;
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('title')}
              </h1>
              <p className="text-gray-600 text-sm">{t('subtitle')}</p>
            </div>
            <div className="flex justify-start">
              <TransactionActions onAddTransaction={handleCreateTransacao} />
            </div>
          </div>

          <TransactionFilters
            tipo={filters.type}
            categoria={filters.category}
            dataInicio={filters.startDate}
            dataFim={filters.endDate}
            onTipoChange={(type: 'INCOME' | 'EXPENSE' | '') =>
              setFilters((prev) => ({ ...prev, type }))
            }
            onCategoriaChange={(category) =>
              setFilters((prev) => ({ ...prev, category }))
            }
            onDataInicioChange={(startDate) =>
              setFilters((prev) => ({ ...prev, startDate }))
            }
            onDataFimChange={(endDate) =>
              setFilters((prev) => ({ ...prev, endDate }))
            }
          />

          {loading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600">{t('loading')}</span>
            </div>
          ) : (
            <TransactionTable
              transacoes={filteredTransacoes}
              onEdit={handleEditTransacao}
              onDelete={handleDeleteTransacao}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}

          <TransactionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTransacao}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
