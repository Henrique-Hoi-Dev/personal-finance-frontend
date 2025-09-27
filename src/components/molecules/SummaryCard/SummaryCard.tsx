import React from 'react';
import { useCurrency } from '@/hooks/useCurrency';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'purple' | 'orange' | 'pink';
  className?: string;
  formatAsCurrency?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  className = '',
  formatAsCurrency = false,
}) => {
  const { formatCurrency } = useCurrency();

  const displayValue =
    formatAsCurrency && typeof value === 'number'
      ? formatCurrency(value)
      : value.toString();
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
  };

  const iconBgClasses = {
    green: 'bg-green-100',
    red: 'bg-red-100',
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    pink: 'bg-pink-100',
  };

  const isCentered = className.includes('text-center');

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}
    >
      {isCentered ? (
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>{icon}</div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>
              {displayValue}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>
              {displayValue}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${iconBgClasses[color]} ml-4`}>
            {icon}
          </div>
        </div>
      )}
    </div>
  );
};
