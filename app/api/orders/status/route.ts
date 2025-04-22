import { NextResponse } from 'next/server';
import { OrderService, OrderStatus } from '@/lib/orderService';

// Manipulador para atualizar status de pedido
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validar dados recebidos
    if (!data.orderId || !data.status) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }
    
    // Verificar se o status é válido
    if (!Object.values(OrderStatus).includes(data.status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }
    
    // Atualizar status usando o serviço
    const updatedOrder = await OrderService.updateOrderStatus(
      data.orderId, 
      data.status, 
      data.note
    );
    
    return NextResponse.json({
      order: updatedOrder,
      message: `Status do pedido atualizado para ${data.status}`
    });
  } catch (error: any) {
    console.error("Erro ao atualizar status do pedido:", error);
    
    // Verifica se é erro 404 (pedido não encontrado)
    if (error.message && error.message.includes('not found')) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }
    
    // Tratar erros específicos de transição de status
    if (error.message && error.message.includes('Transição de status inválida')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar status do pedido" },
      { status: 500 }
    );
  }
} 