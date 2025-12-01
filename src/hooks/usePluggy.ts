'use client';

import { useEffect, useState, useCallback } from 'react';
import { getConnectToken, saveItem } from '@/services/pluggy.service';
import { PluggyItem } from '@/types/pluggy';
import { usePluggyStore } from '@/store/pluggy.store';
import { createPluggyConnect, loadPluggySDK } from '@/lib/pluggy-client';
import { toast } from 'sonner';

/**
 * Hook para usar o Pluggy Connect SDK (via npm package)
 */
export function usePluggy() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem, setHasBankConnected } = usePluggyStore();

  // Tenta carregar o SDK quando o componente monta (apenas no client)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    loadPluggySDK()
      .then(() => {
        setIsSDKLoaded(true);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao carregar SDK do Pluggy:', err);
        setError('Erro ao carregar o SDK do Pluggy Connect');
      });
  }, []);

  /**
   * Abre o modal do Pluggy Connect para conectar um banco
   */
  const connectBank = useCallback(async () => {
    if (!isSDKLoaded) {
      const errorMsg = 'SDK do Pluggy Connect não está carregado';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Obtém o connectToken do backend
      const connectToken = await getConnectToken();

      // Cria a instância do Pluggy Connect usando o SDK npm
      const pluggy = await createPluggyConnect({
        connectToken,
        includeSandbox: process.env.NODE_ENV === 'development',
        onSuccess: async (data) => {
          console.log('Item conectado com sucesso:', data);

          // O SDK retorna { item: Item } no onSuccess
          const item: PluggyItem = data.item || data;

          try {
            // Salva o item no backend
            await saveItem({
              itemId: item.id,
              institution: item.institution?.name,
            });

            // Atualiza o store
            addItem(item);
            setHasBankConnected(true);

            toast.success('Banco conectado com sucesso!');
            console.log('Item salvo no backend com sucesso');
          } catch (saveError: any) {
            console.error('Erro ao salvar item:', saveError);
            const errorMsg =
              saveError.message || 'Erro ao salvar conexão do banco';
            setError(errorMsg);
            toast.error(errorMsg);
          } finally {
            setIsLoading(false);
          }
        },
        onError: (pluggyError: any) => {
          console.error('Erro no Pluggy Connect:', pluggyError);
          const errorMsg =
            pluggyError?.message || pluggyError?.error || 'Erro ao conectar com o banco';
          setError(errorMsg);
          toast.error(errorMsg);
          setIsLoading(false);
        },
        onOpen: () => {
          console.log('Pluggy Connect aberto');
        },
        onClose: () => {
          console.log('Pluggy Connect fechado');
          setIsLoading(false);
        },
        onEvent: (event: any, metadata?: any) => {
          console.log('Evento do Pluggy:', event, metadata);
        },
      });

      // Abre o widget do Pluggy
      await pluggy.init();
    } catch (err: any) {
      console.error('Erro ao iniciar conexão:', err);
      const errorMsg = err.message || 'Erro ao iniciar conexão com o banco';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  }, [isSDKLoaded, addItem, setHasBankConnected]);

  return {
    connectBank,
    isLoading,
    isSDKLoaded,
    error,
  };
}
