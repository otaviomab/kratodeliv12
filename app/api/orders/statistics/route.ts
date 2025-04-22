import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/orderService';

// Rota para obter estatísticas de pedidos para o dashboard
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extrair parâmetros
    const establishmentId = searchParams.get('establishmentId');
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');
    
    // Validar parâmetros obrigatórios
    if (!establishmentId) {
      return NextResponse.json(
        { error: "ID do estabelecimento é obrigatório" },
        { status: 400 }
      );
    }
    
    // Buscar estatísticas usando o serviço
    const statistics = await OrderService.calculateOrderStatistics(
      establishmentId,
      dateStart || undefined,
      dateEnd || undefined
    );
    
    return NextResponse.json({ statistics });
  } catch (error: any) {
    console.error("Erro ao calcular estatísticas de pedidos:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao calcular estatísticas de pedidos" },
      { status: 500 }
    );
  }
} 