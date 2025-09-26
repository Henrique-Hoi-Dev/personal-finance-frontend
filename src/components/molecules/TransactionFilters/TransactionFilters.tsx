import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCategoriesStore } from '@/store/categories.store';
import { BaseSelect } from '@/components/atoms';
import { useEndpointOptions, useEnumOptions } from '@/hooks';

interface TransactionFiltersProps {
  tipo: 'INCOME' | 'EXPENSE' | '';
  categoria: string;
  dataInicio: string;
  dataFim: string;
  onTipoChange: (tipo: 'INCOME' | 'EXPENSE' | '') => void;
  onCategoriaChange: (categoria: string) => void;
  onDataInicioChange: (dataInicio: string) => void;
  onDataFimChange: (dataFim: string) => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  tipo,
  categoria,
  dataInicio,
  dataFim,
  onTipoChange,
  onCategoriaChange,
  onDataInicioChange,
  onDataFimChange,
}) => {
  const t = useTranslations('Transacoes');
  const { categories, fetchCategories } = useCategoriesStore();

  // Carrega as categorias quando o componente monta
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const tipoOptions = useEnumOptions(
    { INCOME: 'INCOME', EXPENSE: 'EXPENSE' },
    { INCOME: t('income'), EXPENSE: t('expenses') },
    t('all')
  );

  const categoriaOptions = useEndpointOptions(
    categories,
    'name',
    'ptBr',
    t('allCategories')
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('filters')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tipo Filter */}
        <BaseSelect
          value={tipo}
          onChange={(value) => onTipoChange(value as 'INCOME' | 'EXPENSE' | '')}
          options={tipoOptions}
          label={t('type')}
        />

        {/* Categoria Filter */}
        <BaseSelect
          value={categoria}
          onChange={(value) => onCategoriaChange(String(value))}
          options={categoriaOptions}
          label={t('category')}
        />

        {/* Data Início Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('startDate')}
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => onDataInicioChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Data Fim Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('endDate')}
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => onDataFimChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>
  );
};
