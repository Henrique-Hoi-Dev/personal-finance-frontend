'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import {
  UpdateProfilePayload,
  PreferredLanguage,
  CurrencyCode,
} from '@/types/auth';
import { UserProfile } from '@/types/auth';
import { useLanguage } from '@/hooks/useLanguage';
import { BaseButton, BaseLoading } from '@/components/atoms';
import {
  ProfileCard,
  PersonalInfoCard,
  SecurityCard,
  PreferencesCard,
} from '@/components/molecules';
import { DashboardLayout } from '@/components/templates';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { toast } from 'sonner';

export default function PerfilPage() {
  const t = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const {
    user,
    logout,
    loading,
    updateProfile,
    updateAvatar,
    changePassword,
    loadAvatar,
  } = useAuthStore();
  const { changeLanguage, mapPreferredLanguageToLocale } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<{
    name: string;
    email: string;
    default_currency: CurrencyCode;
    preferred_language: PreferredLanguage;
  } | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Inicializa personalInfo com os valores atuais do usuário
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: (user as UserProfile).name,
        email: (user as UserProfile).email,
        default_currency: (user as UserProfile).defaultCurrency as CurrencyCode,
        preferred_language: (user as UserProfile)
          .preferredLanguage as PreferredLanguage,
      });
    }
  }, [user]);

  // Carrega o avatar quando a página carrega
  useEffect(() => {
    if (user && !avatarLoading) {
      setAvatarLoading(true);
      loadAvatar()
        .catch(() => {
          // Ignora erro se não conseguir carregar avatar
        })
        .finally(() => {
          setAvatarLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Só depende do ID do usuário

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/pt/login');
    } catch (error) {
      toast.error(tCommon('messages.logoutError'));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // 1) Atualiza perfil (name/email/currency/language)
      const toSend =
        personalInfo ||
        (user
          ? {
              name: (user as UserProfile).name,
              email: (user as UserProfile).email,
              default_currency: (user as UserProfile)
                .defaultCurrency as CurrencyCode,
              preferred_language: (user as UserProfile)
                .preferredLanguage as PreferredLanguage,
            }
          : null);
      if (toSend) {
        await updateProfile(toSend);

        // 3) Verifica se o idioma mudou e atualiza a URL
        if (
          user &&
          toSend.preferred_language !== (user as UserProfile).preferredLanguage
        ) {
          // Usa o mapeamento correto do hook useLanguage
          const newLocale = mapPreferredLanguageToLocale(
            toSend.preferred_language
          );
          await changeLanguage(newLocale);
          return;
        }
      }

      // 2) Atualiza avatar separadamente, se selecionado
      if (avatarFile) {
        await updateAvatar(avatarFile);
        if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
        setAvatarPreviewUrl(null);
        setAvatarFile(null);
        toast.success(t('avatarUpdated'));
      } else {
        toast.success(tCommon('messages.changesSaved'));
      }
    } catch (error) {
      toast.error(tCommon('messages.errorSaving'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = (file: File) => {
    if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    const url = URL.createObjectURL(file);
    setAvatarPreviewUrl(url);
    setAvatarFile(file);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-64">
            <BaseLoading />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="mt-2 text-gray-600">
                {tCommon('messages.managePersonalInfo')}
              </p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                {user && (
                  <ProfileCard
                    user={user as UserProfile}
                    onPhotoChange={handlePhotoChange}
                    previewUrl={avatarPreviewUrl || undefined}
                  />
                )}
              </div>

              {/* Right Column - Settings Cards */}
              <div className="lg:col-span-2 space-y-6">
                {user && (
                  <PersonalInfoCard
                    user={user as UserProfile}
                    onChange={(data) =>
                      setPersonalInfo((prev) => ({
                        name: data.name,
                        email: data.email,
                        default_currency:
                          prev?.default_currency ??
                          ((user as UserProfile)
                            .defaultCurrency as CurrencyCode),
                        preferred_language:
                          prev?.preferred_language ??
                          (((user as UserProfile).preferredLanguage === 'pt-BR'
                            ? 'pt-BR'
                            : 'en-US') as PreferredLanguage),
                      }))
                    }
                    loading={isSaving}
                  />
                )}
                <SecurityCard
                  onPasswordChange={async (currentPassword, newPassword) => {
                    setIsSaving(true);
                    try {
                      await changePassword({ currentPassword, newPassword });
                      toast.success(t('passwordUpdated'));
                    } catch (err) {
                      toast.error(t('errorSaving'));
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  loading={isSaving}
                />
                {user && (
                  <PreferencesCard
                    user={user as UserProfile}
                    onChange={(data) =>
                      setPersonalInfo((prev) => ({
                        name: prev?.name ?? (user as UserProfile).name,
                        email: prev?.email ?? (user as UserProfile).email,
                        default_currency: data.currency,
                        preferred_language: data.language,
                      }))
                    }
                    loading={isSaving}
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex justify-end">
              <div className="w-[757px] mt-8 flex justify-start space-x-4">
                <BaseButton
                  variant="primary"
                  onClick={handleSaveChanges}
                  loading={isSaving}
                  className="h-8 flex items-center space-x-2"
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span>{tCommon('saveChanges')}</span>
                </BaseButton>

                <BaseButton
                  variant="secondary"
                  onClick={handleLogout}
                  loading={loading}
                  className="h-8 flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>{tCommon('logout')}</span>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
