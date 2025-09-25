import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['pt', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt';

// helper simples
export function isSupportedLocale(l: string): l is Locale {
  return (locales as readonly string[]).includes(l);
}

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !isSupportedLocale(locale)) {
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default,
    };
  }

  return {
    locale: locale as Locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
