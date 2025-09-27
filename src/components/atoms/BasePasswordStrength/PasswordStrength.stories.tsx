import React, { useState } from 'react';
import { BasePasswordStrength } from './BasePasswordStrength';

const meta = {
  title: 'Atoms/PasswordStrength',
  component: BasePasswordStrength,
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
        placeholder="Enter your password"
        className="w-full p-3 border border-gray-300 rounded-md mb-4"
      />
      <BasePasswordStrength password={password} />
    </div>
  );
};

export const WeakPassword = () => <BasePasswordStrength password="123" />;

export const MediumPassword = () => (
  <BasePasswordStrength password="password123" />
);

export const StrongPassword = () => (
  <BasePasswordStrength password="MyStr0ng!Pass" />
);

export const WithoutText = () => (
  <BasePasswordStrength password="MyStr0ng!Pass" showText={false} />
);

export const AllLevels = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Fraca</h3>
      <BasePasswordStrength password="123" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Média</h3>
      <BasePasswordStrength password="password123" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Boa</h3>
      <BasePasswordStrength password="Password123" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Senha Forte</h3>
      <BasePasswordStrength password="MyStr0ng!Pass" />
    </div>
  </div>
);
