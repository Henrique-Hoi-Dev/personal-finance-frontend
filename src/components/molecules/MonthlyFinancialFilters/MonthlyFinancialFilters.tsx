import React from 'react';
import { useTranslations } from 'next-intl';
import { BaseInput, BaseSelectWithClear } from '@/components/atoms';
import { generateYearOptions, monthOptions } from '@/utils/enums';
import { useEnumOptions } from '@/hooks';
import { MonthlyFinancialFiltersProps } from '@/types/monthly-financial';

export const MonthlyFinancialFilters: React.FC<
  MonthlyFinancialFiltersProps
> = ({
  year,
  month,
  nome,
  tipo,
  isPaid,
  onYearChange,
  onMonthChange,
  onNomeChange,
  onTipoChange,
  onIsPaidChange,
}) => {
  const t = useTranslations('MonthlyFinancial');
  const tContas = useTranslations('Contas');

  const yearOptions = generateYearOptions();
  const monthOptionsList = [
    { value: '', label: t('allMonths') },
    ...monthOptions,
  ];

  const tipoOptions = useEnumOptions(
    {
      FIXED: 'FIXED',
      LOAN: 'LOAN',
      CREDIT_CARD: 'CREDIT_CARD',
      SUBSCRIPTION: 'SUBSCRIPTION',
      OTHER: 'OTHER',
    },
    {
      FIXED: tContas('accountTypes.FIXED'),
      LOAN: tContas('accountTypes.LOAN'),
      CREDIT_CARD: tContas('accountTypes.CREDIT_CARD'),
      SUBSCRIPTION: tContas('accountTypes.SUBSCRIPTION'),
      OTHER: tContas('accountTypes.OTHER'),
    }
  );

  const statusOptions = useEnumOptions(
    {
      '': '',
      true: 'true',
      false: 'false',
    },
    {
      '': tContas('all'),
      true: tContas('paid'),
      false: tContas('unpaid'),
    }
  );

  const handleYearChange = (value: string | number) => {
    const yearValue = typeof value === 'string' ? parseInt(value) : value;
    onYearChange(yearValue);
  };

  const handleMonthChange = (value: string | number) => {
    if (value === '' || value === null || value === undefined) {
      onMonthChange(undefined);
    } else {
      const monthValue = typeof value === 'string' ? parseInt(value) : value;
      onMonthChange(monthValue);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Filtro por Nome */}
        <div>
          <BaseInput
            type="text"
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
            placeholder={tContas('searchByName')}
            className="w-full h-10"
          />
        </div>

        {/* Filtro por Tipo */}
        <div>
          <BaseSelectWithClear
            value={tipo}
            onChange={(value) => onTipoChange(value as string)}
            options={tipoOptions}
            label={tContas('type')}
            showClearButton={true}
          />
        </div>

        {/* Filtro por Status de Pagamento */}
        <div>
          <BaseSelectWithClear
            value={isPaid}
            onChange={(value) => onIsPaidChange(value as string)}
            options={statusOptions}
            label={tContas('paymentStatus')}
            showClearButton={true}
          />
        </div>

        {/* Filtro por Ano */}
        <div>
          <BaseSelectWithClear
            label={t('selectYear')}
            value={year.toString()}
            onChange={handleYearChange}
            options={yearOptions}
            placeholder={t('selectYear')}
            showClearButton={true}
          />
        </div>

        {/* Filtro por Mês */}
        <div>
          <BaseSelectWithClear
            label={t('selectMonth')}
            value={month || ''}
            onChange={handleMonthChange}
            options={monthOptionsList}
            placeholder={t('selectMonth')}
            showClearButton={true}
          />
        </div>
      </div>
    </div>
  );
};
