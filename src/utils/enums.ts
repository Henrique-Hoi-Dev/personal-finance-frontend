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
  UTILITIES = 'UTILITIES',
  EDUCATION = 'EDUCATION',
  SHOPPING = 'SHOPPING',

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
  [TransactionCategory.UTILITIES]: {
    name: 'UTILITIES',
    pt: 'Utilidades',
    en: 'Utilities',
    type: TransactionType.EXPENSE,
    description: 'Contas de luz, água, gás, internet, telefone, etc.',
  },
  [TransactionCategory.EDUCATION]: {
    name: 'EDUCATION',
    pt: 'Educação',
    en: 'Education',
    type: TransactionType.EXPENSE,
    description: 'Cursos, livros, material escolar, mensalidades, etc.',
  },
  [TransactionCategory.SHOPPING]: {
    name: 'SHOPPING',
    pt: 'Compras',
    en: 'Shopping',
    type: TransactionType.EXPENSE,
    description: 'Roupas, eletrônicos, produtos diversos, etc.',
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

  // Tipos de conta - adicionados para tradução
  FIXED: {
    name: 'FIXED',
    pt: 'Contas Fixas',
    en: 'Fixed Accounts',
    type: TransactionType.EXPENSE,
    description: 'Contas fixas como água, luz, internet, etc.',
  },
  FIXED_PREVIEW: {
    name: 'FIXED_PREVIEW',
    pt: 'Contas Variáveis',
    en: 'Variable Accounts',
    type: TransactionType.EXPENSE,
    description: 'Contas que variam mensalmente',
  },
  LOAN: {
    name: 'LOAN',
    pt: 'Empréstimos',
    en: 'Loans',
    type: TransactionType.EXPENSE,
    description: 'Empréstimos e financiamentos',
  },
  CREDIT_CARD: {
    name: 'CREDIT_CARD',
    pt: 'Cartão de Crédito',
    en: 'Credit Card',
    type: TransactionType.EXPENSE,
    description: 'Gastos com cartão de crédito',
  },
  SUBSCRIPTION: {
    name: 'SUBSCRIPTION',
    pt: 'Assinaturas',
    en: 'Subscriptions',
    type: TransactionType.EXPENSE,
    description: 'Assinaturas de serviços',
  },
};

// Helper functions
export const getCategoryLabel = (
  category: TransactionCategory | string,
  locale: 'pt' | 'en' = 'pt'
): string => {
  return (
    transactionCategories[category as TransactionCategory]?.[locale] || category
  );
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

// Category color mapping - matches backend enums
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    // Categorias de transação tradicionais
    FOOD: '#ef4444', // red
    TRANSPORT: '#3b82f6', // blue
    ENTERTAINMENT: '#8b5cf6', // purple
    RENT: '#f59e0b', // orange
    HEALTH: '#10b981', // green
    ACCOUNT_PAYMENT: '#6b7280', // gray
    INSTALLMENT_PAYMENT: '#6b7280', // gray
    UTILITIES: '#f59e0b', // orange
    EDUCATION: '#8b5cf6', // purple
    SHOPPING: '#ec4899', // pink
    OTHER: '#6b7280', // gray

    // Tipos de conta - cores mais específicas e atrativas
    FIXED: '#059669', // emerald-600 - contas fixas (água, luz)
    FIXED_PREVIEW: '#0891b2', // cyan-600 - contas variáveis
    LOAN: '#dc2626', // red-600 - empréstimos/financiamentos
    CREDIT_CARD: '#7c3aed', // violet-600 - cartão de crédito
    SUBSCRIPTION: '#ea580c', // orange-600 - assinaturas

    // Categorias de receita
    SALARY: '#10b981', // green
    FREELANCE: '#3b82f6', // blue
    INVESTMENT: '#8b5cf6', // purple
    REFUND: '#f59e0b', // orange
  };

  return colors[category] || '#6b7280'; // default gray
};
