import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';

/**
 * Obtém a assinatura atual de um estabelecimento
 */
export async function GET(
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
    const subscription = await SubscriptionService.getEstablishmentSubscription(establishmentId);
    
    if (!subscription) {
      return NextResponse.json(
        { message: 'Nenhuma assinatura encontrada para este estabelecimento' },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error(`Erro ao obter assinatura do estabelecimento ${establishmentId}:`, error);
    return NextResponse.json(
      { error: 'Erro ao obter assinatura' },
      { status: 500 }
    );
  }
} 