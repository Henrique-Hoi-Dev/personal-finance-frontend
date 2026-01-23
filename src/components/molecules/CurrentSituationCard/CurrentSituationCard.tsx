import React from 'react';
import { useTranslations } from 'next-intl';

interface CurrentSituationCardProps {
  title: string;
  value: string;
  change?: {
    amount: string;
    percentage: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  warning?: string;
  trend?: 'up' | 'down';
}

export const CurrentSituationCard: React.FC<CurrentSituationCardProps> = ({
  title,
  value,
  change,
  icon,
  warning,
  trend,
}) => {
  const t = useTranslations('Dashboard');
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      );
    }
    return null;
  };

  const getChangeColor = () => {
    if (!change) return '';
    return change.isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return '';
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100 shadow-sm relative">
      {/* Top Right Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Warning Icon */}
        {warning && (
          <div className="bg-yellow-400 rounded-full p-1.5">
            <svg
              className="w-5 h-5 text-yellow-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        )}

        {/* Percentage Badge */}
        {change && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-semibold">{change.percentage}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      {change && (
        <div className="flex items-center gap-2 mb-2">
          <div className={`flex items-center gap-1 ${getChangeColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {change.isPositive ? '+' : ''}
              {change.amount}
            </span>
          </div>
          <span className="text-sm text-gray-500">{t('vsLastMonth')}</span>
        </div>
      )}

      {warning && (
        <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-md p-3">
          <p className="text-sm text-yellow-800 font-medium">{warning}</p>
        </div>
      )}
    </div>
  );
};

