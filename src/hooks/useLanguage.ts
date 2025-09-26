import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Locale } from '@/i18n';

export const useLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, updatePreferences } = useAuthStore();

  const changeLanguage = async (newLanguage: Locale) => {
    try {
      // Update user preferences in the backend
      await updatePreferences({ preferredLanguage: newLanguage });

      // Get current locale from pathname
      const currentLocale = pathname.split('/')[1] as Locale;

      // Replace the locale in the current path
      const newPath = pathname.replace(`/${currentLocale}`, `/${newLanguage}`);

      // Navigate to the new path with the new locale
      router.push(newPath);

      // Force a page refresh to reload with new locale
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  const getCurrentLanguage = (): Locale => {
    if (typeof window === 'undefined') return 'pt';

    const pathLocale = pathname.split('/')[1] as Locale;
    return pathLocale === 'pt' || pathLocale === 'en' ? pathLocale : 'pt';
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    currentLanguage: getCurrentLanguage(),
    userLanguage: user?.preferredLanguage || 'pt',
  };
};
