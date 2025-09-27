import React, { useState } from 'react';
import { BasePasswordStrength } from './BasePasswordStrength';

export const PasswordStrengthExample: React.FC = () => {
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Exemplo de Força da Senha
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <BasePasswordStrength password={password} />
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Critérios para senha forte:
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Pelo menos 8 caracteres</li>
          <li>• Letra minúscula (a-z)</li>
          <li>• Letra maiúscula (A-Z)</li>
          <li>• Número (0-9)</li>
          <li>• Símbolo especial (!@#$%^&*)</li>
        </ul>
      </div>
    </div>
  );
};
