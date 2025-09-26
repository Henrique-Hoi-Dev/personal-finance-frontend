import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated,
  };
};
