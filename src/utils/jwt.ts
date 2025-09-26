/**
 * Utilitários para manipulação de JWT
 */

export interface JWTPayload {
  sub: string; // user id
  iat: number; // issued at
  exp: number; // expiration time
  [key: string]: any;
}

/**
 * Decodifica um JWT sem verificar a assinatura
 * @param token JWT token
 * @returns Payload decodificado ou null se inválido
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um token JWT está expirado
 * @param token JWT token
 * @returns true se expirado, false se válido
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Verifica se um token JWT expira em breve (dentro de X minutos)
 * @param token JWT token
 * @param minutesThreshold Minutos antes da expiração para considerar "em breve"
 * @returns true se expira em breve, false caso contrário
 */
export function isTokenExpiringSoon(
  token: string,
  minutesThreshold: number = 5
): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const thresholdTime = currentTime + minutesThreshold * 60;

  return payload.exp < thresholdTime;
}

/**
 * Obtém o tempo restante até a expiração do token em segundos
 * @param token JWT token
 * @returns Segundos restantes ou 0 se expirado
 */
export function getTokenTimeRemaining(token: string): number {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return 0;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeRemaining = payload.exp - currentTime;

  return Math.max(0, timeRemaining);
}

/**
 * Obtém informações do usuário do token JWT
 * @param token JWT token
 * @returns Informações do usuário ou null se inválido
 */
export function getUserFromToken(
  token: string
): { userId: string; [key: string]: any } | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.sub) {
    return null;
  }

  return {
    userId: payload.sub,
    ...payload,
  };
}
