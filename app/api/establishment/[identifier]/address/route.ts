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
    
    // Verificar se o corpo da requisição contém dados de endereço
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Dados de endereço inválidos" },
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

    // Validar os campos obrigatórios do endereço
    const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório não fornecido: ${field}` },
          { status: 400 }
        );
      }
    }

    // Preparar objeto de endereço
    const address = {
      street: body.street,
      number: body.number,
      complement: body.complement || "",
      neighborhood: body.neighborhood,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      latitude: body.latitude || null,
      longitude: body.longitude || null
    };

    // Atualizar apenas o campo de endereço
    const now = new Date();
    const updateData = {
      address: address,
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
    console.error("Erro ao atualizar endereço do estabelecimento:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar endereço do estabelecimento", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 