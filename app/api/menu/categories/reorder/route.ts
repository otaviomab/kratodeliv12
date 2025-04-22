import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';

const databaseId = 'kratodeliv_db';
const collectionId = 'categories';

// Reordenar categorias (PATCH)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { categories } = body;

    // Validação básica
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: 'Lista de categorias é obrigatória' },
        { status: 400 }
      );
    }

    // Atualizar a ordem de exibição de cada categoria
    const updatePromises = categories.map((category, index) => {
      return databases.updateDocument(
        databaseId,
        collectionId,
        category.id,
        { displayOrder: index }
      );
    });

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: 'Categorias reordenadas com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao reordenar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao reordenar categorias' },
      { status: 500 }
    );
  }
} 