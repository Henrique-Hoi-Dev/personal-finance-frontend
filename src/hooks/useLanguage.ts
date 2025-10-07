import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Locale } from '@/i18n';
import { PreferredLanguage } from '@/types/auth';

// Mapeia PreferredLanguage para Locale
const mapPreferredLanguageToLocale = (
  preferredLanguage: PreferredLanguage
): Locale => {
  const mapping: Record<PreferredLanguage, Locale> = {
    [PreferredLanguage.PT_BR]: 'pt',
    [PreferredLanguage.EN_US]: 'en',
    [PreferredLanguage.ES_ES]: 'es',
    [PreferredLanguage.FR_FR]: 'fr',
    [PreferredLanguage.DE_DE]: 'de',
    [PreferredLanguage.IT_IT]: 'it',
    [PreferredLanguage.JA_JP]: 'ja',
    [PreferredLanguage.KO_KR]: 'ko',
    [PreferredLanguage.ZH_CN]: 'zh',
    [PreferredLanguage.RU_RU]: 'ru',
  };
  return mapping[preferredLanguage] || 'pt';
};

// Mapeia Locale para PreferredLanguage
const mapLocaleToPreferredLanguage = (locale: Locale): PreferredLanguage => {
  const mapping: Record<Locale, PreferredLanguage> = {
    pt: PreferredLanguage.PT_BR,
    en: PreferredLanguage.EN_US,
    es: PreferredLanguage.ES_ES,
    fr: PreferredLanguage.FR_FR,
    de: PreferredLanguage.DE_DE,
    it: PreferredLanguage.IT_IT,
    ja: PreferredLanguage.JA_JP,
    ko: PreferredLanguage.KO_KR,
    zh: PreferredLanguage.ZH_CN,
    ru: PreferredLanguage.RU_RU,
  };
  return mapping[locale] || PreferredLanguage.PT_BR;
};

export const useLanguage = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const changeLanguage = async (newLanguage: Locale) => {
    try {
      const currentLocale = pathname.split('/')[1] as Locale;

      const newPath = pathname.replace(`/${currentLocale}`, `/${newLanguage}`);
      window.location.href = newPath;
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  const getCurrentLanguage = (): Locale => {
    if (typeof window === 'undefined') return 'pt';

    const pathLocale = pathname.split('/')[1] as Locale;
    const supportedLocales: Locale[] = [
      'pt',
      'en',
      'es',
      'fr',
      'de',
      'it',
      'ja',
      'ko',
      'zh',
      'ru',
    ];
    return supportedLocales.includes(pathLocale) ? pathLocale : 'pt';
  };

  const getUserPreferredLocale = (): Locale => {
    if (!user?.preferredLanguage) return 'pt';
    return mapPreferredLanguageToLocale(
      user.preferredLanguage as PreferredLanguage
    );
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    getUserPreferredLocale,
    currentLanguage: getCurrentLanguage(),
    userLanguage: user?.preferredLanguage || 'pt-BR',
    userPreferredLocale: getUserPreferredLocale(),
    mapPreferredLanguageToLocale,
    mapLocaleToPreferredLanguage,
  };
};
