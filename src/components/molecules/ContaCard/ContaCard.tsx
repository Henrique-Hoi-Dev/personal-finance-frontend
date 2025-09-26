import React from 'react';
import { Conta } from '@/types';
import { formatAmount, getAmountColor } from '@/utils';

interface ContaCardProps {
  conta: Conta;
  isSelected: boolean;
  onClick: () => void;
}

export const ContaCard: React.FC<ContaCardProps> = ({
  conta,
  isSelected,
  onClick,
}) => {
  const getIconColor = (tipo: string) => {
    if (!tipo) return 'bg-gray-400';

    switch (tipo.toUpperCase()) {
      case 'FIXED':
        return 'bg-blue-500';
      case 'LOAN':
        return 'bg-purple-500';
      case 'CREDIT_CARD':
        return 'bg-purple-400';
      case 'SUBSCRIPTION':
        return 'bg-green-500';
      case 'OTHER':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getIcon = (tipo: string) => {
    if (!tipo) return getDefaultIcon();

    switch (tipo.toUpperCase()) {
      case 'FIXED':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case 'CREDIT_CARD':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        );
      case 'SUBSCRIPTION':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
      case 'LOAN':
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        );
      case 'OTHER':
        return getDefaultIcon();
      default:
        return getDefaultIcon();
    }
  };

  const getDefaultIcon = () => (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  );

  const getTypeLabel = (type: string) => {
    if (!type) return 'Outro';

    switch (type.toUpperCase()) {
      case 'FIXED':
        return 'Corrente';
      case 'LOAN':
        return 'Empréstimo';
      case 'CREDIT_CARD':
        return 'Crédito';
      case 'SUBSCRIPTION':
        return 'Poupança';
      case 'OTHER':
        return 'Outro';
      default:
        return 'Outro';
    }
  };

  const getPendingInstallments = (conta: Conta) => {
    if (conta.installmentList && conta.installmentList.length > 0) {
      const pendingCount = conta.installmentList.filter(
        (inst) => !inst.isPaid
      ).length;
      if (pendingCount > 0) {
        return `${pendingCount} parcelas pendentes`;
      }
    }
    return null;
  };

  const isAccountPaid = (conta: Conta) => {
    if (conta.installmentList && conta.installmentList.length > 0) {
      return conta.installmentList.every((inst) => inst.isPaid);
    } else {
      return conta.totalAmount === 0;
    }
  };

  return (
    <div
      className={`p-4 w-full rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
          : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${getIconColor(
              conta.type
            )}`}
          >
            {getIcon(conta.type)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{conta.name}</h3>
            <p className="text-sm text-gray-500 font-medium">
              {getTypeLabel(conta.type)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-bold text-xl ${getAmountColor(conta.totalAmount)}`}
          >
            {formatAmount(conta.totalAmount)}
          </p>
          {isAccountPaid(conta) ? (
            <p className="text-xs text-green-600 mt-1 font-medium">✓ Pago</p>
          ) : getPendingInstallments(conta) ? (
            <p className="text-xs text-gray-500 mt-1 font-medium">
              {getPendingInstallments(conta)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
