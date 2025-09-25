import React, { useState } from 'react';
import { PasswordStrength } from './PasswordStrength';

const meta = {
  title: 'Atoms/PasswordStrength',
  component: PasswordStrength,
};

export default meta;

export const Default = () => {
  const [password, setPassword] = useState('');

  return (
    <div className="max-w-md">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite sua senha"
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
      />
      <PasswordStrength password={password} />
    </div>
  );
};

export const WeakPassword = () => <PasswordStrength password="123" />;

export const MediumPassword = () => <PasswordStrength password="password123" />;

export const StrongPassword = () => (
  <PasswordStrength password="MyStr0ng!Pass" />
);

export const WithoutText = () => (
  <PasswordStrength password="MyStr0ng!Pass" showText={false} />
);

export const AllLevels = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Fraca</h3>
      <PasswordStrength password="123" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Média</h3>
      <PasswordStrength password="password123" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Boa</h3>
      <PasswordStrength password="Password123" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Forte</h3>
      <PasswordStrength password="MyStr0ng!Pass" />
    </div>
  </div>
);
