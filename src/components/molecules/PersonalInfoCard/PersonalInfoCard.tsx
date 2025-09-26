import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BaseInput, BaseLabel } from '@/components/atoms';
import { User } from '@/types/auth';

interface PersonalInfoCardProps {
  user: User;
  onSave?: (data: { name: string; email: string }) => void;
  loading?: boolean;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  user,
  onSave,
  loading = false,
}) => {
  const t = useTranslations('Profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {t('personalInfo')}
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <BaseLabel htmlFor="name">{t('fullName')}</BaseLabel>
          <BaseInput
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={t('fullNamePlaceholder')}
            className="mt-1"
          />
        </div>

        <div>
          <BaseLabel htmlFor="email">{t('email')}</BaseLabel>
          <BaseInput
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('emailPlaceholder')}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
