import React from 'react';
import { useTranslations } from 'next-intl';

interface TransactionFiltersProps {
  tipo: string;
  categoria: string;
  onTipoChange: (tipo: string) => void;
  onCategoriaChange: (categoria: string) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  tipo,
  categoria,
  onTipoChange,
  onCategoriaChange,
}) => {
  const t = useTranslations('Transacoes');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => onTipoChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas</option>
            <option value="receita">{t('income')}</option>
            <option value="despesa">{t('expenses')}</option>
          </select>
        </div>

        {/* Categoria Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => onCategoriaChange(e.target.value)}
            placeholder="Buscar categoria..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>
  );
};
