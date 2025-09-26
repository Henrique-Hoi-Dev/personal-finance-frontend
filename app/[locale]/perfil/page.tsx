'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { User, UserProfile } from '@/types/auth';
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
  const router = useRouter();
  const { user, logout, loading } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  console.log('user', user);
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/pt/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      toast.success('Alterações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoChange = (file: File) => {
    console.log('Arquivo selecionado:', file);
    toast.success('Foto selecionada com sucesso!');
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
                Gerencie suas informações pessoais e preferências
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
                  />
                )}
              </div>

              {/* Right Column - Settings Cards */}
              <div className="lg:col-span-2 space-y-6">
                {user && <PersonalInfoCard user={user as UserProfile} />}
                <SecurityCard />
                <PreferencesCard />
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
                  <span>Salvar Alterações</span>
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
                  <span>Sair</span>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
