import React from 'react';
import { Conta } from '@/types';

interface ContaDetailsProps {
  conta: Conta | null;
  onClose?: () => void;
}

export const ContaDetails: React.FC<ContaDetailsProps> = ({
  conta,
  onClose,
}) => {
  if (!conta) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Selecione uma conta
        </h3>
        <p className="text-gray-600">
          Clique em uma conta à esquerda para ver os detalhes
        </p>
      </div>
    );
  }

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{conta.name}</h2>
          <p className="text-sm text-gray-500">{getTypeLabel(conta.type)}</p>
        </div>
      </div>

      {/* Valor Total */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Valor Total</p>
        <p
          className={`text-3xl font-bold ${getAmountColor(conta.totalAmount)}`}
        >
          {formatAmount(conta.totalAmount)}
        </p>
      </div>

      {/* Informações da Conta */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Tipo de Conta</span>
          <span className="text-sm font-medium text-gray-900">
            {getTypeLabel(conta.type)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Parcelas</span>
          <span className="text-sm font-medium text-gray-900">
            {conta.installments || 1}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Data de Início</span>
          <span className="text-sm font-medium text-gray-900">
            {new Date(conta.startDate).toLocaleDateString('pt-BR')}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Dia de Vencimento</span>
          <span className="text-sm font-medium text-gray-900">
            {conta.dueDay}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Data de Criação</span>
          <span className="text-sm font-medium text-gray-900">
            {new Date(conta.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-6 flex space-x-3">
        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
          Editar Conta
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
          Ver Extrato
        </button>
      </div>
    </div>
  );
};
