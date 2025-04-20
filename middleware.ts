import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista das rotas de admin que são públicas
const publicAdminRoutes = [
  '/admin/login',
  '/admin/cadastrar',
  '/admin/recuperar-senha',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se a rota atual é uma das rotas admin públicas
  const isAdminPublicRoute = publicAdminRoutes.some(route => pathname.startsWith(route));

  // Tenta obter o cookie de sessão
  const allCookies = request.cookies.getAll();
  const sessionCookie = allCookies.find(cookie => cookie.name.startsWith('a_session_'));
  const hasSession = !!sessionCookie;

  // Se o usuário TEM sessão e está tentando acessar uma rota admin PÚBLICA (login/cadastro/recuperar), 
  // redireciona para o dashboard.
  if (hasSession && isAdminPublicRoute) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Em todos os outros casos (incluindo acesso a rotas protegidas sem sessão,
  // que será tratado no lado do cliente), permite continuar.
  return NextResponse.next();
}

// Configuração do Matcher para aplicar o middleware apenas onde necessário
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (pasta public/images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 