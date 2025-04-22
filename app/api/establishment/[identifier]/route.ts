import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = 'kratodeliv_db';
const COLLECTION_ID = 'establishments';

// Função auxiliar para formatar a resposta
const formatEstablishmentResponse = (establishmentDoc: any) => {
  return {
    id: establishmentDoc.$id,
    name: establishmentDoc.name,
    slug: establishmentDoc.slug,
    description: establishmentDoc.description || "",
    logoUrl: establishmentDoc.logoUrl || "",
    coverImageUrl: establishmentDoc.coverImageUrl || "",
    type: establishmentDoc.type || "restaurant",
    address: establishmentDoc.address || {},
    businessHours: establishmentDoc.businessHours || [],
    deliverySettings: establishmentDoc.deliverySettings || {
      hasDelivery: false,
      minimumOrderValue: 0,
      deliveryFee: 0,
      estimatedDeliveryTime: 0,
      deliveryZones: []
    },
    paymentMethods: establishmentDoc.paymentMethods || [],
    phoneNumber: establishmentDoc.phoneNumber || "",
    whatsappNumber: establishmentDoc.whatsappNumber || "",
    isOpen: establishmentDoc.isOpen || false,
    ownerId: establishmentDoc.ownerId,
    createdAt: establishmentDoc.$createdAt,
    updatedAt: establishmentDoc.$updatedAt
  };
};

export async function GET(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  const identifier = params.identifier;

  if (!identifier) {
    return NextResponse.json(
      { error: "Identificador do estabelecimento não fornecido" },
      { status: 400 }
    );
  }

  try {
    // 1. Tentar buscar pelo ID
    try {
      const establishmentById = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        identifier
      );
      return NextResponse.json({ 
        establishment: formatEstablishmentResponse(establishmentById) 
      });
    } catch (errorById) {
      // Se o erro for 404 (não encontrado por ID), prosseguir para buscar por slug
      if ((errorById as any)?.code !== 404) {
        // Se for outro erro ao buscar por ID, registrar e lançar
        console.error("Erro ao buscar estabelecimento por ID:", errorById);
        throw errorById; // Lança para ser pego pelo catch externo
      }
    }

    // 2. Se não encontrou por ID (erro 404), tentar buscar pelo Slug
    const establishmentsBySlug = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('slug', identifier),
        Query.limit(1)
      ]
    );

    if (establishmentsBySlug.documents.length > 0) {
      return NextResponse.json({ 
        establishment: formatEstablishmentResponse(establishmentsBySlug.documents[0]) 
      });
    }

    // 3. Se não encontrou nem por ID nem por Slug
    return NextResponse.json(
      { error: "Estabelecimento não encontrado" },
      { status: 404 }
    );

  } catch (error) {
    // Captura erros gerais (incluindo os lançados do try-catch interno)
    console.error("Erro geral ao buscar estabelecimento:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar estabelecimento" },
      { status: 500 }
    );
  }
}

// ----- Manter outros métodos (PUT, DELETE, etc.) que usam ID -----
// TODO: Verificar se havia outros métodos nas rotas [id] e [slug] e movê-los/adaptá-los aqui
// Exemplo: Assumindo que PUT/DELETE usavam ID

export async function PUT(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  // A lógica de atualização geralmente usa o ID. 
  // Poderíamos adicionar uma verificação aqui para garantir que `identifier` é um ID
  // ou assumir que as operações de escrita sempre usarão ID.
  const id = params.identifier; 
  
  try {
    const body = await request.json();
    // ... (Lógica de validação e atualização usando o 'id') ...

    const updatedEstablishment = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id, 
      body // Dados a serem atualizados
    );

    return NextResponse.json({ 
      establishment: formatEstablishmentResponse(updatedEstablishment) 
    });

  } catch (error) {
    console.error("Erro ao atualizar estabelecimento:", error);
     if ((error as any)?.code === 404) {
      return NextResponse.json({ error: "Estabelecimento não encontrado para atualização" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro ao atualizar estabelecimento" }, { status: 500 });
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { identifier: string } }
) {
  // A lógica de deleção geralmente usa o ID.
  const id = params.identifier;

  try {
     // ... (Lógica de validação, se necessária) ...

    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id
    );

    return NextResponse.json({ message: "Estabelecimento excluído com sucesso" });

  } catch (error) {
    console.error("Erro ao excluir estabelecimento:", error);
     if ((error as any)?.code === 404) {
      return NextResponse.json({ error: "Estabelecimento não encontrado para exclusão" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erro ao excluir estabelecimento" }, { status: 500 });
  }
} 