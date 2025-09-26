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
import { useContasStore } from '@/store/contas.store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Transacao } from '@/types';
import { TransactionFormData } from '@/components/molecules';

export default function TransacoesPage() {
  const { transacoes, loading, fetchTransacoes } = useTransacoesStore();
  const { contas, fetchContas } = useContasStore();
  const t = useTranslations('Transacoes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(
    null
  );
  const [filters, setFilters] = useState({
    contaId: '',
    tipo: '',
    dataInicio: '',
    dataFim: '',
  });

  useEffect(() => {
    fetchTransacoes();
    fetchContas();
  }, [fetchTransacoes, fetchContas]);

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
        // await updateTransacao(editingTransacao.id, data);
      } else {
        // await createTransacao(data);
      }
      await fetchTransacoes();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleDeleteTransacao = async (id: string) => {
    try {
      // await deleteTransacao(id);
      await fetchTransacoes();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const filteredTransacoes = (transacoes || []).filter((transacao) => {
    if (filters.contaId && transacao.contaId !== filters.contaId) return false;
    if (filters.tipo && transacao.tipo !== filters.tipo) return false;
    // Adicionar filtros de data se necessário
    return true;
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <TransactionActions
              onAddIncome={handleCreateTransacao}
              onAddExpense={handleCreateTransacao}
            />
          </div>

          <TransactionFilters
            tipo={filters.tipo}
            categoria={filters.contaId}
            onTipoChange={(tipo) => setFilters((prev) => ({ ...prev, tipo }))}
            onCategoriaChange={(contaId) =>
              setFilters((prev) => ({ ...prev, contaId }))
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
            />
          )}

          <TransactionModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTransacao}
            tipo="receita"
            contas={contas}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
