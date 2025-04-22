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
    
    // Verificar se o corpo da requisição contém dados de configuração de entrega
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Dados de configuração de entrega inválidos" },
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

    // Validar campos obrigatórios
    if (body.hasDelivery === undefined) {
      return NextResponse.json(
        { error: "O campo 'hasDelivery' é obrigatório" },
        { status: 400 }
      );
    }

    // Se possui entrega, validar campos adicionais
    if (body.hasDelivery) {
      // Validar valores numéricos
      if (
        (body.minimumOrderValue !== undefined && (isNaN(body.minimumOrderValue) || body.minimumOrderValue < 0)) ||
        (body.estimatedDeliveryTime !== undefined && (isNaN(body.estimatedDeliveryTime) || body.estimatedDeliveryTime <= 0))
      ) {
        return NextResponse.json(
          { error: "Valores numéricos inválidos para configurações de entrega" },
          { status: 400 }
        );
      }

      // Validar zonas de entrega, se fornecidas
      if (body.deliveryZones !== undefined) {
        if (!Array.isArray(body.deliveryZones)) {
          return NextResponse.json(
            { error: "deliveryZones deve ser um array" },
            { status: 400 }
          );
        }

        // Validar cada zona de entrega
        for (const zone of body.deliveryZones) {
          if (!zone.name || (isNaN(zone.fee) || zone.fee < 0)) {
            return NextResponse.json(
              { error: "Cada zona de entrega deve ter um nome e uma taxa válida" },
              { status: 400 }
            );
          }
        }
      }
    }

    // Preparar objeto de configurações de entrega
    const deliverySettings = {
      hasDelivery: body.hasDelivery,
      minimumOrderValue: body.hasDelivery ? (body.minimumOrderValue ?? 0) : 0,
      deliveryFee: body.hasDelivery ? (body.deliveryFee ?? 0) : 0,
      estimatedDeliveryTime: body.hasDelivery ? (body.estimatedDeliveryTime ?? 30) : 0,
      deliveryZones: body.hasDelivery ? (body.deliveryZones || []) : []
    };

    // Atualizar apenas o campo de configurações de entrega
    const now = new Date();
    const updateData = {
      deliverySettings: deliverySettings,
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
    console.error("Erro ao atualizar configurações de entrega:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar configurações de entrega", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 