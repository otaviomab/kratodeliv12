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
    
    // Verificar se o corpo da requisição contém dados de horário de funcionamento
    if (!body || !Array.isArray(body)) {
      return NextResponse.json(
        { error: "Dados de horário de funcionamento inválidos. Um array deve ser fornecido." },
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

    // Validar cada item do horário de funcionamento
    for (const hour of body) {
      // Verificar campos obrigatórios
      if (hour.dayOfWeek === undefined || hour.isOpen === undefined) {
        return NextResponse.json(
          { error: "Cada item do horário deve ter dayOfWeek e isOpen" },
          { status: 400 }
        );
      }
      
      // Validar dia da semana (0-6, domingo a sábado)
      if (hour.dayOfWeek < 0 || hour.dayOfWeek > 6) {
        return NextResponse.json(
          { error: "dayOfWeek deve ser um número entre 0 (domingo) e 6 (sábado)" },
          { status: 400 }
        );
      }
      
      // Se estiver aberto, verificar horários
      if (hour.isOpen) {
        if (!hour.openTime || !hour.closeTime) {
          return NextResponse.json(
            { error: "Para dias com isOpen=true, openTime e closeTime são obrigatórios" },
            { status: 400 }
          );
        }
        
        // Validar formato de hora (HH:MM)
        const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timePattern.test(hour.openTime) || !timePattern.test(hour.closeTime)) {
          return NextResponse.json(
            { error: "Horários devem estar no formato HH:MM" },
            { status: 400 }
          );
        }
      }
    }

    // Atualizar apenas o campo de horários de funcionamento
    const now = new Date();
    const updateData = {
      businessHours: body,
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
    console.error("Erro ao atualizar horários de funcionamento:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar horários de funcionamento", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 