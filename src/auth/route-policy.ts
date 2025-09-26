export const AUTH_COOKIE_NAME = 'auth_token';

// Caminho de login atual (respeitar i18n existente)
export const LOGIN_PATH = '/pt/login';

// Para onde mandar o usuário após logado tentar acessar /login
export const AFTER_LOGIN_REDIRECT = '/pt/dashboard';

const PUBLIC_PATTERNS = [
  LOGIN_PATH,
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/_next',
  '/assets',
  '/public',
];

/** Um path é público se bate com prefixos conhecidos.
 *  Mantém simples e previsível.
 */
export function isPublicPath(pathname: string): boolean {
  if (LOGIN_PATH.endsWith('/login')) {
    const localeLogin = /^\/(pt|en|es)\/login\/?$/;
    if (localeLogin.test(pathname)) return true;
  }

  return PUBLIC_PATTERNS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}
