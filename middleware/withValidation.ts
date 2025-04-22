import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Middleware para validar dados de requisições usando Zod
 * 
 * @param schema Esquema Zod para validação
 * @param handler Função handler para processar a requisição após validação
 * @returns Função que processa a requisição
 */
export function withValidation<T>(
  schema: z.Schema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Extrair dados da requisição
      const body = await req.json().catch(() => ({}));
      
      // Validar dados
      const result = schema.safeParse(body);
      
      if (!result.success) {
        // Formatação dos erros para uma resposta mais clara
        const formattedErrors = result.error.format();
        
        return NextResponse.json(
          { 
            error: 'Dados inválidos',
            details: formattedErrors
          },
          { status: 400 }
        );
      }
      
      // Se a validação for bem-sucedida, passar os dados validados para o handler
      return handler(req, result.data);
    } catch (error) {
      console.error('Erro ao processar requisição:', error);
      return NextResponse.json(
        { error: 'Erro ao processar requisição' },
        { status: 500 }
      );
    }
  };
} 