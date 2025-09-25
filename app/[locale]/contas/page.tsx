'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates';
import { useAuthStore } from '@/store/auth.store';
import { useContasStore } from '@/store/contas.store';

export default function ContasPage() {
  const { isAuthenticated } = useAuthStore();
  const { contas, loading, fetchContas } = useContasStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/pt/login');
      return;
    }
    fetchContas();
  }, [isAuthenticated, router, fetchContas]);

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
    <DashboardLayout title="Contas" subtitle="Gerencie suas contas bancárias">
      <div className="space-y-6">
        {/* Header com botão de adicionar */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Suas Contas</h2>
          <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            Adicionar Conta
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-gray-600">Carregando contas...</span>
          </div>
        )}

        {/* Contas grid */}
        {!loading && contas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contas.map((conta) => (
              <div key={conta.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {conta.nome}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      conta.ativa
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {conta.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Tipo</p>
                  <p className="font-medium capitalize">{conta.tipo}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Saldo</p>
                  <p
                    className={`text-2xl font-bold ${
                      conta.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    R$ {conta.saldo.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors duration-200">
                    Editar
                  </button>
                  <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm font-medium transition-colors duration-200">
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && contas.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma conta encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando sua primeira conta bancária.
            </p>
            <div className="mt-6">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Adicionar Conta
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
