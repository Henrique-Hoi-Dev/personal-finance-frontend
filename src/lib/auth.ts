import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BaseLoading } from '@/components/atoms';
import { useAuthStore } from '@/store/auth.store';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedPage(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
      // Verifica se está autenticado e se o token é válido
      if (!isAuthenticated) {
        router.push('/pt/login');
        return;
      }

      setLoading(false);
    }, [isAuthenticated, router]);

    if (loading) return React.createElement(BaseLoading);
    return React.createElement(Component as any, props as any);
  };
}
