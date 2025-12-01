import { apiClient } from './apiClient';

export interface ConnectTokenResponse {
  accessToken: string;
}

export interface SaveItemPayload {
  itemId: string;
  institution?: string;
}

export interface SaveItemResponse {
  success: boolean;
  message?: string;
}

/**
 * Service para comunicação com o backend relacionado ao Pluggy Connect
 */
export async function getConnectToken(): Promise<string> {
  try {
    const response = await apiClient.post<ConnectTokenResponse>(
      '/users/pluggy/connect-token'
    );
    return response.data.accessToken;
  } catch (error: any) {
    throw new Error(
      error.message || 'Erro ao obter token de conexão do Pluggy'
    );
  }
}

export async function saveItem(
  payload: SaveItemPayload
): Promise<SaveItemResponse> {
  try {
    const response = await apiClient.patch<SaveItemResponse>(
      '/users/pluggy/item-id',
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao salvar item do Pluggy');
  }
}
