import React from 'react';
import { Conta } from '@/types';

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
    if (!tipo) return 'bg-gray-500';

    switch (tipo.toUpperCase()) {
      case 'FIXED':
        return 'bg-blue-500';
      case 'LOAN':
        return 'bg-purple-500';
      case 'CREDIT_CARD':
        return 'bg-red-500';
      case 'SUBSCRIPTION':
        return 'bg-green-500';
      case 'OTHER':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = (tipo: string) => {
    if (!tipo) return getDefaultIcon();

    switch (tipo.toUpperCase()) {
      case 'FIXED':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'LOAN':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'CREDIT_CARD':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'SUBSCRIPTION':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'OTHER':
        return getDefaultIcon();
      default:
        return getDefaultIcon();
    }
  };

  const getDefaultIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
    </svg>
  );

  const formatAmount = (amount: number) => {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`;
  };

  const getAmountColor = (amount: number) => {
    return amount >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTypeLabel = (type: string) => {
    if (!type) return 'Outro';

    switch (type.toUpperCase()) {
      case 'FIXED':
        return 'Fixa';
      case 'LOAN':
        return 'Empréstimo';
      case 'CREDIT_CARD':
        return 'Cartão de Crédito';
      case 'SUBSCRIPTION':
        return 'Assinatura';
      case 'OTHER':
        return 'Outro';
      default:
        return 'Outro';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(
              conta.type
            )}`}
          >
            {getIcon(conta.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{conta.name}</h3>
            <p className="text-sm text-gray-500">{getTypeLabel(conta.type)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${getAmountColor(conta.totalAmount)}`}>
            {formatAmount(conta.totalAmount)}
          </p>
          {conta.installments && conta.installments > 1 && (
            <p className="text-xs text-gray-500">
              {conta.installments} parcelas
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
