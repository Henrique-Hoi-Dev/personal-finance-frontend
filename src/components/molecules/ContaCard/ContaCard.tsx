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
    switch (tipo.toLowerCase()) {
      case 'corrente':
        return 'bg-blue-500';
      case 'credito':
        return 'bg-purple-500';
      case 'poupanca':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'corrente':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'credito':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      case 'poupanca':
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        );
    }
  };

  const formatSaldo = (saldo: number) => {
    return `R$ ${saldo.toFixed(2).replace('.', ',')}`;
  };

  const getSaldoColor = (saldo: number) => {
    return saldo >= 0 ? 'text-green-600' : 'text-red-600';
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
              conta.tipo
            )}`}
          >
            {getIcon(conta.tipo)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{conta.nome}</h3>
            <p className="text-sm text-gray-500 capitalize">{conta.tipo}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${getSaldoColor(conta.saldo)}`}>
            {formatSaldo(conta.saldo)}
          </p>
          {conta.tipo.toLowerCase() === 'credito' && conta.saldo > 0 && (
            <p className="text-xs text-gray-500">2 parcelas pendentes</p>
          )}
        </div>
      </div>
    </div>
  );
};
