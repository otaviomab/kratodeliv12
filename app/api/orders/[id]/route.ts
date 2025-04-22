import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/orderService';

// Manipulador para obter um pedido específico por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    if (!orderId) {
      return NextResponse.json(
        { error: "ID do pedido é obrigatório" },
        { status: 400 }
      );
    }
    
    const order = await OrderService.getOrderById(orderId);
    
    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Erro ao buscar pedido:", error);
    
    // Verifica se é erro 404 (pedido não encontrado)
    if (error.message && error.message.includes('not found')) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
} 