import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BaseInput, BaseLabel, BaseButton } from '@/components/atoms';
import { PasswordField } from '@/components/molecules';

interface SecurityCardProps {
  onPasswordChange?: (currentPassword: string, newPassword: string) => void;
  loading?: boolean;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  onPasswordChange,
  loading = false,
}) => {
  const t = useTranslations('Profile');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePassword = () => {
    if (passwords.new !== passwords.confirm) {
      return;
    }

    if (onPasswordChange) {
      onPasswordChange(passwords.current, passwords.new);
    }

    setPasswords({ current: '', new: '', confirm: '' });
    setShowChangePassword(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{t('security')}</h3>
      </div>

      <div className="space-y-6">
        <div>
          <BaseLabel htmlFor="currentPassword">{t('password')}</BaseLabel>
          <div className="flex items-center justify-between space-x-3 mt-1">
            <div className="min-w-96 flex-1 max-w-52 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 font-mono">
              ••••••••
            </div>
            <BaseButton
              type="button"
              variant="secondary"
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-60 h-8"
            >
              {t('changePassword')}
            </BaseButton>
          </div>
        </div>

        {showChangePassword && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <PasswordField
                label={t('currentPassword')}
                value={passwords.current}
                onChange={(e) =>
                  handlePasswordChange('current', e.target.value)
                }
                placeholder={t('currentPasswordPlaceholder')}
                id="currentPasswordInput"
                name="currentPassword"
                autoComplete="current-password"
              />
            </div>

            <div>
              <PasswordField
                label={t('newPassword')}
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                placeholder={t('newPasswordPlaceholder')}
                id="newPassword"
                name="newPassword"
                autoComplete="new-password"
                showStrength={true}
              />
            </div>

            <div>
              <PasswordField
                label={t('confirmPassword')}
                value={passwords.confirm}
                onChange={(e) =>
                  handlePasswordChange('confirm', e.target.value)
                }
                placeholder={t('confirmPasswordPlaceholder')}
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
              />
            </div>

            <div className="flex space-x-3">
              <BaseButton
                type="button"
                variant="primary"
                onClick={handleSavePassword}
                loading={loading}
                fullWidth={false}
                className="h-8"
              >
                {t('savePassword')}
              </BaseButton>
              <BaseButton
                type="button"
                variant="secondary"
                onClick={() => setShowChangePassword(false)}
                fullWidth={false}
                className="h-8"
              >
                {t('cancel')}
              </BaseButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
