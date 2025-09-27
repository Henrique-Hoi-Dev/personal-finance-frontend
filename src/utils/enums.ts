export const accountTypes = [
  { value: 'FIXED', label: 'Fixa' },
  { value: 'LOAN', label: 'Empréstimo' },
  { value: 'CREDIT_CARD', label: 'Cartão de Crédito' },
  { value: 'SUBSCRIPTION', label: 'Assinatura' },
  { value: 'OTHER', label: 'Outro' },
];

// Transaction Categories Enum
export enum TransactionCategory {
  // EXPENSE Categories
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  RENT = 'RENT',
  HEALTH = 'HEALTH',
  ACCOUNT_PAYMENT = 'ACCOUNT_PAYMENT',
  INSTALLMENT_PAYMENT = 'INSTALLMENT_PAYMENT',

  // INCOME Categories
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  INVESTMENT = 'INVESTMENT',
  REFUND = 'REFUND',
  OTHER = 'OTHER',
}

// Transaction Types
export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

// Category translations and metadata
export const transactionCategories = {
  // EXPENSE Categories
  [TransactionCategory.FOOD]: {
    name: 'FOOD',
    pt: 'Alimentação',
    en: 'Food',
    type: TransactionType.EXPENSE,
    description: 'Gastos com comida, restaurantes e supermercado',
  },
  [TransactionCategory.TRANSPORT]: {
    name: 'TRANSPORT',
    pt: 'Transporte',
    en: 'Transport',
    type: TransactionType.EXPENSE,
    description: 'Gastos com transporte público, gasolina, uber, etc.',
  },
  [TransactionCategory.ENTERTAINMENT]: {
    name: 'ENTERTAINMENT',
    pt: 'Entretenimento',
    en: 'Entertainment',
    type: TransactionType.EXPENSE,
    description: 'Cinema, shows, jogos, hobbies, etc.',
  },
  [TransactionCategory.RENT]: {
    name: 'RENT',
    pt: 'Moradia',
    en: 'Rent',
    type: TransactionType.EXPENSE,
    description: 'Aluguel, condomínio, IPTU, etc.',
  },
  [TransactionCategory.HEALTH]: {
    name: 'HEALTH',
    pt: 'Saúde',
    en: 'Health',
    type: TransactionType.EXPENSE,
    description: 'Médicos, remédios, plano de saúde, etc.',
  },
  [TransactionCategory.ACCOUNT_PAYMENT]: {
    name: 'ACCOUNT_PAYMENT',
    pt: 'Pagamento de Contas',
    en: 'Account Payment',
    type: TransactionType.EXPENSE,
    description: 'Contas de luz, água, internet, telefone, etc.',
  },
  [TransactionCategory.INSTALLMENT_PAYMENT]: {
    name: 'INSTALLMENT_PAYMENT',
    pt: 'Pagamento de Parcelas',
    en: 'Installment Payment',
    type: TransactionType.EXPENSE,
    description: 'Pagamento de parcelas de compras, financiamentos, etc.',
  },

  // INCOME Categories
  [TransactionCategory.SALARY]: {
    name: 'SALARY',
    pt: 'Salário',
    en: 'Salary',
    type: TransactionType.INCOME,
    description: 'Salário mensal, 13º salário, férias',
  },
  [TransactionCategory.FREELANCE]: {
    name: 'FREELANCE',
    pt: 'Freelance',
    en: 'Freelance',
    type: TransactionType.INCOME,
    description: 'Trabalhos freelancer, projetos extras',
  },
  [TransactionCategory.INVESTMENT]: {
    name: 'INVESTMENT',
    pt: 'Investimentos',
    en: 'Investment',
    type: TransactionType.INCOME,
    description: 'Rendimentos de investimentos, dividendos',
  },
  [TransactionCategory.REFUND]: {
    name: 'REFUND',
    pt: 'Reembolso',
    en: 'Refund',
    type: TransactionType.INCOME,
    description: 'Reembolsos, devoluções de compras',
  },
  [TransactionCategory.OTHER]: {
    name: 'OTHER',
    pt: 'Outros',
    en: 'Other',
    type: TransactionType.INCOME,
    description: 'Outras receitas não categorizadas',
  },
};

// Helper functions
export const getCategoryLabel = (
  category: TransactionCategory,
  locale: 'pt' | 'en' = 'pt'
): string => {
  return transactionCategories[category]?.[locale] || category;
};

export const getCategoryDescription = (
  category: TransactionCategory
): string => {
  return transactionCategories[category]?.description || '';
};

export const getCategoryType = (
  category: TransactionCategory
): TransactionType => {
  return transactionCategories[category]?.type || TransactionType.EXPENSE;
};

export const getCategoriesByType = (
  type: TransactionType
): TransactionCategory[] => {
  return Object.values(TransactionCategory).filter(
    (category) => getCategoryType(category) === type
  );
};

export const getExpenseCategories = (): TransactionCategory[] => {
  return getCategoriesByType(TransactionType.EXPENSE);
};

export const getIncomeCategories = (): TransactionCategory[] => {
  return getCategoriesByType(TransactionType.INCOME);
};

// Month options for date filters
export const monthOptions = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

// Year options for date filters
export const generateYearOptions = (): Array<{
  value: string;
  label: string;
}> => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 2; i++) {
    years.push({ value: i.toString(), label: i.toString() });
  }
  return years;
};
