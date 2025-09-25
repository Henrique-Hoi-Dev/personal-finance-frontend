/**
 * Utilitários para validação de dados
 */

/**
 * Valida se o CPF é válido usando o algoritmo oficial
 * @param cpf - CPF com ou sem máscara
 * @returns true se válido, false caso contrário
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

/**
 * Valida se o email é válido
 * @param email - Email a ser validado
 * @returns true se válido, false caso contrário
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se a senha atende aos critérios mínimos
 * @param password - Senha a ser validada
 * @returns true se válida, false caso contrário
 */
export const isValidPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula e 1 número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Valida se o valor é um número válido
 * @param value - Valor a ser validado
 * @returns true se válido, false caso contrário
 */
export const isValidNumber = (value: string | number): boolean => {
  return !isNaN(Number(value)) && isFinite(Number(value));
};
