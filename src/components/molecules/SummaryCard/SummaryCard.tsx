import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue';
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  className = '',
}) => {
  const colorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };

  const iconBgClasses = {
    green: 'bg-green-100',
    red: 'bg-red-100',
    blue: 'bg-blue-100',
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
};
