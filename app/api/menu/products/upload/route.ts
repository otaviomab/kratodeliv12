import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/appwrite';
import { ID } from 'appwrite';

const bucketId = 'products'; // ID do bucket no Appwrite Storage

// Rota para upload de imagem (POST)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'Arquivo e ID do produto são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar o tipo de arquivo (aceitar apenas imagens)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas arquivos de imagem são permitidos' },
        { status: 400 }
      );
    }

    // Verificar tamanho do arquivo (limite de 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Tamanho máximo permitido: 5MB' },
        { status: 400 }
      );
    }

    // Obter extensão do arquivo
    const ext = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${ext}`;

    // Fazer upload para o Appwrite Storage
    const uploadResponse = await storage.createFile(
      bucketId,
      ID.unique(),
      file
    );

    // Gerar URL pública para a imagem
    const fileUrl = storage.getFileView(bucketId, uploadResponse.$id);

    return NextResponse.json({ 
      success: true, 
      fileId: uploadResponse.$id,
      fileUrl 
    });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
} 