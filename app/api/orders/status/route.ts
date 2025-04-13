import { NextResponse } from 'next/server';

// Enum para status do pedido
enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}

// Mock orders para simulação (em um ambiente real, isso estaria em um banco de dados)
// Esta é apenas uma simulação, então usando um objeto para facilitar a busca por ID
const mockOrders: Record<string, { id: string; status: OrderStatus; updatedAt: string }> = {
  "ord-123456789": {
    id: "ord-123456789",
    status: OrderStatus.PENDING,
    updatedAt: new Date().toISOString()
  }
};

export async function PUT(request: Request) {
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
  
  // Verificar se o pedido existe
  if (!mockOrders[data.orderId]) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }
  
  // Atualizar o status
  mockOrders[data.orderId].status = data.status;
  mockOrders[data.orderId].updatedAt = new Date().toISOString();
  
  return NextResponse.json({
    id: data.orderId,
    status: data.status,
    updatedAt: mockOrders[data.orderId].updatedAt
  });
} 