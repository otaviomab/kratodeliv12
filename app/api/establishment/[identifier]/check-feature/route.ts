import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';

/**
 * Verifica se um estabelecimento tem acesso a um determinado recurso
 * baseado em seu plano atual de assinatura
 */
export async function POST(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  const establishmentId = params.identifier;

  if (!establishmentId) {
    return NextResponse.json(
      { error: 'ID do estabelecimento não fornecido' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { featureName } = body;

    if (!featureName) {
      return NextResponse.json(
        { error: 'Nome do recurso não fornecido' },
        { status: 400 }
      );
    }

    const hasAccess = await SubscriptionService.hasFeatureAccess(
      establishmentId,
      featureName
    );

    return NextResponse.json({ 
      hasAccess,
      feature: featureName
    });
  } catch (error) {
    console.error(`Erro ao verificar acesso a recurso para o estabelecimento ${establishmentId}:`, error);
    return NextResponse.json(
      { error: 'Erro ao verificar acesso a recurso' },
      { status: 500 }
    );
  }
} 