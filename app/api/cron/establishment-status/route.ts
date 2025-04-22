import { NextResponse } from 'next/server';
import { checkEstablishmentStatus } from '@/app/api/functions/check-establishment-status';

/**
 * Endpoint para ser chamado por um cron job para atualizar o status dos estabelecimentos
 * Este endpoint deve ser chamado a cada 5 ou 10 minutos para manter os estabelecimentos atualizados
 */
export async function GET(request: Request) {
  try {
    // Verificar token de autorização (opcional, se quiser proteger o endpoint)
    const authHeader = request.headers.get('authorization');
    
    // Configuração onde você pode adicionar um token de segurança para este endpoint
    const expectedToken = process.env.CRON_SECRET_TOKEN;
    
    // Se houver um token configurado, validar
    if (expectedToken && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== expectedToken)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Executar a verificação de status dos estabelecimentos
    const result = await checkEstablishmentStatus();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Status dos estabelecimentos atualizado com sucesso',
        timestamp: result.timestamp
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao atualizar status dos estabelecimentos',
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erro no cron job de verificação de status:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno no servidor',
      error: (error as Error).message
    }, { status: 500 });
  }
} 