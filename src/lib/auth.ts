import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BaseLoading } from '@/components/atoms';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedPage(props: P) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/pt/login'); // redireciona se não tiver token
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) return React.createElement(BaseLoading);
    return React.createElement(Component as any, props as any);
  };
}
