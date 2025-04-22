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
    
    // Verificar se o corpo da requisição contém dados de WhatsApp
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Dados de configuração de WhatsApp inválidos" },
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

    // Validar número de WhatsApp
    if (!body.whatsappNumber) {
      return NextResponse.json(
        { error: "Número de WhatsApp não fornecido" },
        { status: 400 }
      );
    }

    // Verificar formato do número (simplificado)
    const phonePattern = /^(\+\d{1,3})?\d{10,13}$/;
    if (!phonePattern.test(body.whatsappNumber.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: "Formato de número de WhatsApp inválido" },
        { status: 400 }
      );
    }

    // Preparar configurações de WhatsApp
    const whatsappConfig = {
      whatsappNumber: body.whatsappNumber,
      notifyNewOrders: body.notifyNewOrders !== false, // true por padrão
      notifyStatusChanges: body.notifyStatusChanges !== false, // true por padrão
      customMessages: body.customMessages || {
        newOrder: "Novo pedido recebido: #{{orderId}}",
        orderConfirmed: "Pedido #{{orderId}} confirmado",
        orderReady: "Pedido #{{orderId}} pronto para entrega/retirada",
        orderDelivered: "Pedido #{{orderId}} entregue/retirado"
      }
    };

    // Atualizar configurações de WhatsApp
    const now = new Date();
    const updateData = {
      whatsappNumber: whatsappConfig.whatsappNumber,
      whatsappConfig: whatsappConfig,
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
    console.error("Erro ao atualizar configurações de WhatsApp:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar configurações de WhatsApp", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 