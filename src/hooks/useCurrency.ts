import { useAuthStore } from '@/store/auth.store';
import { formatCurrencyByPreference } from '@/utils/formatters';

export const useCurrency = () => {
  const { user } = useAuthStore();

  const formatCurrency = (value: number): string => {
    const currency = user?.defaultCurrency || 'BRL';
    const language = user?.preferredLanguage || 'pt';

    return formatCurrencyByPreference(value, currency, language);
  };

  const getCurrencySymbol = (): string => {
    const currency = user?.defaultCurrency || 'BRL';

    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'BRL':
      default:
        return 'R$';
    }
  };

  const getCurrencyCode = (): string => {
    return user?.defaultCurrency || 'BRL';
  };

  return {
    formatCurrency,
    getCurrencySymbol,
    getCurrencyCode,
    userCurrency: user?.defaultCurrency || 'BRL',
  };
};
