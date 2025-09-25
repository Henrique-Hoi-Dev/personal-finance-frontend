'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates';
import { useAuthStore } from '@/store/auth.store';
import { useTransacoesStore } from '@/store/transacoes.store';

export default function TransacoesPage() {
  const { isAuthenticated } = useAuthStore();
  const { transacoes, loading, fetchTransacoes } = useTransacoesStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/pt/login');
      return;
    }
    fetchTransacoes();
  }, [isAuthenticated, router, fetchTransacoes]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Transações"
      subtitle="Histórico de suas movimentações financeiras"
    >
      <div className="space-y-6">
        {/* Header com filtros e botão de adicionar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Todas as transações</option>
              <option value="receita">Receitas</option>
              <option value="despesa">Despesas</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option value="">Todas as categorias</option>
              <option value="alimentacao">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="lazer">Lazer</option>
              <option value="saude">Saúde</option>
            </select>
          </div>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            Adicionar Transação
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-gray-600">Carregando transações...</span>
          </div>
        )}

        {/* Transações list */}
        {!loading && transacoes.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {transacoes.map((transacao) => (
                <li key={transacao.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          transacao.tipo === 'receita'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {transacao.tipo === 'receita' ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {transacao.descricao}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transacao.categoria} •{' '}
                          {new Date(transacao.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            transacao.tipo === 'receita'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transacao.tipo === 'receita' ? '+' : '-'}R${' '}
                          {transacao.valor.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty state */}
        {!loading && transacoes.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma transação encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece registrando suas primeiras movimentações financeiras.
            </p>
            <div className="mt-6">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Adicionar Transação
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
