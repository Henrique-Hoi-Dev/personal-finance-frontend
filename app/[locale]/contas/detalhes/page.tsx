'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/templates';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  ContaFilters,
  ContaEditForm,
  ContaModal,
} from '@/components/molecules';
import { BaseModal, BaseConfirmModal } from '@/components/atoms';
import {
  getContas,
  getContaById,
  updateConta,
  deleteConta,
  deleteInstallment,
  payInstallment,
  payFullAccount,
} from '@/services/contas.service';
import { Conta } from '@/types/contas';
import { formatCurrencyFromCents, formatDateSafe } from '@/utils';
import { toast } from 'sonner';

export default function ContasDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const t = useTranslations('Contas');

  const locale = params.locale as string;

  const getAccountTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      FIXED: t('accountTypes.FIXED'),
      FIXED_PREVIEW: t('accountTypes.FIXED_PREVIEW'),
      LOAN: t('accountTypes.LOAN'),
      CREDIT_CARD: t('accountTypes.CREDIT_CARD'),
      SUBSCRIPTION: t('accountTypes.SUBSCRIPTION'),
      OTHER: t('accountTypes.OTHER'),
    };
    return typeLabels[type] || type;
  };

  const getAccountDate = (account: Conta) => {
    if (
      account.installments &&
      account.installments > 0 &&
      account.installment
    ) {
      return formatDateSafe(account.installment.dueDate);
    }
    return formatDateSafe(account.startDate);
  };

  const getDayFromDateString = (dateString: string) => {
    // Evita problemas de fuso horário extraindo o dia diretamente da string
    const [datePart] = dateString.split('T');
    const parts = datePart.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      if (!Number.isNaN(day)) return day;
    }
    // Fallback usando formatDateSafe (dd/mm/aaaa)
    const formatted = formatDateSafe(dateString);
    const day = parseInt(formatted.split('/')[0], 10);
    return Number.isNaN(day) ? 0 : day;
  };

  const getAccountDueDay = (account: Conta) => {
    if (
      account.installments &&
      account.installments > 0 &&
      account.installment
    ) {
      return getDayFromDateString(account.installment.dueDate);
    }
    return account.dueDay;
  };

  const month = searchParams.get('month');
  const year = searchParams.get('year');

  const [accounts, setAccounts] = useState<Conta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    tipo: '',
    nome: '',
    isPaid: '',
  });

  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInstallmentsModal, setShowInstallmentsModal] = useState(false);
  const [showDeleteInstallmentModal, setShowDeleteInstallmentModal] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Conta | null>(null);
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingInstallment, setIsDeletingInstallment] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [installments, setInstallments] = useState<any[]>([]);
  const [loadingInstallments, setLoadingInstallments] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPayInstallmentModal, setShowPayInstallmentModal] = useState(false);
  const [isPayingInstallment, setIsPayingInstallment] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!month || !year) {
      setError('Parâmetros de mês e ano são obrigatórios');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const accountsResponse = await getContas({
        month: parseInt(month),
        year: parseInt(year),
        type: filters.tipo || undefined,
        search: filters.nome || undefined,
        isPaid: filters.isPaid ? filters.isPaid === 'true' : undefined,
      });

      setAccounts(accountsResponse);
    } catch (error) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [month, year, filters]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleBack = () => {
    router.push(`/${locale}/contas`);
  };

  const handleTipoChange = (tipo: string) => {
    setFilters((prev) => ({ ...prev, tipo }));
  };

  const handleNomeChange = (nome: string) => {
    setFilters((prev) => ({ ...prev, nome }));
  };

  const handleIsPaidChange = (isPaid: string) => {
    setFilters((prev) => ({ ...prev, isPaid }));
  };

  // Funções para controlar dropdowns
  const toggleExpanded = (accountId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  const isExpanded = (accountId: string) => {
    return expandedItems.has(accountId);
  };

  const handleEditAccount = (account: Conta) => {
    setSelectedAccount(account);
    setShowEditModal(true);
  };

  const handleDeleteAccount = (account: Conta) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  const handleRequestPayAccount = (account: Conta) => {
    setSelectedAccount(account);
    setShowPayModal(true);
  };

  const handleConfirmPayAccount = async () => {
    if (!selectedAccount) return;
    setIsPaying(true);
    try {
      if (selectedAccount.installment) {
        await payInstallment(
          selectedAccount.installment.id,
          selectedAccount.installment.amount
        );
      } else {
        await payFullAccount(selectedAccount.id, selectedAccount.totalAmount);
      }
      await fetchAccounts();
      setShowPayModal(false);
      setSelectedAccount(null);
      toast.success(t('paid'));
    } catch (error) {
      toast.error('Erro ao pagar conta');
    } finally {
      setIsPaying(false);
    }
  };

  const handleViewInstallments = async (account: Conta) => {
    setSelectedAccount(account);
    setShowInstallmentsModal(true);
    setLoadingInstallments(true);

    try {
      const contaCompleta = await getContaById(account.id);

      if (
        contaCompleta.installmentList &&
        contaCompleta.installmentList.length > 0
      ) {
        setInstallments(contaCompleta.installmentList);
      } else {
        setInstallments([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar parcelas');
      setInstallments([]);
    } finally {
      setLoadingInstallments(false);
    }
  };

  const handleCloseInstallmentsModal = () => {
    setShowInstallmentsModal(false);
    setSelectedAccount(null);
    setInstallments([]);
  };

  const handleRequestPayInstallment = (installment: any) => {
    setSelectedInstallment(installment);
    setShowPayInstallmentModal(true);
  };

  const handleConfirmPayInstallment = async () => {
    if (!selectedInstallment) return;
    setIsPayingInstallment(true);
    try {
      await payInstallment(selectedInstallment.id, selectedInstallment.amount);
      toast.success('Parcela paga com sucesso!');

      if (selectedAccount) {
        const contaCompleta = await getContaById(selectedAccount.id);
        if (
          contaCompleta.installmentList &&
          contaCompleta.installmentList.length > 0
        ) {
          setInstallments(contaCompleta.installmentList);
        }
      }

      await fetchAccounts();
      setShowPayInstallmentModal(false);
      setSelectedInstallment(null);
    } catch (error) {
      toast.error('Erro ao pagar parcela');
    } finally {
      setIsPayingInstallment(false);
    }
  };

  const handleDeleteInstallment = (installment: any) => {
    setSelectedInstallment(installment);
    setShowDeleteInstallmentModal(true);
  };

  const handleConfirmDeleteInstallment = async () => {
    if (!selectedInstallment) return;

    setIsDeletingInstallment(true);
    try {
      await deleteInstallment(selectedInstallment.id);
      toast.success('Parcela excluída com sucesso!');

      // Recarregar a lista de parcelas
      if (selectedAccount) {
        const contaCompleta = await getContaById(selectedAccount.id);
        if (
          contaCompleta.installmentList &&
          contaCompleta.installmentList.length > 0
        ) {
          setInstallments(contaCompleta.installmentList);
        }
      }

      // Recarregar a lista principal
      await fetchAccounts();

      // Fechar modal
      setShowDeleteInstallmentModal(false);
      setSelectedInstallment(null);
    } catch (error) {
      toast.error('Erro ao excluir parcela');
    } finally {
      setIsDeletingInstallment(false);
    }
  };

  const handleCloseDeleteInstallmentModal = () => {
    setShowDeleteInstallmentModal(false);
    setSelectedInstallment(null);
    setIsDeletingInstallment(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAccount(null);
    setIsEditing(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAccount(null);
    setIsDeleting(false);
  };

  const handleEditSubmit = async (data: any) => {
    if (!selectedAccount) return;

    setIsEditing(true);
    try {
      // Chamar API para editar conta
      await updateConta({
        id: selectedAccount.id,
        ...data,
      });

      toast.success('Conta editada com sucesso!');

      // Recarregar a lista após edição
      await fetchAccounts();
      handleCloseEditModal();
    } catch (error) {
      toast.error('Erro ao editar conta');
    } finally {
      setIsEditing(false);
    }
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;

    setIsDeleting(true);
    try {
      // Chamar API para excluir cont
      await deleteConta(selectedAccount.id);
      toast.success('Conta excluída com sucesso!');

      // Recarregar a lista após exclusão
      await fetchAccounts();
      handleCloseDeleteModal();
    } catch (error) {
      toast.error('Erro ao excluir conta');
    } finally {
      setIsDeleting(false);
    }
  };

  const monthName =
    month && year
      ? new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
          'pt-BR',
          {
            month: 'long',
            year: 'numeric',
          }
        )
      : 'Mês não especificado';

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('loading')}</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  {t('backToAccounts')}
                </button>

                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {t('accountDetails')} - {monthName}
                    </h1>
                    <p className="text-gray-600">
                      {t('accountDetailsDescription')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {accounts.length}{' '}
                      {accounts.length === 1 ? t('account') : t('accounts')}{' '}
                      {t('found')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
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
          </div>

          {/* Filtros */}
          <div className="px-6">
            <ContaFilters
              tipo={filters.tipo}
              nome={filters.nome}
              isPaid={filters.isPaid}
              onTipoChange={handleTipoChange}
              onNomeChange={handleNomeChange}
              onIsPaidChange={handleIsPaidChange}
            />
          </div>

          {/* Resumo */}
          <div className="p-6">
            {/* Lista de Contas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('accountList')}
                </h2>
              </div>

              {accounts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('noAccountsFound')}
                  </h3>
                  <p className="text-gray-600">
                    {t('noAccountsDescription')} {monthName}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <div key={account.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {account.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  account.installment?.isPaid || account.isPaid
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {account.installment?.isPaid || account.isPaid
                                  ? t('paid')
                                  : t('pending')}
                              </span>
                              {account.isPreview && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {t('previewStatus')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              {t('accountType')}:{' '}
                              {getAccountTypeLabel(account.type)}
                            </span>
                            <span>
                              {t('dueDate')}: Dia {getAccountDueDay(account)}
                            </span>
                            <span>
                              {t('startDate')}:{' '}
                              {formatDateSafe(account.startDate)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrencyFromCents(account.totalAmount)}
                            </div>
                            {account.installments && (
                              <div className="text-sm text-gray-600">
                                {account.installments} {t('installments')}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => toggleExpanded(account.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${
                                isExpanded(account.id) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Dropdown expansível com animação */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded(account.id)
                            ? 'max-h-96 opacity-100'
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Informações completas */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900">
                                {t('completeInformation')}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-800 font-semibold">
                                    {t('name')}
                                  </div>
                                  <div className="text-gray-600">
                                    {account.name}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-800 font-semibold">
                                    {t('accountType')}
                                  </div>
                                  <div className="text-gray-600">
                                    {getAccountTypeLabel(account.type)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-800 font-semibold">
                                    {t('totalAmount')}
                                  </div>
                                  <div className="text-gray-600">
                                    {formatCurrencyFromCents(
                                      account.totalAmount
                                    )}
                                  </div>
                                </div>
                                {account.installments && (
                                  <div>
                                    <div className="text-gray-800 font-semibold">
                                      {t('installments')}
                                    </div>
                                    <div className="text-gray-600">
                                      {account.installments}
                                    </div>
                                  </div>
                                )}
                                {(account.installmentAmount ||
                                  account.installment?.amount) && (
                                  <div>
                                    <div className="text-gray-800 font-semibold">
                                      {t('installmentAmount')}
                                    </div>
                                    <div className="text-gray-600">
                                      {formatCurrencyFromCents(
                                        (account.installmentAmount ??
                                          account.installment?.amount) ||
                                          0
                                      )}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-gray-800 font-semibold">
                                    {t('startDate')}
                                  </div>
                                  <div className="text-gray-600">
                                    {formatDateSafe(account.startDate)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-800 font-semibold">
                                    {t('dueDay')}
                                  </div>
                                  <div className="text-gray-600">
                                    Dia {getAccountDueDay(account)}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-800 font-semibold">
                                    {t('status')}
                                  </div>
                                  <div>
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        account.installment?.isPaid ||
                                        account.isPaid
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}
                                    >
                                      {account.installment?.isPaid ||
                                      account.isPaid
                                        ? t('paid')
                                        : t('pending')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Ações - só aparece se houver pelo menos uma ação disponível */}
                            {((account.installments &&
                              account.installments > 0) ||
                              !(
                                account.installment?.isPaid || account.isPaid
                              )) && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">
                                  {t('actions')}
                                </h4>
                                <div className="flex space-x-2">
                                  {account.installments &&
                                    account.installments > 0 && (
                                      <button
                                        onClick={() =>
                                          handleViewInstallments(account)
                                        }
                                        className="flex items-center px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                          />
                                        </svg>
                                        {t('viewInstallments')}
                                      </button>
                                    )}
                                  {!(
                                    account.installment?.isPaid ||
                                    account.isPaid
                                  ) && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleRequestPayAccount(account)
                                        }
                                        className="flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        {t('pay')}
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleEditAccount(account)
                                        }
                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
                                        {t('edit')}
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteAccount(account)
                                        }
                                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-2"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                        {t('delete')}
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Edição */}
        <BaseModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          title={t('editAccount')}
          size="2xl"
          closeOnBackdropClick={false}
          closeOnEsc={false}
        >
          {selectedAccount && (
            <ContaEditForm
              onSubmit={handleEditSubmit}
              onCancel={handleCloseEditModal}
              loading={isEditing}
              initialData={{
                name: selectedAccount.name,
                totalAmount: selectedAccount.totalAmount,
                startDate: selectedAccount.startDate,
                dueDay: selectedAccount.dueDay,
                isPreview: selectedAccount.isPreview || false,
              }}
            />
          )}
        </BaseModal>

        {/* Modal de Criar Conta (usa mês/ano do contexto) */}
        <ContaModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            setIsCreating(true);
            try {
              const { useContasStore } = await import('@/store/contas.store');
              const addConta = useContasStore.getState().addConta;
              await addConta({
                ...data,
                referenceMonth: parseInt(
                  month || `${new Date().getMonth() + 1}`
                ),
                referenceYear: parseInt(year || `${new Date().getFullYear()}`),
              } as any);
              await fetchAccounts();
              setShowCreateModal(false);
            } finally {
              setIsCreating(false);
            }
          }}
          loading={isCreating}
          referenceMonth={month ? parseInt(month) : undefined}
          referenceYear={year ? parseInt(year) : undefined}
        />

        {/* Modal de Confirmação de Exclusão */}
        <BaseConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title={t('confirmDelete')}
          message={
            selectedAccount
              ? `${t('confirmDeleteMessage')} "${selectedAccount.name}"?`
              : t('confirmDelete')
          }
          confirmText={t('delete')}
          cancelText={t('cancel')}
          type="danger"
          loading={isDeleting}
          closeOnBackdropClick={false}
          closeOnEsc={false}
        />

        {/* Modal de Confirmação de Exclusão de Parcela */}
        <div
          className={
            showDeleteInstallmentModal ? 'fixed inset-0 z-[60]' : 'hidden'
          }
        >
          <BaseConfirmModal
            isOpen={showDeleteInstallmentModal}
            onClose={handleCloseDeleteInstallmentModal}
            onConfirm={handleConfirmDeleteInstallment}
            title={t('confirmDeleteInstallment')}
            message={
              selectedInstallment
                ? `${t('confirmDeleteInstallmentMessage')} ${t(
                    'installment'
                  )} ${selectedInstallment.number}?`
                : t('confirmDeleteInstallment')
            }
            confirmText={t('delete')}
            cancelText={t('cancel')}
            type="danger"
            loading={isDeletingInstallment}
            closeOnBackdropClick={false}
            closeOnEsc={false}
          />
        </div>

        {/* Modal de Parcelas */}
        <BaseModal
          isOpen={showInstallmentsModal}
          onClose={handleCloseInstallmentsModal}
          title={t('installmentsList')}
          size="2xl"
          closeOnBackdropClick={false}
          closeOnEsc={false}
        >
          {selectedAccount && (
            <div className="p-6 max-h-96 flex flex-col">
              <div className="mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedAccount.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('totalInstallments')}: {selectedAccount.installments}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingInstallments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">{t('loading')}</span>
                  </div>
                ) : installments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <p className="text-gray-600">{t('noInstallmentsFound')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 pr-2">
                    {installments.map((installment, index) => (
                      <div
                        key={installment.id || index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-gray-900">
                            {t('installment')} {installment.number}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDateSafe(installment.dueDate)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrencyFromCents(installment.amount)}
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              installment.isPaid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {installment.isPaid ? t('paid') : t('pending')}
                          </span>
                          <div className="flex items-center space-x-2">
                            {!installment.isPaid && (
                              <button
                                onClick={() =>
                                  handleRequestPayInstallment(installment)
                                }
                                className="flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors"
                              >
                                <svg
                                  className="w-3 h-3 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {t('pay')}
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteInstallment(installment)
                              }
                              className="flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
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
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </BaseModal>

        {/* Modal de Confirmação de Pagamento da Conta */}
        <BaseConfirmModal
          isOpen={showPayModal}
          onClose={() => {
            setShowPayModal(false);
            setSelectedAccount(null);
          }}
          onConfirm={handleConfirmPayAccount}
          title={t('confirm')}
          message={
            selectedAccount
              ? `${t('confirm')} ${t('pay')} "${selectedAccount.name}"?`
              : t('confirm')
          }
          confirmText={t('pay')}
          cancelText={t('cancel')}
          type="success"
          loading={isPaying}
          closeOnBackdropClick={false}
          closeOnEsc={false}
        />

        {/* Modal de Confirmação de Pagamento da Parcela */}
        <div
          className={
            showPayInstallmentModal ? 'fixed inset-0 z-[60]' : 'hidden'
          }
        >
          <BaseConfirmModal
            isOpen={showPayInstallmentModal}
            onClose={() => {
              setShowPayInstallmentModal(false);
              setSelectedInstallment(null);
            }}
            onConfirm={handleConfirmPayInstallment}
            title={t('confirm')}
            message={
              selectedInstallment
                ? `${t('confirm')} ${t('pay')} ${t('installment')} ${
                    selectedInstallment.number
                  }?`
                : t('confirm')
            }
            confirmText={t('pay')}
            cancelText={t('cancel')}
            type="success"
            loading={isPayingInstallment}
            closeOnBackdropClick={false}
            closeOnEsc={false}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
