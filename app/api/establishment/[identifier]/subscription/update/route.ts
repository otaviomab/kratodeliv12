import { NextResponse } from 'next/server';
import { SubscriptionService, BillingCycle } from '@/lib/subscriptionService';

/**
 * Atualiza a assinatura de um estabelecimento
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
    const { planId, billingCycle } = body;

    // Validação básica
    if (!planId || !billingCycle) {
      return NextResponse.json(
        { error: 'ID do plano e ciclo de faturamento são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o ciclo de faturamento é válido
    if (billingCycle !== BillingCycle.MONTHLY && billingCycle !== BillingCycle.YEARLY) {
      return NextResponse.json(
        { error: 'Ciclo de faturamento inválido. Use "monthly" ou "yearly"' },
        { status: 400 }
      );
    }

    // Atualizar a assinatura
    const subscription = await SubscriptionService.updateEstablishmentSubscription(
      establishmentId,
      planId,
      billingCycle
    );

    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error(`Erro ao atualizar assinatura do estabelecimento ${establishmentId}:`, error);
    return NextResponse.json(
      { error: 'Erro ao atualizar assinatura' },
      { status: 500 }
    );
  }
} 