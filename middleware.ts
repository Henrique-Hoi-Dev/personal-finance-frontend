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
    '/pt/dashboard/:path*',
    '/pt/contas/:path*',
    '/pt/transacoes/:path*',
    '/pt/perfil/:path*',
  ],
};
