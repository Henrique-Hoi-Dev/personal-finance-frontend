'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/templates';
import {
  ContaModal,
  MonthlyComparisonTable,
  MonthlyFinancialSummary,
} from '@/components/molecules';
import { useContasStore } from '@/store/contas.store';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  getMonthlyComparison,
  getDashboardAll,
} from '@/services/contas.service';
import { MonthlyComparisonData as ApiMonthlyComparisonData } from '@/types/contas';
import { MonthlyComparisonData } from '@/types/monthly-financial';
import { formatDateSafe } from '@/utils';

export default function ContasPage() {
  const router = useRouter();
  const params = useParams();
  const { addConta } = useContasStore();
  const t = useTranslations('Contas');

  // Pegar o locale atual
  const locale = params.locale as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Estados para comparação mensal
  const [monthlyComparison, setMonthlyComparison] = useState<
    MonthlyComparisonData[]
  >([]);
  const [monthlyComparisonLoading, setMonthlyComparisonLoading] =
    useState(false);

  // Estados para resumo financeiro
  const [financialSummary, setFinancialSummary] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySurplus: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 5;

  const handleCreateConta = async (data: any) => {
    setIsCreating(true);
    try {
      await addConta(data);
      setIsModalOpen(false);
      await fetchDashboardData();
      await fetchMonthlyComparison();
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewDetails = (month: string, year: number) => {
    const monthNames = {
      janeiro: 1,
      fevereiro: 2,
      março: 3,
      abril: 4,
      maio: 5,
      junho: 6,
      julho: 7,
      agosto: 8,
      setembro: 9,
      outubro: 10,
      novembro: 11,
      dezembro: 12,
    };

    const monthLower = month.toLowerCase();
    const monthNumber = monthNames[monthLower as keyof typeof monthNames];

    if (monthNumber) {
      router.push(
        `/${locale}/contas/detalhes?month=${monthNumber}&year=${year}`
      );
    } else {
      console.error('Mês não encontrado:', month);
    }
  };

  // Função para transformar dados da API para o formato do componente
  const transformMonthlyComparisonData = (data: ApiMonthlyComparisonData[]) => {
    return data.map((item) => ({
      month: new Date(
        item.referenceYear,
        item.referenceMonth - 1
      ).toLocaleDateString('pt-BR', {
        month: 'long',
      }),
      year: item.referenceYear,
      income: item.totalIncome,
      expenses: item.totalExpenses,
      surplus: item.totalIncome - item.totalExpenses,
      billsToPay: item.billsToPay,
      installments: item.billsCount,
      status: item.status,
      isCurrent:
        item.referenceMonth === new Date().getMonth() + 1 &&
        item.referenceYear === new Date().getFullYear(),
    }));
  };

  // Função para buscar dados do dashboard (big numbers)
  const fetchDashboardData = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const response = await getDashboardAll();
      setFinancialSummary({
        totalBalance: response.totalBalance || 0,
        monthlyIncome: response.totalIncome || 0,
        monthlyExpenses: response.totalExpenses || 0,
        monthlySurplus:
          (response.totalIncome || 0) - (response.totalExpenses || 0),
        month: response.month || new Date().getMonth() + 1,
        year: response.year || new Date().getFullYear(),
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // Função para buscar comparação mensal
  const fetchMonthlyComparison = useCallback(
    async (page: number = currentPage) => {
      setMonthlyComparisonLoading(true);
      try {
        const response = await getMonthlyComparison({
          limit,
          page: page - 1, // API usa 0-based pagination
        });
        const transformedData = transformMonthlyComparisonData(response.docs);
        setMonthlyComparison(transformedData);
        setTotalPages(Math.ceil(response.total / limit));
        setTotalItems(response.total);
      } catch (error) {
        console.error('Erro ao buscar comparação mensal:', error);
      } finally {
        setMonthlyComparisonLoading(false);
      }
    },
    [currentPage, limit]
  );

  // Função de paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMonthlyComparison(page);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlyComparison();
  }, [fetchDashboardData, fetchMonthlyComparison]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('title')}
                </h1>
                <p className="text-gray-600 text-sm mt-1">{t('description')}</p>
              </div>
              <div className="flex justify-start">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  <span className="hidden sm:inline">{t('addAccount')}</span>
                  <span className="sm:hidden">Adicionar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard de Comparação Mensal */}
          <div className="p-6 space-y-6">
            {/* Resumo Financeiro Mensal */}
            <MonthlyFinancialSummary
              data={financialSummary}
              loading={summaryLoading}
            />

            {/* Tabela Comparativa Mensal */}
            <MonthlyComparisonTable
              data={monthlyComparison}
              loading={monthlyComparisonLoading}
              onViewDetails={handleViewDetails}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
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
