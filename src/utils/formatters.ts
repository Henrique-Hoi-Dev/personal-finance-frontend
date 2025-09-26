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
