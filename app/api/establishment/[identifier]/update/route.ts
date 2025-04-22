import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { formatEstablishmentResponse } from '@/utils/formatters';

const DATABASE_ID = 'kratodeliv_db';
const COLLECTION_ID = 'establishments';

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

    // Filtrar apenas os campos permitidos para atualização
    const allowedFields = [
      'name',
      'description',
      'type',
      'address',
      'phoneNumber',
      'whatsappNumber',
      'paymentMethods'
    ];

    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Adicionar timestamp de atualização
    const now = new Date();
    updateData.updatedAt = now.toISOString();

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
    console.error("Erro ao atualizar informações do estabelecimento:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar informações do estabelecimento", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 