import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';

/**
 * Obtém detalhes de um plano específico
 */
export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  const planId = params.id;

  if (!planId) {
    return NextResponse.json(
      { error: 'ID do plano não fornecido' },
      { status: 400 }
    );
  }

  try {
    const plan = await SubscriptionService.getPlanById(planId);
    return NextResponse.json({ plan });
  } catch (error) {
    console.error(`Erro ao obter plano ${planId}:`, error);
    return NextResponse.json(
      { error: 'Plano não encontrado' },
      { status: 404 }
    );
  }
} 