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

  const formatSaldo = (saldo: number) => {
    return `R$ ${saldo.toFixed(2).replace('.', ',')}`;
  };

  const getSaldoColor = (saldo: number) => {
    return saldo >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (ativa: boolean) => {
    return ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{conta.nome}</h2>
          <p className="text-sm text-gray-500 capitalize">{conta.tipo}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            conta.ativa
          )}`}
        >
          {conta.ativa ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      {/* Saldo */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">Saldo Atual</p>
        <p className={`text-3xl font-bold ${getSaldoColor(conta.saldo)}`}>
          {formatSaldo(conta.saldo)}
        </p>
      </div>

      {/* Informações da Conta */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Tipo de Conta</span>
          <span className="text-sm font-medium text-gray-900 capitalize">
            {conta.tipo}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Status</span>
          <span
            className={`text-sm font-medium ${getStatusColor(conta.ativa)}`}
          >
            {conta.ativa ? 'Ativa' : 'Inativa'}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-sm text-gray-600">Data de Criação</span>
          <span className="text-sm font-medium text-gray-900">
            {new Date(conta.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {conta.tipo.toLowerCase() === 'credito' && conta.saldo > 0 && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">Parcelas Pendentes</span>
            <span className="text-sm font-medium text-red-600">2 parcelas</span>
          </div>
        )}
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
