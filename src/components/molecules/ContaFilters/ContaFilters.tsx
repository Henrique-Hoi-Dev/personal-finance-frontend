import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseInput, BaseSelectWithClear } from '@/components/atoms';
import { useEnumOptions } from '@/hooks';

interface ContaFiltersProps {
  tipo: string;
  nome: string;
  isPaid: string;
  onTipoChange: (tipo: string) => void;
  onNomeChange: (nome: string) => void;
  onIsPaidChange: (isPaid: string) => void;
}

export const ContaFilters: React.FC<ContaFiltersProps> = ({
  tipo,
  nome,
  isPaid,
  onTipoChange,
  onNomeChange,
  onIsPaidChange,
}) => {
  const t = useTranslations('Contas');

  const tipoOptions = useEnumOptions(
    {
      FIXED: 'FIXED',
      LOAN: 'LOAN',
      CREDIT_CARD: 'CREDIT_CARD',
      SUBSCRIPTION: 'SUBSCRIPTION',
      OTHER: 'OTHER',
    },
    {
      FIXED: t('accountTypes.FIXED'),
      LOAN: t('accountTypes.LOAN'),
      CREDIT_CARD: t('accountTypes.CREDIT_CARD'),
      SUBSCRIPTION: t('accountTypes.SUBSCRIPTION'),
      OTHER: t('accountTypes.OTHER'),
    }
  );

  const statusOptions = useEnumOptions(
    {
      '': '',
      true: 'true',
      false: 'false',
    },
    {
      '': t('all'),
      true: t('paid'),
      false: t('unpaid'),
    }
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center mb-4">
        <svg
          className="w-5 h-5 text-gray-500 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">{t('filters')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Filtro por Nome */}
        <div>
          <BaseInput
            type="text"
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
            placeholder={t('searchByName')}
            className="w-full h-10"
          />
        </div>

        {/* Filtro por Tipo */}
        <BaseSelectWithClear
          value={tipo}
          onChange={(value) => onTipoChange(value as string)}
          options={tipoOptions}
          label={t('type')}
          showClearButton={true}
        />

        {/* Filtro por Status de Pagamento */}
        <BaseSelectWithClear
          value={isPaid}
          onChange={(value) => onIsPaidChange(value as string)}
          options={statusOptions}
          label={t('paymentStatus')}
          showClearButton={true}
        />
      </div>
    </div>
  );
};
