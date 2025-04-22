import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';

/**
 * Cancela a assinatura de um estabelecimento
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
    const subscription = await SubscriptionService.cancelSubscription(establishmentId);
    
    if (!subscription) {
      return NextResponse.json(
        { message: 'Nenhuma assinatura encontrada para este estabelecimento' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Assinatura cancelada com sucesso',
      subscription 
    });
  } catch (error) {
    console.error(`Erro ao cancelar assinatura do estabelecimento ${establishmentId}:`, error);
    return NextResponse.json(
      { error: 'Erro ao cancelar assinatura' },
      { status: 500 }
    );
  }
} 