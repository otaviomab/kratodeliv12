import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Category } from '@/types/menu';

const databaseId = 'kratodeliv_db';
const collectionId = 'categories';

// Listar categorias (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const establishmentId = searchParams.get('establishmentId');

    if (!establishmentId) {
      return NextResponse.json(
        { error: 'ID do estabelecimento é obrigatório' },
        { status: 400 }
      );
    }

    // Busca todas as categorias do estabelecimento
    const response = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.equal('establishmentId', establishmentId),
        Query.orderAsc('displayOrder')
      ]
    );

    return NextResponse.json({ categories: response.documents });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    );
  }
}

// Criar categoria (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, establishmentId, displayOrder } = body;

    // Validação básica
    if (!name || !establishmentId) {
      return NextResponse.json(
        { error: 'Nome e ID do estabelecimento são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar categoria no Appwrite
    const category = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        name,
        description: description || '',
        establishmentId,
        displayOrder: displayOrder || 0,
        imageUrl: ''
      }
    );

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}

// Atualizar categoria (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, displayOrder, imageUrl } = body;

    // Validação básica
    if (!id || !name) {
      return NextResponse.json(
        { error: 'ID e nome da categoria são obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar categoria no Appwrite
    const category = await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      {
        name,
        description: description || '',
        displayOrder: displayOrder || 0,
        imageUrl: imageUrl || ''
      }
    );

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    );
  }
}

// Deletar categoria (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da categoria é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se existem produtos associados a esta categoria
    const products = await databases.listDocuments(
      databaseId,
      'products',
      [Query.equal('categoryId', id)]
    );

    if (products.documents.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir uma categoria que contém produtos' },
        { status: 400 }
      );
    }

    // Deletar categoria no Appwrite
    await databases.deleteDocument(databaseId, collectionId, id);

    return NextResponse.json(
      { message: 'Categoria excluída com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    );
  }
} 