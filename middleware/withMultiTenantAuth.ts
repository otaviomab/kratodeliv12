import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';

type ResourceType = 'establishment' | 'menu' | 'order' | 'customer';

/**
 * Middleware para verificar permissões em sistema multi-tenant
 * Garante que o usuário só acesse recursos do estabelecimento ao qual tem permissão
 * 
 * @param resourceType Tipo de recurso sendo acessado
 * @param resourceIdParamName Nome do parâmetro que contém o ID do recurso
 * @param handler Função handler para processar a requisição após verificação
 * @returns Função que processa a requisição
 */
export function withMultiTenantAuth(
  resourceType: ResourceType,
  resourceIdParamName: string,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Extrair ID do usuário da sessão
      const sessionCookie = req.cookies.get('a_session_')?.value;
      
      if (!sessionCookie) {
        return NextResponse.json(
          { error: 'Não autenticado' },
          { status: 401 }
        );
      }
      
      // Obter parâmetros da URL
      const url = new URL(req.url);
      const params = url.pathname.split('/');
      const resourceId = params.find((segment, index) => 
        params[index - 1] === resourceIdParamName || 
        segment === params.find(p => p.includes(resourceIdParamName)));
      
      if (!resourceId) {
        return NextResponse.json(
          { error: 'ID do recurso não encontrado na URL' },
          { status: 400 }
        );
      }
      
      // Extrair ID do estabelecimento com base no tipo de recurso
      let establishmentId: string | null = null;
      
      if (resourceType === 'establishment') {
        establishmentId = resourceId;
      } else {
        // Buscar o recurso para verificar a qual estabelecimento pertence
        const databaseId = 'kratodeliv_db';
        let collectionId = '';
        
        switch (resourceType) {
          case 'menu':
            collectionId = 'products';
            break;
          case 'order':
            collectionId = 'orders';
            break;
          case 'customer':
            collectionId = 'customers';
            break;
        }
        
        try {
          const resource = await databases.getDocument(databaseId, collectionId, resourceId);
          establishmentId = resource.establishmentId;
        } catch (error) {
          return NextResponse.json(
            { error: 'Recurso não encontrado' },
            { status: 404 }
          );
        }
      }
      
      // Verificar se o usuário tem permissão para acessar este estabelecimento
      const userId = req.cookies.get('userId')?.value;
      
      if (!userId) {
        return NextResponse.json(
          { error: 'ID do usuário não encontrado' },
          { status: 401 }
        );
      }
      
      // Verificar se o usuário é dono do estabelecimento
      try {
        const establishment = await databases.getDocument(
          'kratodeliv_db',
          'establishments',
          establishmentId
        );
        
        if (establishment.ownerId !== userId) {
          return NextResponse.json(
            { error: 'Sem permissão para acessar este recurso' },
            { status: 403 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Erro ao verificar permissões' },
          { status: 500 }
        );
      }
      
      // Se passou por todas as verificações, continuar com o handler
      return handler(req);
    } catch (error) {
      console.error('Erro ao verificar permissões multi-tenant:', error);
      return NextResponse.json(
        { error: 'Erro ao verificar permissões' },
        { status: 500 }
      );
    }
  };
} 