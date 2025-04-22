import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/orderService';

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

// Manipulador para obter pedidos (GET)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extrair parâmetros de consulta
    const establishmentId = searchParams.get('establishmentId');
    const status = searchParams.get('status');
    const dateStart = searchParams.get('dateStart');
    const dateEnd = searchParams.get('dateEnd');
    const paymentMethod = searchParams.get('paymentMethod');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    // Validar parâmetros obrigatórios
    if (!establishmentId) {
      return NextResponse.json(
        { error: "ID do estabelecimento é obrigatório" },
        { status: 400 }
      );
    }
    
    // Preparar filtros
    const filter = {
      establishmentId,
      status: status || undefined,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
      paymentMethod: paymentMethod || undefined,
      limit,
      offset
    };
    
    // Listar pedidos usando o serviço
    const result = await OrderService.listOrders(filter);
    
    return NextResponse.json({
      orders: result.orders,
      meta: {
        total: result.total,
        limit,
        offset
      }
    });
  } catch (error: any) {
    console.error("Erro ao listar pedidos:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}

// Manipulador para criar novo pedido (POST)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validar dados recebidos
    if (!data.items || !data.items.length || !data.customerName || !data.customerPhone || !data.establishmentId) {
      return NextResponse.json(
        { error: "Dados do pedido incompletos" },
        { status: 400 }
      );
    }
    
    // Criar pedido usando o serviço
    const order = await OrderService.createOrder(data);
    
    // Simulação de informação de pagamento para PIX
    let paymentInfo = null;
    if (data.paymentMethod === 'PIX') {
      paymentInfo = {
        pixCode: "00020126360014BR.GOV.BCB.PIX0114115533607700520400005303986540510.005802BR5913Krato Delivery6008Sao Paulo62070503***63041234",
        pixImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
      };
    }
    
    return NextResponse.json({
      order,
      paymentInfo,
      message: "Pedido criado com sucesso"
    }, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar pedido" },
      { status: 500 }
    );
  }
} 