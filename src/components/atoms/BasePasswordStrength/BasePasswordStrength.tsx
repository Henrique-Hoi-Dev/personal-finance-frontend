import React from 'react';

interface BasePasswordStrengthProps {
  password: string;
  className?: string;
  showText?: boolean;
}

export const BasePasswordStrength: React.FC<BasePasswordStrengthProps> = ({
  password,
  className = '',
  showText = true,
}) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Pontuação baseada nos critérios
    if (checks.length) score += 1;
    if (checks.lowercase) score += 1;
    if (checks.uppercase) score += 1;
    if (checks.numbers) score += 1;
    if (checks.symbols) score += 1;

    return { score, checks };
  };

  const { score, checks } = calculateStrength(password);
  const percentage = (score / 5) * 100;

  const getStrengthLevel = () => {
    if (score <= 2) return { level: 'Fraca', color: 'bg-red-500' };
    if (score <= 3) return { level: 'Média', color: 'bg-yellow-500' };
    if (score <= 4) return { level: 'Boa', color: 'bg-blue-500' };
    if (score === 5) return { level: 'Forte', color: 'bg-green-500' };
    return { level: 'Boa', color: 'bg-blue-500' };
  };

  const { level, color } = getStrengthLevel();

  const getBarColor = (index: number) => {
    if (index < score) {
      if (score <= 2) return 'bg-red-500';
      if (score <= 3) return 'bg-yellow-500';
      if (score <= 4) return 'bg-blue-500';
      if (score === 5) return 'bg-green-500';
      return 'bg-blue-500';
    }
    return 'bg-gray-200';
  };

  const getCheckIcon = (isValid: boolean) => {
    return isValid ? (
      <svg
        className="w-4 h-4 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  if (!password) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Força da senha
          </span>
          {showText && (
            <span
              className={`text-sm font-semibold ${
                score <= 2
                  ? 'text-red-600'
                  : score <= 3
                  ? 'text-yellow-600'
                  : score <= 4
                  ? 'text-blue-600'
                  : score === 5
                  ? 'text-green-600'
                  : 'text-blue-600'
              }`}
            >
              {level}
            </span>
          )}
        </div>

        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${getBarColor(
                index
              )}`}
            />
          ))}
        </div>
      </div>

      {/* Critérios de validação */}
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Critérios:</div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center space-x-2">
            {getCheckIcon(checks.length)}
            <span
              className={`text-sm ${
                checks.length ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Pelo menos 8 caracteres
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getCheckIcon(checks.lowercase)}
            <span
              className={`text-sm ${
                checks.lowercase ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Letra minúscula
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getCheckIcon(checks.uppercase)}
            <span
              className={`text-sm ${
                checks.uppercase ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Letra maiúscula
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getCheckIcon(checks.numbers)}
            <span
              className={`text-sm ${
                checks.numbers ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Número
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {getCheckIcon(checks.symbols)}
            <span
              className={`text-sm ${
                checks.symbols ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              Símbolo especial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
