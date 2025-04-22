import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';

const DATABASE_ID = 'kratodeliv_db';
const COLLECTION_ID = 'establishments';

export async function PATCH(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  const identifier = params.identifier;

  if (!identifier) {
    return NextResponse.json(
      { error: "ID do estabelecimento não fornecido" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { isOpen } = body;
    const override = body.override !== false; // Por padrão, o override é true a menos que especificado como false

    if (isOpen === undefined) {
      return NextResponse.json(
        { error: "Status (isOpen) não fornecido" },
        { status: 400 }
      );
    }

    // Verificar se o estabelecimento existe
    try {
      await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        identifier
      );
    } catch (error) {
      console.error("Erro ao verificar estabelecimento:", error);
      return NextResponse.json(
        { error: "Estabelecimento não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar o status do estabelecimento
    const now = new Date();
    const updateData = {
      isOpen: isOpen,
      manualStatusOverride: override,
      lastManualStatusUpdate: now.toISOString()
    };

    const updatedEstablishment = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      identifier,
      updateData
    );

    return NextResponse.json({
      success: true,
      establishment: {
        id: updatedEstablishment.$id,
        isOpen: updatedEstablishment.isOpen,
        manualStatusOverride: updatedEstablishment.manualStatusOverride,
        lastManualStatusUpdate: updatedEstablishment.lastManualStatusUpdate
      }
    });

  } catch (error) {
    console.error("Erro ao atualizar status do estabelecimento:", error);
    return NextResponse.json(
      { 
        error: "Erro ao atualizar status do estabelecimento", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 