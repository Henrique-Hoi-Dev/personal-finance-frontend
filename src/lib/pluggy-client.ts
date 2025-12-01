/**
 * Client wrapper para o Pluggy Connect SDK
 * Garante que o SDK só seja carregado no client-side
 */

let PluggyConnectSDK: any = null;
let isSDKLoading = false;
let sdkLoadPromise: Promise<any> | null = null;

/**
 * Carrega o SDK do Pluggy Connect dinamicamente (apenas no client)
 */
export async function loadPluggySDK() {
  // Se já está carregado, retorna
  if (PluggyConnectSDK) {
    return PluggyConnectSDK;
  }

  // Se está no servidor, retorna null
  if (typeof window === 'undefined') {
    return null;
  }

  // Se já está carregando, retorna a promise existente
  if (isSDKLoading && sdkLoadPromise) {
    return sdkLoadPromise;
  }

  // Inicia o carregamento
  isSDKLoading = true;
  sdkLoadPromise = import('pluggy-connect-sdk')
    .then((module) => {
      // O SDK exporta PluggyConnect como default ou named export
      PluggyConnectSDK = module.default || module.PluggyConnect || module;
      isSDKLoading = false;
      return PluggyConnectSDK;
    })
    .catch((error) => {
      isSDKLoading = false;
      sdkLoadPromise = null;
      console.error('Erro ao carregar pluggy-connect-sdk:', error);
      throw error;
    });

  return sdkLoadPromise;
}

/**
 * Cria uma instância do Pluggy Connect
 */
export async function createPluggyConnect(config: {
  connectToken: string;
  includeSandbox?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onEvent?: (event: any, metadata?: any) => void;
}) {
  if (!config.connectToken) {
    throw new Error('connectToken é obrigatório para criar instância do Pluggy Connect');
  }

  // Garante que está no client
  if (typeof window === 'undefined') {
    throw new Error('Pluggy Connect só pode ser usado no client-side');
  }

  // Carrega o SDK
  const PluggyConnect = await loadPluggySDK();
  if (!PluggyConnect) {
    throw new Error('Não foi possível carregar o SDK do Pluggy Connect');
  }

  // Cria a instância do PluggyConnect
  const instance = new PluggyConnect(config);

  return {
    instance,
    init: async (container?: HTMLElement) => {
      if (container && typeof instance.init === 'function') {
        await instance.init(container);
      } else if (typeof instance.init === 'function') {
        await instance.init();
      } else {
        throw new Error('Método init não disponível na instância do Pluggy Connect');
      }
    },
    show: async () => {
      if (typeof instance.show === 'function') {
        await instance.show();
      } else {
        throw new Error('Método show não disponível na instância do Pluggy Connect');
      }
    },
    hide: async () => {
      if (typeof instance.hide === 'function') {
        await instance.hide();
      } else {
        throw new Error('Método hide não disponível na instância do Pluggy Connect');
      }
    },
    destroy: async () => {
      if (typeof instance.destroy === 'function') {
        await instance.destroy();
      }
    },
  };
}
