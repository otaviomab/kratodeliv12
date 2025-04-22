import { NextResponse } from 'next/server';
import { SubscriptionService } from '@/lib/subscriptionService';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = 'kratodeliv_db';
const PRODUCTS_COLLECTION_ID = 'products';

/**
 * Verifica o limite de produtos disponíveis para um estabelecimento
 * baseado em seu plano atual de assinatura
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
    // Obter o limite máximo de produtos para o plano
    const maxProducts = await SubscriptionService.getMaxProductCount(establishmentId);
    
    // Contar quantos produtos o estabelecimento já tem
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('establishmentId', establishmentId),
        Query.limit(1) // Precisamos apenas do total, não dos registros
      ]
    );
    
    const currentProductCount = productsResponse.total;
    
    // Calcular quantos produtos ainda podem ser adicionados
    const remainingProducts = Math.max(0, maxProducts - currentProductCount);
    
    return NextResponse.json({
      maxProducts,
      currentProductCount,
      remainingProducts,
      canAddMore: remainingProducts > 0
    });
  } catch (error) {
    console.error(`Erro ao verificar limite de produtos para o estabelecimento ${establishmentId}:`, error);
    return NextResponse.json(
      { error: 'Erro ao verificar limite de produtos' },
      { status: 500 }
    );
  }
} 