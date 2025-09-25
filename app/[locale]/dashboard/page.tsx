'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/templates';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/pt/login');
    }
  }, [isAuthenticated, router]);

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
    <DashboardLayout title="Dashboard" subtitle="Visão geral das suas finanças">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bem-vindo ao FinanceApp!
          </h2>
          <p className="text-gray-600 mb-6">
            Login realizado com sucesso. Aqui você pode gerenciar suas finanças
            pessoais.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Saldo Atual
              </h3>
              <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Receitas
              </h3>
              <p className="text-2xl font-bold text-blue-600">R$ 0,00</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Despesas
              </h3>
              <p className="text-2xl font-bold text-red-600">R$ 0,00</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
