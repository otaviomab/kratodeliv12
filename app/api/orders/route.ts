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

// Enum para método de pagamento
enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  PIX = "PIX",
  ONLINE = "ONLINE"
}

// Enum para status do pagamento
enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

// Interface para itens do pedido
interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  observations?: string;
}

// Interface para itens recebidos na requisição
interface OrderItemInput {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  observations?: string;
}

// Interface para pedidos
interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  table?: number | null;
  createdAt: string;
  updatedAt: string;
}

// Simulação de banco de dados para pedidos
const orders: Order[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  let filteredOrders = [...orders];
  
  // Filtrar por status
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }
  
  return NextResponse.json({ orders: filteredOrders });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // Validar dados recebidos
  if (!data.items || !data.items.length || !data.customerName || !data.paymentMethod) {
    return NextResponse.json(
      { error: "Dados do pedido incompletos" },
      { status: 400 }
    );
  }
  
  // Calcular total do pedido
  const total = data.items.reduce(
    (sum: number, item: OrderItemInput) => sum + (item.unitPrice * item.quantity), 
    0
  );
  
  // Criar novo pedido
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    status: OrderStatus.PENDING,
    total,
    items: data.items.map((item: OrderItemInput) => ({
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      observations: item.observations
    })),
    customerName: data.customerName,
    customerPhone: data.customerPhone || "",
    paymentMethod: data.paymentMethod,
    paymentStatus: PaymentStatus.PENDING,
    table: data.table || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Adicionar à lista de pedidos
  orders.push(newOrder);
  
  // Simulação de informação de pagamento para PIX
  let paymentInfo = null;
  if (data.paymentMethod === PaymentMethod.PIX) {
    paymentInfo = {
      pixCode: "00020126360014BR.GOV.BCB.PIX0114115533607700520400005303986540510.005802BR5913Krato Delivery6008Sao Paulo62070503***63041234",
      pixImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    };
  }
  
  return NextResponse.json({
    order: newOrder,
    paymentInfo,
    message: "Pedido criado com sucesso"
  }, { status: 201 });
} 