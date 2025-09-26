import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { isTokenExpired } from '@/utils/jwt';

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (store.token && isTokenExpired(store.token)) {
      console.warn('Token expirado detectado no hook useAuth');
      store.forceLogout();
    }
  }, [store]);

  return {
    ...store,
    isHydrated,
  };
};
