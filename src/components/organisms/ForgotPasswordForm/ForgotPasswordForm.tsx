'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BaseButton, BaseLabel, BaseInput } from '@/components/atoms';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { requestForgotPassword } from '@/services/auth.service';

type Step = 'email' | 'code';

export const ForgotPasswordForm: React.FC = () => {
  const t = useTranslations('ForgotPassword');
  const params = useParams();
  const locale = (params?.locale as string) || 'pt';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await requestForgotPassword(email.trim());
      setStep('code');
      toast.success(t('emailSent'));
    } catch (err: any) {
      toast.error(err?.message || t('errorSend'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-16 px-12 shadow-lg rounded-lg w-full max-w-xl">
      {step === 'email' && (
        <form className="space-y-8" onSubmit={handleSubmitEmail}>
          <div>
            <BaseLabel
              htmlFor="email"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              {t('emailLabel')} *
            </BaseLabel>
            <BaseInput
              id="email"
              name="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
            <p className="mt-2 text-sm text-gray-500">{t('emailHint')}</p>
          </div>
          <div className="pt-6">
            <BaseButton
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {t('submit')}
            </BaseButton>
          </div>
        </form>
      )}

      {step === 'code' && (
        <div className="space-y-6">
          <p className="text-base text-gray-600">{t('codeSentHint')}</p>
          <div>
            <BaseLabel
              htmlFor="code"
              className="block text-base font-semibold text-gray-700 mb-2"
            >
              {t('codeLabel')}
            </BaseLabel>
            <BaseInput
              id="code"
              name="code"
              type="text"
              placeholder={t('codePlaceholder')}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
          <p className="text-sm text-gray-500">{t('codeHint')}</p>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href={`/${locale}/login`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  );
};
