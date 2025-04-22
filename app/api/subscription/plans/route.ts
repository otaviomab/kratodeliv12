import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';

/**
 * Lista todos os planos de assinatura disponíveis
 */
export async function GET() {
  try {
    const plans = await SubscriptionService.listAvailablePlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Erro ao listar planos de assinatura:', error);
    return NextResponse.json(
      { error: 'Erro ao listar planos de assinatura' },
      { status: 500 }
    );
  }
} 