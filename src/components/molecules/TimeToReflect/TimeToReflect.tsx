import React from 'react';
import { useTranslations } from 'next-intl';

interface ReflectionCard {
  question: string;
  answer: string;
}

interface TimeToReflectProps {
  cards: ReflectionCard[];
}

export const TimeToReflect: React.FC<TimeToReflectProps> = ({ cards }) => {
  const t = useTranslations('Dashboard');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {t('timeToReflect')}
        </h2>
      </div>

      {/* Reflection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {card.question}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {card.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

