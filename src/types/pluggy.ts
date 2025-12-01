/**
 * Types para integração com Pluggy Connect
 */

export interface PluggyItem {
  id: string;
  institution?: {
    id?: string;
    name?: string;
  };
  connector?: {
    id?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PluggyError {
  message: string;
  code?: string;
  status?: number;
}

export interface PluggyEvent {
  type: string;
  data?: any;
}

export interface PluggyConnectConfig {
  connectToken: string;
  includeSandbox?: boolean;
  onSuccess?: (item: PluggyItem) => void;
  onError?: (error: PluggyError) => void;
  onEvent?: (event: PluggyEvent) => void;
}

export interface PluggyConnectInstance {
  init: (container?: HTMLElement) => Promise<void>;
  show: () => Promise<void>;
  hide: () => Promise<void>;
  destroy: () => Promise<void>;
}
