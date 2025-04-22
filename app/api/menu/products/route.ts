import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Product } from '@/types/menu';

const databaseId = 'kratodeliv_db';
const collectionId = 'products';

// Listar produtos (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get('establishmentId');
    const categoryId = searchParams.get('categoryId');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    if (!establishmentId) {
      return NextResponse.json(
        { error: 'ID do estabelecimento é obrigatório' },
        { status: 400 }
      );
    }

    // Construir as queries
    const queries = [Query.equal('establishmentId', establishmentId)];

    // Filtrar por categoria se fornecido
    if (categoryId) {
      queries.push(Query.equal('categoryId', categoryId));
    }

    // Filtrar por status (ativo/inativo)
    if (active !== null && active !== undefined) {
      const isActive = active === 'true';
      queries.push(Query.equal('isActive', isActive));
    }

    // Filtrar por termo de pesquisa
    if (search) {
      queries.push(Query.search('name', search));
    }

    // Buscar produtos
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    return NextResponse.json({ products: response.documents });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// Criar produto (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      price,
      imageUrl,
      isActive,
      isCustomizable,
      categoryId,
      establishmentId,
      additionals 
    } = body;

    // Validação básica
    if (!name || !categoryId || !establishmentId || price === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Criar produto no Appwrite
    const product = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl: imageUrl || '',
        isActive: isActive !== undefined ? isActive : true,
        isCustomizable: isCustomizable !== undefined ? isCustomizable : false,
        categoryId,
        establishmentId,
        additionals: additionals || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}

// Atualizar produto (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      name, 
      description, 
      price,
      imageUrl,
      isActive,
      isCustomizable,
      categoryId,
      additionals 
    } = body;

    // Validação básica
    if (!id || !name || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Atualizar produto no Appwrite
    const product = await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl: imageUrl || '',
        isActive: isActive !== undefined ? isActive : true,
        isCustomizable: isCustomizable !== undefined ? isCustomizable : false,
        categoryId,
        additionals: additionals || [],
        updatedAt: new Date().toISOString()
      }
    );

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// Deletar produto (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    // Deletar produto no Appwrite
    await databases.deleteDocument(databaseId, collectionId, id);

    return NextResponse.json(
      { message: 'Produto excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir produto' },
      { status: 500 }
    );
  }
} 