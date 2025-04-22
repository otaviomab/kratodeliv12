import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ProductAdditional } from '@/types/menu';

const databaseId = 'kratodeliv_db';
const collectionId = 'products';

// Atualizar adicionais de um produto (PATCH)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, additionals } = body;

    if (!productId || !additionals || !Array.isArray(additionals)) {
      return NextResponse.json(
        { error: 'ID do produto e lista de adicionais são obrigatórios' },
        { status: 400 }
      );
    }

    // Primeiro, verificar se o produto existe
    try {
      const product = await databases.getDocument(
        databaseId,
        collectionId,
        productId
      );

      // Atualizar apenas os adicionais do produto
      const updatedProduct = await databases.updateDocument(
        databaseId,
        collectionId,
        productId,
        {
          additionals,
          updatedAt: new Date().toISOString()
        }
      );

      return NextResponse.json({
        success: true,
        product: updatedProduct
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erro ao atualizar adicionais do produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar adicionais do produto' },
      { status: 500 }
    );
  }
} 