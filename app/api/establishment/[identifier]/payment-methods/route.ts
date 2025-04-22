import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { formatEstablishmentResponse } from '@/utils/formatters';

const DATABASE_ID = 'kratodeliv_db';
const COLLECTION_ID = 'establishments';

// Métodos de pagamento válidos
const VALID_PAYMENT_METHODS = [
  'credit_card',
  'debit_card',
  'cash',
  'pix',
  'bank_transfer',
  'meal_voucher',
  'food_voucher'
];

export async function PATCH(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  const id = params.identifier;

  if (!id) {
    return NextResponse.json(
      { error: "ID do estabelecimento não fornecido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    
    // Verificar se o corpo da requisição contém um array de métodos de pagamento
    if (!body || !Array.isArray(body)) {
      return NextResponse.json(
        { error: "Dados de métodos de pagamento inválidos. Um array deve ser fornecido." },
        { status: 400 }
      );
    }

    // Verificar se o estabelecimento existe
    try {
      await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error("Erro ao verificar estabelecimento:", error);
      return NextResponse.json(
        { error: "Estabelecimento não encontrado" },
        { status: 404 }
      );
    }

    // Validar cada método de pagamento
    for (const method of body) {
      if (typeof method !== 'string' || !VALID_PAYMENT_METHODS.includes(method)) {
        return NextResponse.json(
          { 
            error: `Método de pagamento inválido: ${method}. Métodos válidos: ${VALID_PAYMENT_METHODS.join(', ')}` 
          },
          { status: 400 }
        );
      }
    }

    // Remover duplicatas
    const uniqueMethods = [...new Set(body)];

    // Atualizar apenas o campo de métodos de pagamento
    const now = new Date();
    const updateData = {
      paymentMethods: uniqueMethods,
      updatedAt: now.toISOString()
    };

    // Atualizar o documento no Appwrite
    const updatedEstablishment = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id,
      updateData
    );

    return NextResponse.json({
      establishment: formatEstablishmentResponse(updatedEstablishment)
    });

  } catch (error) {
    console.error("Erro ao atualizar métodos de pagamento:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar métodos de pagamento", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 