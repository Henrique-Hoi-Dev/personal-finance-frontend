/**
 * Utilitários para formatação de dados
 */

/**
 * Formata um CPF com máscara (xxx.xxx.xxx-xx)
 * @param value - Valor a ser formatado
 * @returns CPF formatado
 */
export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);
};

/**
 * Remove a máscara do CPF, deixando apenas números
 * @param cpf - CPF com ou sem máscara
 * @returns CPF apenas com números
 */
export const removeCPFMask = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Valida se o CPF tem 11 dígitos
 * @param cpf - CPF sem máscara
 * @returns true se válido, false caso contrário
 */
export const isValidCPFLength = (cpf: string): boolean => {
  const cleanCPF = removeCPFMask(cpf);
  return cleanCPF.length === 11;
};

/**
 * Formata um valor monetário (R$ 1.234,56)
 * @param value - Valor numérico
 * @returns Valor formatado como moeda
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um valor monetário baseado na moeda preferida do usuário
 * @param value - Valor numérico
 * @param currency - Código da moeda (BRL, USD, EUR)
 * @param locale - Locale para formatação (pt-BR, en-US, etc.)
 * @returns Valor formatado como moeda
 */
export const formatCurrencyByPreference = (
  value: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string => {
  const currencyMap: Record<string, string> = {
    BRL: 'BRL',
    USD: 'USD',
    EUR: 'EUR',
  };

  const localeMap: Record<string, string> = {
    pt: 'pt-BR',
    en: 'en-US',
  };

  const actualCurrency = currencyMap[currency] || 'BRL';
  const actualLocale = localeMap[locale] || 'pt-BR';

  return new Intl.NumberFormat(actualLocale, {
    style: 'currency',
    currency: actualCurrency,
  }).format(value);
};

/**
 * Converte centavos para reais e formata como moeda brasileira
 * @param cents - Valor em centavos
 * @returns Valor formatado como moeda (ex: "R$ 1.234,56")
 */
export const formatCurrencyFromCents = (cents: number): string => {
  const reais = cents / 100;
  return formatCurrency(reais);
};

/**
 * Formata um número com separadores de milhares
 * @param value - Valor numérico
 * @returns Número formatado
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param date - Data a ser formatada
 * @returns Data formatada
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Formata uma data evitando problemas de timezone
 * @param dateString - String da data no formato ISO ou YYYY-MM-DD
 * @returns Data formatada no padrão brasileiro (dd/mm/aaaa)
 */
export const formatDateSafe = (dateString: string): string => {
  // Se a data já está no formato dd/mm/yyyy, retorna como está
  if (dateString.includes('/')) {
    return dateString;
  }
  
  // Para datas ISO ou YYYY-MM-DD, cria a data localmente
  const date = new Date(dateString + 'T00:00:00');
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return dateString; // Retorna a string original se inválida
  }
  
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

/**
 * Formata um valor monetário simples (R$ 1.234,56)
 * @param amount - Valor numérico
 * @returns Valor formatado como moeda brasileira
 */
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

/**
 * Retorna a cor CSS baseada no valor (verde para positivo, vermelho para negativo)
 * @param amount - Valor numérico
 * @returns Classe CSS para cor
 */
export const getAmountColor = (amount: number): string => {
  return amount >= 0 ? 'text-green-600' : 'text-red-600';
};

/**
 * Converte o tipo de conta para label em português
 * @param type - Tipo da conta
 * @returns Label em português
 */
export const getAccountTypeLabel = (type: string): string => {
  if (!type) return 'Outro';

  switch (type.toUpperCase()) {
    case 'FIXED':
      return 'Fixa';
    case 'LOAN':
      return 'Empréstimo';
    case 'CREDIT_CARD':
      return 'Cartão de Crédito';
    case 'SUBSCRIPTION':
      return 'Assinatura';
    case 'OTHER':
      return 'Outro';
    default:
      return 'Outro';
  }
};
