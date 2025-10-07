import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Se acessar a raiz do projeto, redireciona para pt/login
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/pt/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/pt/login/:path*',
    '/pt/signup/:path*',
    '/pt/dashboard/:path*',
    '/pt/contas/:path*',
    '/pt/transacoes/:path*',
    '/pt/perfil/:path*',
    '/en/login/:path*',
    '/en/signup/:path*',
    '/en/dashboard/:path*',
    '/en/contas/:path*',
    '/en/transacoes/:path*',
    '/en/perfil/:path*',
    '/es/login/:path*',
    '/es/signup/:path*',
    '/es/dashboard/:path*',
    '/es/contas/:path*',
    '/es/transacoes/:path*',
    '/es/perfil/:path*',
    '/fr/login/:path*',
    '/fr/signup/:path*',
    '/fr/dashboard/:path*',
    '/fr/contas/:path*',
    '/fr/transacoes/:path*',
    '/fr/perfil/:path*',
    '/de/login/:path*',
    '/de/signup/:path*',
    '/de/dashboard/:path*',
    '/de/contas/:path*',
    '/de/transacoes/:path*',
    '/de/perfil/:path*',
    '/it/login/:path*',
    '/it/signup/:path*',
    '/it/dashboard/:path*',
    '/it/contas/:path*',
    '/it/transacoes/:path*',
    '/it/perfil/:path*',
    '/ja/login/:path*',
    '/ja/signup/:path*',
    '/ja/dashboard/:path*',
    '/ja/contas/:path*',
    '/ja/transacoes/:path*',
    '/ja/perfil/:path*',
    '/ko/login/:path*',
    '/ko/signup/:path*',
    '/ko/dashboard/:path*',
    '/ko/contas/:path*',
    '/ko/transacoes/:path*',
    '/ko/perfil/:path*',
    '/zh/login/:path*',
    '/zh/signup/:path*',
    '/zh/dashboard/:path*',
    '/zh/contas/:path*',
    '/zh/transacoes/:path*',
    '/zh/perfil/:path*',
    '/ru/login/:path*',
    '/ru/signup/:path*',
    '/ru/dashboard/:path*',
    '/ru/contas/:path*',
    '/ru/transacoes/:path*',
    '/ru/perfil/:path*',
  ],
};
