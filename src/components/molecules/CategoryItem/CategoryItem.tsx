import React from 'react';

interface CategoryItemProps {
  name: string;
  amount: string;
  color: string;
  percentage: number;
  className?: string;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  name,
  amount,
  color,
  percentage,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex items-center space-x-3 flex-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-sm text-gray-700">{name}</span>
      </div>
      <div className="flex items-center space-x-3 flex-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          ></div>
        </div>
        <span className="text-sm font-medium text-gray-900 w-20 text-right">
          {amount}
        </span>
      </div>
    </div>
  );
};
