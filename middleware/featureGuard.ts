import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';

/**
 * Middleware para verificar se um estabelecimento tem acesso a um recurso
 * específico com base em seu plano de assinatura atual
 * 
 * @param req Requisição Next.js
 * @param featureName Nome do recurso a ser verificado
 * @param unauthorizedRedirect URL para redirecionar em caso de acesso não autorizado
 * @returns Response ou undefined (para continuar o fluxo)
 */
export async function featureGuard(
  req: NextRequest,
  featureName: string,
  unauthorizedRedirect: string = '/admin/planos'
): Promise<NextResponse | undefined> {
  try {
    // Extrair o ID do estabelecimento da sessão ou cookies
    // Isso depende de como sua aplicação gerencia a autenticação
    // Este é apenas um exemplo, ajuste conforme necessário
    const establishmentId = req.cookies.get('establishmentId')?.value;
    
    if (!establishmentId) {
      // Se não houver ID do estabelecimento, redirecionar para login
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    // Verificar acesso ao recurso
    const hasAccess = await SubscriptionService.hasFeatureAccess(
      establishmentId,
      featureName
    );
    
    if (!hasAccess) {
      // Redirecionar para página de planos se não tiver acesso
      return NextResponse.redirect(new URL(unauthorizedRedirect, req.url));
    }
    
    // Se tem acesso, continuar o fluxo normalmente
    return undefined;
  } catch (error) {
    console.error('Erro ao verificar acesso a recurso:', error);
    // Em caso de erro, redirecionar para página de planos como precaução
    return NextResponse.redirect(new URL(unauthorizedRedirect, req.url));
  }
}

/**
 * Middleware para verificar se um estabelecimento atingiu o limite de produtos
 * com base em seu plano de assinatura atual
 * 
 * @param req Requisição Next.js
 * @param unauthorizedRedirect URL para redirecionar em caso de limite atingido
 * @returns Response ou undefined (para continuar o fluxo)
 */
export async function productLimitGuard(
  req: NextRequest,
  unauthorizedRedirect: string = '/admin/planos'
): Promise<NextResponse | undefined> {
  try {
    // Extrair o ID do estabelecimento da sessão ou cookies
    const establishmentId = req.cookies.get('establishmentId')?.value;
    
    if (!establishmentId) {
      // Se não houver ID do estabelecimento, redirecionar para login
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    
    // Verificar se pode adicionar mais produtos
    const { canAddMore } = await fetch(
      `${req.nextUrl.origin}/api/establishment/${establishmentId}/product-limit`
    ).then(res => res.json());
    
    if (!canAddMore) {
      // Redirecionar para página de planos se atingiu o limite
      return NextResponse.redirect(new URL(unauthorizedRedirect, req.url));
    }
    
    // Se não atingiu o limite, continuar o fluxo normalmente
    return undefined;
  } catch (error) {
    console.error('Erro ao verificar limite de produtos:', error);
    // Em caso de erro, redirecionar para página de planos como precaução
    return NextResponse.redirect(new URL(unauthorizedRedirect, req.url));
  }
} 