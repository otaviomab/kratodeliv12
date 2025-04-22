import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID, Permission, Role } from 'appwrite';

// Função para criar um novo estabelecimento
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar os dados necessários
    if (!data.name || !data.slug || !data.ownerId) {
      return NextResponse.json(
        { error: "Dados obrigatórios não fornecidos (nome, slug, ownerId)" },
        { status: 400 }
      );
    }

    // Verificar se já existe um estabelecimento com o mesmo slug
    const existingEstablishments = await databases.listDocuments(
      'kratodeliv_db',
      'establishments',
      [
        // Consulta para verificar se o slug já existe
        // Se houver um índice no slug, essa consulta será mais eficiente
        databases.queries.equal('slug', data.slug),
        databases.queries.limit(1)
      ]
    );

    if (existingEstablishments.documents.length > 0) {
      return NextResponse.json(
        { error: "Já existe um estabelecimento com este slug" },
        { status: 409 }
      );
    }

    // Preparar os dados do estabelecimento
    const establishmentData = {
      name: data.name,
      slug: data.slug,
      description: data.description || "",
      logoUrl: data.logoUrl || "",
      coverImageUrl: data.coverImageUrl || "",
      type: data.type || "restaurant",
      address: data.address || {},
      businessHours: data.businessHours || [],
      deliverySettings: data.deliverySettings || {
        hasDelivery: false,
        minimumOrderValue: 0,
        deliveryFee: 0,
        estimatedDeliveryTime: 0,
        deliveryZones: []
      },
      paymentMethods: data.paymentMethods || [],
      phoneNumber: data.phoneNumber || "",
      whatsappNumber: data.whatsappNumber || "",
      isOpen: data.isOpen || false,
      ownerId: data.ownerId,
    };

    // Definir permissões para o documento
    // O proprietário tem permissão total e outros usuários não têm acesso
    const permissions = [
      Permission.read(Role.user(data.ownerId)),
      Permission.update(Role.user(data.ownerId)),
      Permission.delete(Role.user(data.ownerId)),
    ];

    // Criar o documento no Appwrite
    const establishment = await databases.createDocument(
      'kratodeliv_db',
      'establishments',
      ID.unique(),
      establishmentData,
      permissions
    );

    // Retornar o estabelecimento criado
    return NextResponse.json({
      establishment: {
        id: establishment.$id,
        name: establishment.name,
        slug: establishment.slug,
        description: establishment.description || "",
        logoUrl: establishment.logoUrl || "",
        coverImageUrl: establishment.coverImageUrl || "",
        type: establishment.type || "restaurant",
        address: establishment.address || {},
        businessHours: establishment.businessHours || [],
        deliverySettings: establishment.deliverySettings || {
          hasDelivery: false,
          minimumOrderValue: 0,
          deliveryFee: 0,
          estimatedDeliveryTime: 0,
          deliveryZones: []
        },
        paymentMethods: establishment.paymentMethods || [],
        phoneNumber: establishment.phoneNumber || "",
        whatsappNumber: establishment.whatsappNumber || "",
        isOpen: establishment.isOpen || false,
        ownerId: establishment.ownerId,
        createdAt: establishment.$createdAt,
        updatedAt: establishment.$updatedAt
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar estabelecimento:", error);
    return NextResponse.json(
      { error: "Erro ao criar estabelecimento" },
      { status: 500 }
    );
  }
} 