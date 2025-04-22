import { ID, Query, Permission, Role } from 'appwrite';
import { databases } from './appwrite';
import { Order, OrderItem, StatusHistoryItem } from '../types/order';

// Enums para status e outros valores
export enum OrderStatus {
  PENDING = "PENDING",       // Aguardando confirmação
  CONFIRMED = "CONFIRMED",   // Confirmado pelo restaurante
  PREPARING = "PREPARING",   // Em preparação
  READY = "READY",           // Pronto para entrega/retirada
  DELIVERED = "DELIVERED",   // Entregue
  CANCELED = "CANCELED"      // Cancelado
}

export enum PaymentMethod {
  CASH = "CASH",            // Dinheiro
  CARD = "CARD",            // Cartão (no local)
  PIX = "PIX",              // PIX
  ONLINE = "ONLINE"         // Pagamento online
}

export enum PaymentStatus {
  PENDING = "PENDING",      // Aguardando pagamento
  PAID = "PAID",            // Pago
  FAILED = "FAILED",        // Falhou
  REFUNDED = "REFUNDED"     // Reembolsado
}

// Constantes
const DATABASE_ID = 'kratodeliv_db';
const COLLECTION_ID = 'orders';

// Interface para criação de pedido
interface OrderCreate {
  customerName: string;
  customerPhone: string;
  customerAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  establishmentId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
    additionals: {
      name: string;
      options: {
        name: string;
        price: number;
      }[];
    }[];
  }[];
  deliveryType: 'delivery' | 'pickup';
  deliveryFee: number;
  paymentMethod: string;
  change?: number;
  notes?: string;
}

// Interface para filtros de pedidos
interface OrderFilter {
  establishmentId?: string;
  status?: string | string[];
  dateStart?: string;
  dateEnd?: string;
  paymentMethod?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export class OrderService {
  /**
   * Cria um novo pedido
   */
  static async createOrder(data: OrderCreate): Promise<Order> {
    try {
      // Validar dados recebidos
      if (!data.items || data.items.length === 0) {
        throw new Error('O pedido deve conter pelo menos um item');
      }

      if (!data.customerName || !data.customerPhone) {
        throw new Error('Informações do cliente são obrigatórias');
      }

      if (!data.establishmentId) {
        throw new Error('ID do estabelecimento é obrigatório');
      }

      // Calcular preços
      const subtotal = data.items.reduce((sum, item) => {
        // Calcular preço dos adicionais
        const additionalsPrice = item.additionals.reduce((addSum, additional) => {
          return addSum + additional.options.reduce((optSum, option) => optSum + option.price, 0);
        }, 0);
        
        // Preço total do item = (preço unitário + adicionais) * quantidade
        const itemTotalPrice = (item.unitPrice + additionalsPrice) * item.quantity;
        return sum + itemTotalPrice;
      }, 0);

      // Calcular total do pedido
      const total = subtotal + data.deliveryFee;

      // Preparar itens do pedido
      const orderItems: OrderItem[] = data.items.map(item => {
        // Calcular preço dos adicionais
        const additionalsPrice = item.additionals.reduce((addSum, additional) => {
          return addSum + additional.options.reduce((optSum, option) => optSum + option.price, 0);
        }, 0);
        
        // Preço total do item = (preço unitário + adicionais) * quantidade
        const itemTotalPrice = (item.unitPrice + additionalsPrice) * item.quantity;
        
        return {
          id: ID.unique(),
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: itemTotalPrice,
          notes: item.notes,
          additionals: item.additionals,
        };
      });

      // Obter o próximo número do pedido
      // Isso poderia ser implementado buscando o maior número de pedido atual + 1
      // Por simplicidade, estamos usando timestamp, mas em produção deveria 
      // ter uma lógica mais robusta como contador sequencial do estabelecimento
      const orderNumber = Math.floor(Date.now() / 1000);

      // Criar histórico de status inicial
      const statusHistory: StatusHistoryItem[] = [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date().toISOString(),
        }
      ];

      // Criar o documento no Appwrite
      const orderData = {
        number: orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        establishmentId: data.establishmentId,
        items: orderItems,
        status: OrderStatus.PENDING,
        deliveryType: data.deliveryType,
        deliveryFee: data.deliveryFee,
        subtotal: subtotal,
        total: total,
        paymentMethod: data.paymentMethod,
        change: data.change || 0,
        notes: data.notes || '',
        statusHistory: statusHistory,
      };

      // Definir permissões para o documento
      const permissions = [
        Permission.read(Role.user(data.establishmentId)),
        Permission.update(Role.user(data.establishmentId)),
        Permission.delete(Role.user(data.establishmentId)),
      ];

      // Criar o documento no Appwrite
      const order = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        orderData,
        permissions
      );

      return {
        id: order.$id,
        number: order.number,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        establishmentId: order.establishmentId,
        items: order.items,
        status: order.status,
        deliveryType: order.deliveryType,
        deliveryFee: order.deliveryFee,
        subtotal: order.subtotal,
        total: order.total,
        paymentMethod: order.paymentMethod,
        change: order.change,
        notes: order.notes,
        createdAt: order.$createdAt,
        updatedAt: order.$updatedAt,
        statusHistory: order.statusHistory,
      };
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  }

  /**
   * Lista pedidos por estabelecimento com filtros
   */
  static async listOrders(filter: OrderFilter): Promise<{ orders: Order[], total: number }> {
    try {
      // Construir as consultas
      const queries: string[] = [];

      // Filtro por estabelecimento (obrigatório)
      if (filter.establishmentId) {
        queries.push(Query.equal('establishmentId', filter.establishmentId));
      }

      // Filtro por status
      if (filter.status) {
        if (Array.isArray(filter.status)) {
          // Múltiplos status
          const statusQueries = filter.status.map(status => 
            Query.equal('status', status)
          );
          // Use Query.or para combinar as consultas de status
          if (statusQueries.length > 0) {
            const orQuery = Query.or(statusQueries);
            queries.push(orQuery);
          }
        } else {
          // Status único
          queries.push(Query.equal('status', filter.status));
        }
      }

      // Filtro por data
      if (filter.dateStart) {
        queries.push(Query.greaterThanEqual('$createdAt', filter.dateStart));
      }

      if (filter.dateEnd) {
        queries.push(Query.lessThanEqual('$createdAt', filter.dateEnd));
      }

      // Filtro por método de pagamento
      if (filter.paymentMethod) {
        queries.push(Query.equal('paymentMethod', filter.paymentMethod));
      }

      // Paginação
      const limit = filter.limit || 10;
      const offset = filter.offset || 0;
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset));

      // Ordenar por data, mais recentes primeiro
      queries.push(Query.orderDesc('$createdAt'));

      // Buscar total de registros (sem paginação)
      const countQueries = [...queries];
      // Remover limit e offset para contagem
      const limitIndex = countQueries.findIndex(q => q.includes('limit'));
      if (limitIndex !== -1) countQueries.splice(limitIndex, 1);
      const offsetIndex = countQueries.findIndex(q => q.includes('offset'));
      if (offsetIndex !== -1) countQueries.splice(offsetIndex, 1);

      // Fazer a consulta para obter o total
      const totalResult = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        countQueries
      );

      // Buscar pedidos com paginação
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      // Mapear resultados
      const orders = result.documents.map(doc => ({
        id: doc.$id,
        number: doc.number,
        customerName: doc.customerName,
        customerPhone: doc.customerPhone,
        customerAddress: doc.customerAddress,
        establishmentId: doc.establishmentId,
        items: doc.items,
        status: doc.status,
        deliveryType: doc.deliveryType,
        deliveryFee: doc.deliveryFee,
        subtotal: doc.subtotal,
        total: doc.total,
        paymentMethod: doc.paymentMethod,
        change: doc.change,
        notes: doc.notes,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
        statusHistory: doc.statusHistory,
      }));

      return {
        orders,
        total: totalResult.total
      };
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      throw error;
    }
  }

  /**
   * Busca detalhes de um pedido específico por ID
   */
  static async getOrderById(orderId: string): Promise<Order> {
    try {
      const order = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        orderId
      );

      return {
        id: order.$id,
        number: order.number,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        establishmentId: order.establishmentId,
        items: order.items,
        status: order.status,
        deliveryType: order.deliveryType,
        deliveryFee: order.deliveryFee,
        subtotal: order.subtotal,
        total: order.total,
        paymentMethod: order.paymentMethod,
        change: order.change,
        notes: order.notes,
        createdAt: order.$createdAt,
        updatedAt: order.$updatedAt,
        statusHistory: order.statusHistory,
      };
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um pedido com histórico
   */
  static async updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<Order> {
    try {
      // Verificar se o status é válido
      if (!Object.values(OrderStatus).includes(newStatus)) {
        throw new Error('Status inválido');
      }

      // Buscar o pedido atual
      const currentOrder = await this.getOrderById(orderId);

      // Verificar se o status atual é o mesmo
      if (currentOrder.status === newStatus) {
        throw new Error('O pedido já está com este status');
      }

      // Verificar se a transição de status é válida
      if (!this.isValidStatusTransition(currentOrder.status as OrderStatus, newStatus)) {
        throw new Error('Transição de status inválida');
      }

      // Criar novo item no histórico de status
      const statusHistoryItem: StatusHistoryItem = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note
      };

      // Adicionar ao histórico
      const updatedStatusHistory = [
        ...currentOrder.statusHistory,
        statusHistoryItem
      ];

      // Atualizar o pedido
      const updatedOrder = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        orderId,
        {
          status: newStatus,
          statusHistory: updatedStatusHistory
        }
      );

      return {
        id: updatedOrder.$id,
        number: updatedOrder.number,
        customerName: updatedOrder.customerName,
        customerPhone: updatedOrder.customerPhone,
        customerAddress: updatedOrder.customerAddress,
        establishmentId: updatedOrder.establishmentId,
        items: updatedOrder.items,
        status: updatedOrder.status,
        deliveryType: updatedOrder.deliveryType,
        deliveryFee: updatedOrder.deliveryFee,
        subtotal: updatedOrder.subtotal,
        total: updatedOrder.total,
        paymentMethod: updatedOrder.paymentMethod,
        change: updatedOrder.change,
        notes: updatedOrder.notes,
        createdAt: updatedOrder.$createdAt,
        updatedAt: updatedOrder.$updatedAt,
        statusHistory: updatedOrder.statusHistory,
      };
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      throw error;
    }
  }

  /**
   * Calcula estatísticas de pedidos para o dashboard
   */
  static async calculateOrderStatistics(
    establishmentId: string, 
    dateStart?: string,
    dateEnd?: string
  ): Promise<{
    totalOrders: number;
    totalSales: number;
    averageTicket: number;
    ordersByStatus: Record<string, number>;
    ordersByPaymentMethod: Record<string, number>;
  }> {
    try {
      // Construir as consultas
      const queries: string[] = [];

      // Filtro por estabelecimento (obrigatório)
      queries.push(Query.equal('establishmentId', establishmentId));

      // Filtro por data
      if (dateStart) {
        queries.push(Query.greaterThanEqual('$createdAt', dateStart));
      }

      if (dateEnd) {
        queries.push(Query.lessThanEqual('$createdAt', dateEnd));
      }

      // Buscar todos os pedidos no período
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        queries
      );

      // Preparar estatísticas
      let totalSales = 0;
      const ordersByStatus: Record<string, number> = {};
      const ordersByPaymentMethod: Record<string, number> = {};

      // Processar os dados
      result.documents.forEach(order => {
        // Somar vendas
        totalSales += order.total;

        // Contar por status
        if (ordersByStatus[order.status]) {
          ordersByStatus[order.status]++;
        } else {
          ordersByStatus[order.status] = 1;
        }

        // Contar por método de pagamento
        if (ordersByPaymentMethod[order.paymentMethod]) {
          ordersByPaymentMethod[order.paymentMethod]++;
        } else {
          ordersByPaymentMethod[order.paymentMethod] = 1;
        }
      });

      // Calcular ticket médio
      const totalOrders = result.total;
      const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

      return {
        totalOrders,
        totalSales,
        averageTicket,
        ordersByStatus,
        ordersByPaymentMethod
      };
    } catch (error) {
      console.error("Erro ao calcular estatísticas de pedidos:", error);
      throw error;
    }
  }

  /**
   * Verifica se a transição de status é válida
   * Ex: Um pedido DELIVERED não pode voltar para PREPARING
   */
  private static isValidStatusTransition(
    currentStatus: OrderStatus, 
    newStatus: OrderStatus
  ): boolean {
    // Mapeamento de transições permitidas
    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [
        OrderStatus.CONFIRMED, 
        OrderStatus.CANCELED
      ],
      [OrderStatus.CONFIRMED]: [
        OrderStatus.PREPARING, 
        OrderStatus.CANCELED
      ],
      [OrderStatus.PREPARING]: [
        OrderStatus.READY, 
        OrderStatus.CANCELED
      ],
      [OrderStatus.READY]: [
        OrderStatus.DELIVERED, 
        OrderStatus.CANCELED
      ],
      [OrderStatus.DELIVERED]: [
        OrderStatus.CANCELED
      ],
      [OrderStatus.CANCELED]: [] // Não pode sair deste estado
    };

    return allowedTransitions[currentStatus].includes(newStatus);
  }
} 