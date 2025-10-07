import React, { useRef } from 'react';
import { UserProfile } from '@/types/auth';
import { BaseLabel } from '@/components/atoms';
import { useTranslations } from 'next-intl';

interface ProfileCardProps {
  user: UserProfile;
  onPhotoChange?: (file: File) => void;
  previewUrl?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onPhotoChange,
  previewUrl,
}) => {
  const tCommon = useTranslations('Common');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoChange) {
      onPhotoChange(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden">
          {previewUrl || user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl || (user.avatarUrl as string)}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-16 h-16 text-gray-400"
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
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Change Photo Button */}
        <button
          onClick={handleButtonClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{tCommon('changePhoto')}</span>
        </button>
      </div>

      {/* User Info Form */}
      <div className="space-y-4">
        <div>
          <BaseLabel>{tCommon('fullName')}</BaseLabel>
          <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
            {user?.name || '-'}
          </div>
        </div>

        <div>
          <BaseLabel>{tCommon('email')}</BaseLabel>
          <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
            {user?.email || '-'}
          </div>
        </div>
      </div>
    </div>
  );
};
