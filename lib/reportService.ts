import { databases } from './appwrite';
import { Query } from 'appwrite';
import { OrderStatus } from './orderService';

// Constantes
const DATABASE_ID = 'kratodeliv_db';
const ORDERS_COLLECTION_ID = 'orders';

// Interface para o item de pedido
interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

// Interface para o documento de pedido
interface OrderDocument {
  $id: string;
  $createdAt: string;
  total: number;
  status: string;
  establishmentId: string;
  paymentMethod: string;
  items: OrderItem[];
}

// Interfaces
interface SalesReport {
  totalSales: number;
  orderCount: number;
  averageTicket: number;
  salesByDate: Record<string, number>;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
}

interface TopProductsReport {
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  totalQuantity: number;
  totalRevenue: number;
}

interface RevenueReport {
  total: number;
  byDate: Record<string, number>;
  byWeekday: Record<string, number>;
  byMonth: Record<string, number>;
  growth: {
    percentageFromPreviousPeriod: number;
    trend: 'up' | 'down' | 'stable';
  };
}

/**
 * Formata uma data para o formato YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Classe para gerenciamento de relatórios
 */
export class ReportService {
  /**
   * Gera relatório de vendas por período
   */
  static async generateSalesReport(
    establishmentId: string,
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<SalesReport> {
    try {
      // Construir consultas
      const queries = [
        Query.equal('establishmentId', establishmentId),
        Query.greaterThanEqual('$createdAt', startDate),
        Query.lessThanEqual('$createdAt', endDate),
        Query.limit(100000) // Limite alto para trazer todos os registros
      ];

      // Buscar pedidos
      const result = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        queries
      );

      // Preparar dados iniciais
      const salesByDate: Record<string, number> = {};
      const salesByPaymentMethod: Record<string, number> = {};
      const salesByStatus: Record<string, number> = {};
      let totalSales = 0;

      // Processar documentos
      result.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;

        // Ignorar pedidos cancelados nas estatísticas de vendas
        if (typedOrder.status === OrderStatus.CANCELED) {
          // Apenas contabiliza na contagem por status
          if (salesByStatus[typedOrder.status]) {
            salesByStatus[typedOrder.status]++;
          } else {
            salesByStatus[typedOrder.status] = 1;
          }
          return;
        }

        // Calcular total de vendas
        totalSales += typedOrder.total || 0;

        // Agrupar por data conforme parâmetro
        const orderDate = new Date(typedOrder.$createdAt);
        let dateKey = '';

        if (groupBy === 'day') {
          dateKey = formatDate(orderDate);
        } else if (groupBy === 'week') {
          // Encontrar o primeiro dia da semana (domingo)
          const firstDayOfWeek = new Date(orderDate);
          const day = orderDate.getDay(); // 0 = Domingo, 1 = Segunda, etc.
          firstDayOfWeek.setDate(orderDate.getDate() - day);
          dateKey = formatDate(firstDayOfWeek);
        } else if (groupBy === 'month') {
          dateKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
        }

        // Acumular vendas por data
        if (salesByDate[dateKey]) {
          salesByDate[dateKey] += typedOrder.total || 0;
        } else {
          salesByDate[dateKey] = typedOrder.total || 0;
        }

        // Acumular por método de pagamento
        if (salesByPaymentMethod[typedOrder.paymentMethod]) {
          salesByPaymentMethod[typedOrder.paymentMethod] += typedOrder.total || 0;
        } else {
          salesByPaymentMethod[typedOrder.paymentMethod] = typedOrder.total || 0;
        }

        // Acumular por status
        if (salesByStatus[typedOrder.status]) {
          salesByStatus[typedOrder.status]++;
        } else {
          salesByStatus[typedOrder.status] = 1;
        }
      });

      // Calcular ticket médio (excluindo pedidos cancelados)
      const orderCount = Object.values(salesByStatus).reduce((acc, count) => acc + count, 0) - 
                         (salesByStatus[OrderStatus.CANCELED] || 0);
      const averageTicket = orderCount > 0 ? totalSales / orderCount : 0;

      return {
        totalSales,
        orderCount,
        averageTicket,
        salesByDate,
        salesByPaymentMethod,
        salesByStatus
      };
    } catch (error) {
      console.error('Erro ao gerar relatório de vendas:', error);
      throw new Error('Não foi possível gerar o relatório de vendas.');
    }
  }

  /**
   * Lista produtos mais vendidos em um período
   */
  static async listTopProducts(
    establishmentId: string,
    startDate: string,
    endDate: string,
    limit: number = 10
  ): Promise<TopProductsReport> {
    try {
      // Buscar pedidos no período
      const result = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('establishmentId', establishmentId),
          Query.greaterThanEqual('$createdAt', startDate),
          Query.lessThanEqual('$createdAt', endDate),
          // Excluir pedidos cancelados
          Query.notEqual('status', OrderStatus.CANCELED),
          Query.limit(100000) // Limite alto para trazer todos os registros
        ]
      );

      // Mapear produtos vendidos
      const productMap: Record<string, {
        id: string,
        name: string,
        quantity: number,
        revenue: number
      }> = {};

      // Processar documentos
      result.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        if (!typedOrder.items || !Array.isArray(typedOrder.items)) return;

        // Processar itens do pedido
        typedOrder.items.forEach((item: OrderItem) => {
          const productId = item.productId || 'unknown';
          const productName = item.name || 'Produto sem nome';
          const quantity = item.quantity || 0;
          const itemTotal = item.price * quantity;

          if (productMap[productId]) {
            productMap[productId].quantity += quantity;
            productMap[productId].revenue += itemTotal;
          } else {
            productMap[productId] = {
              id: productId,
              name: productName,
              quantity,
              revenue: itemTotal
            };
          }
        });
      });

      // Converter para array e ordenar por quantidade
      const productsArray = Object.values(productMap).sort((a, b) => b.quantity - a.quantity);

      // Calcular totais
      const totalQuantity = productsArray.reduce((acc, product) => acc + product.quantity, 0);
      const totalRevenue = productsArray.reduce((acc, product) => acc + product.revenue, 0);

      // Limitar a quantidade de produtos retornados
      const topProducts = productsArray.slice(0, limit);

      return {
        products: topProducts,
        totalQuantity,
        totalRevenue
      };
    } catch (error) {
      console.error('Erro ao listar produtos mais vendidos:', error);
      throw new Error('Não foi possível listar os produtos mais vendidos.');
    }
  }

  /**
   * Calcula faturamento por período com comparação
   */
  static async calculateRevenue(
    establishmentId: string,
    startDate: string,
    endDate: string,
    compareWithPreviousPeriod: boolean = true
  ): Promise<RevenueReport> {
    try {
      // Buscar pedidos no período atual
      const currentResult = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('establishmentId', establishmentId),
          Query.greaterThanEqual('$createdAt', startDate),
          Query.lessThanEqual('$createdAt', endDate),
          // Excluir pedidos cancelados
          Query.notEqual('status', OrderStatus.CANCELED),
          Query.limit(100000) // Limite alto para trazer todos os registros
        ]
      );

      // Calcular duração do período em dias
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

      // Calcular período anterior (mesmo número de dias)
      const previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - periodDuration);
      const previousEnd = new Date(previousStart);
      previousEnd.setDate(previousEnd.getDate() + periodDuration - 1);

      // Formatar datas para consulta
      const previousStartStr = previousStart.toISOString();
      const previousEndStr = previousEnd.toISOString();

      // Buscar pedidos do período anterior
      let previousResult = { documents: [], total: 0 };
      if (compareWithPreviousPeriod) {
        previousResult = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [
            Query.equal('establishmentId', establishmentId),
            Query.greaterThanEqual('$createdAt', previousStartStr),
            Query.lessThanEqual('$createdAt', previousEndStr),
            // Excluir pedidos cancelados
            Query.notEqual('status', OrderStatus.CANCELED),
            Query.limit(100000)
          ]
        );
      }

      // Preparar dados de faturamento
      const byDate: Record<string, number> = {};
      const byWeekday: Record<string, number> = {
        'Domingo': 0, 'Segunda': 0, 'Terça': 0, 'Quarta': 0, 
        'Quinta': 0, 'Sexta': 0, 'Sábado': 0
      };
      const byMonth: Record<string, number> = {};
      let totalCurrent = 0;

      // Processar pedidos do período atual
      currentResult.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        const total = typedOrder.total || 0;
        totalCurrent += total;

        // Agrupar por data
        const orderDate = new Date(typedOrder.$createdAt);
        const dateKey = formatDate(orderDate);
        
        if (byDate[dateKey]) {
          byDate[dateKey] += total;
        } else {
          byDate[dateKey] = total;
        }

        // Agrupar por dia da semana
        const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const weekday = weekdays[orderDate.getDay()];
        byWeekday[weekday] += total;

        // Agrupar por mês
        const monthKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`;
        if (byMonth[monthKey]) {
          byMonth[monthKey] += total;
        } else {
          byMonth[monthKey] = total;
        }
      });

      // Calcular total do período anterior
      let totalPrevious = 0;
      previousResult.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        totalPrevious += typedOrder.total || 0;
      });

      // Calcular crescimento
      let percentageFromPreviousPeriod = 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';

      if (compareWithPreviousPeriod && totalPrevious > 0) {
        percentageFromPreviousPeriod = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
        trend = percentageFromPreviousPeriod > 0 ? 'up' : (percentageFromPreviousPeriod < 0 ? 'down' : 'stable');
      } else if (compareWithPreviousPeriod) {
        // Se não havia vendas no período anterior, mas há agora
        if (totalCurrent > 0) {
          percentageFromPreviousPeriod = 100;
          trend = 'up';
        }
      }

      return {
        total: totalCurrent,
        byDate,
        byWeekday,
        byMonth,
        growth: {
          percentageFromPreviousPeriod,
          trend
        }
      };
    } catch (error) {
      console.error('Erro ao calcular faturamento:', error);
      throw new Error('Não foi possível calcular o faturamento.');
    }
  }

  /**
   * Calcula ticket médio por período
   */
  static async calculateAverageTicket(
    establishmentId: string,
    startDate: string,
    endDate: string,
    compareWithPreviousPeriod: boolean = true
  ): Promise<{
    currentPeriod: number,
    previousPeriod: number,
    percentageChange: number,
    trend: 'up' | 'down' | 'stable'
  }> {
    try {
      // Utilizar o método de cálculo de faturamento que já implementamos
      const revenueReport = await this.calculateRevenue(
        establishmentId,
        startDate,
        endDate,
        compareWithPreviousPeriod
      );

      // Buscar quantidade de pedidos no período atual
      const currentOrdersResult = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('establishmentId', establishmentId),
          Query.greaterThanEqual('$createdAt', startDate),
          Query.lessThanEqual('$createdAt', endDate),
          // Excluir pedidos cancelados
          Query.notEqual('status', OrderStatus.CANCELED),
        ]
      );

      // Calcular duração do período em dias para o período anterior
      const start = new Date(startDate);
      const end = new Date(endDate);
      const periodDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

      // Calcular período anterior
      const previousStart = new Date(start);
      previousStart.setDate(previousStart.getDate() - periodDuration);
      const previousEnd = new Date(previousStart);
      previousEnd.setDate(previousEnd.getDate() + periodDuration - 1);

      // Formatar datas para consulta
      const previousStartStr = previousStart.toISOString();
      const previousEndStr = previousEnd.toISOString();

      // Buscar quantidade de pedidos do período anterior
      let previousOrdersCount = 0;
      if (compareWithPreviousPeriod) {
        const previousOrdersResult = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [
            Query.equal('establishmentId', establishmentId),
            Query.greaterThanEqual('$createdAt', previousStartStr),
            Query.lessThanEqual('$createdAt', previousEndStr),
            // Excluir pedidos cancelados
            Query.notEqual('status', OrderStatus.CANCELED),
          ]
        );
        previousOrdersCount = previousOrdersResult.total;
      }

      // Calcular ticket médio do período atual
      const currentOrdersCount = currentOrdersResult.total;
      const currentTicket = currentOrdersCount > 0 ? revenueReport.total / currentOrdersCount : 0;

      // Calcular ticket médio do período anterior
      // Reutilizar o valor do faturamento anterior do relatório de receita
      const previousPeriodRevenue = revenueReport.total - 
        (revenueReport.growth.percentageFromPreviousPeriod * revenueReport.total / 100);
      
      const previousTicket = previousOrdersCount > 0 ? previousPeriodRevenue / previousOrdersCount : 0;

      // Calcular variação percentual
      let percentageChange = 0;
      let trend: 'up' | 'down' | 'stable' = 'stable';

      if (compareWithPreviousPeriod && previousTicket > 0) {
        percentageChange = ((currentTicket - previousTicket) / previousTicket) * 100;
        trend = percentageChange > 0 ? 'up' : (percentageChange < 0 ? 'down' : 'stable');
      } else if (compareWithPreviousPeriod) {
        if (currentTicket > 0) {
          percentageChange = 100;
          trend = 'up';
        }
      }

      return {
        currentPeriod: currentTicket,
        previousPeriod: previousTicket,
        percentageChange,
        trend
      };
    } catch (error) {
      console.error('Erro ao calcular ticket médio:', error);
      throw new Error('Não foi possível calcular o ticket médio.');
    }
  }

  /**
   * Gera estatísticas de desempenho e comparativos
   */
  static async generatePerformanceStats(
    establishmentId: string,
    periodType: 'daily' | 'weekly' | 'monthly' | 'yearly',
    compareWithPrevious: boolean = true
  ): Promise<{
    revenue: {
      current: number,
      previous: number,
      percentageChange: number
    },
    orders: {
      current: number,
      previous: number,
      percentageChange: number
    },
    averageTicket: {
      current: number,
      previous: number,
      percentageChange: number
    },
    topProducts: Array<{
      name: string,
      quantity: number,
      revenue: number
    }>,
    salesByWeekday: Record<string, number>
  }> {
    try {
      // Definir período com base no tipo
      const now = new Date();
      let startDate: Date, endDate: Date, previousStartDate: Date, previousEndDate: Date;

      switch(periodType) {
        case 'daily':
          // Hoje
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = now;
          // Ontem
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(previousStartDate.getDate() - 1);
          previousEndDate = new Date(previousStartDate);
          previousEndDate.setHours(23, 59, 59, 999);
          break;

        case 'weekly':
          // Semana atual (começando no domingo)
          const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Segunda, etc.
          startDate = new Date(now);
          startDate.setDate(now.getDate() - dayOfWeek);
          startDate.setHours(0, 0, 0, 0);
          endDate = now;
          // Semana anterior
          previousStartDate = new Date(startDate);
          previousStartDate.setDate(previousStartDate.getDate() - 7);
          previousEndDate = new Date(startDate);
          previousEndDate.setDate(previousEndDate.getDate() - 1);
          previousEndDate.setHours(23, 59, 59, 999);
          break;

        case 'monthly':
          // Mês atual
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = now;
          // Mês anterior
          previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
          previousEndDate.setHours(23, 59, 59, 999);
          break;

        case 'yearly':
          // Ano atual
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = now;
          // Ano anterior
          previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
          previousEndDate = new Date(now.getFullYear() - 1, 11, 31);
          previousEndDate.setHours(23, 59, 59, 999);
          break;
      }

      // Formatar datas para consulta
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const previousStartDateStr = previousStartDate.toISOString();
      const previousEndDateStr = previousEndDate.toISOString();

      // Buscar pedidos do período atual
      const currentOrders = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('establishmentId', establishmentId),
          Query.greaterThanEqual('$createdAt', startDateStr),
          Query.lessThanEqual('$createdAt', endDateStr),
          // Excluir pedidos cancelados
          Query.notEqual('status', OrderStatus.CANCELED),
        ]
      );

      // Buscar pedidos do período anterior
      let previousOrders = { documents: [], total: 0 };
      if (compareWithPrevious) {
        previousOrders = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [
            Query.equal('establishmentId', establishmentId),
            Query.greaterThanEqual('$createdAt', previousStartDateStr),
            Query.lessThanEqual('$createdAt', previousEndDateStr),
            // Excluir pedidos cancelados
            Query.notEqual('status', OrderStatus.CANCELED),
          ]
        );
      }

      // Calcular receita atual
      let currentRevenue = 0;
      currentOrders.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        currentRevenue += typedOrder.total || 0;
      });

      // Calcular receita anterior
      let previousRevenue = 0;
      previousOrders.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        previousRevenue += typedOrder.total || 0;
      });

      // Calcular ticket médio
      const currentOrderCount = currentOrders.total;
      const previousOrderCount = previousOrders.total;
      
      const currentTicket = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;
      const previousTicket = previousOrderCount > 0 ? previousRevenue / previousOrderCount : 0;

      // Calcular variação percentual
      const revenueChange = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : (currentRevenue > 0 ? 100 : 0);
        
      const orderChange = previousOrderCount > 0 
        ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 
        : (currentOrderCount > 0 ? 100 : 0);
        
      const ticketChange = previousTicket > 0 
        ? ((currentTicket - previousTicket) / previousTicket) * 100 
        : (currentTicket > 0 ? 100 : 0);

      // Calcular vendas por dia da semana
      const salesByWeekday: Record<string, number> = {
        'Domingo': 0, 'Segunda': 0, 'Terça': 0, 'Quarta': 0, 
        'Quinta': 0, 'Sexta': 0, 'Sábado': 0
      };

      const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      
      currentOrders.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        const orderDate = new Date(typedOrder.$createdAt);
        const weekday = weekdays[orderDate.getDay()];
        salesByWeekday[weekday] += typedOrder.total || 0;
      });

      // Calcular produtos mais vendidos
      const productMap: Record<string, {
        name: string,
        quantity: number,
        revenue: number
      }> = {};

      // Processar itens de pedidos
      currentOrders.documents.forEach((order: any) => {
        const typedOrder = order as OrderDocument;
        if (!typedOrder.items || !Array.isArray(typedOrder.items)) return;

        typedOrder.items.forEach((item: OrderItem) => {
          const productName = item.name || 'Produto sem nome';
          const quantity = item.quantity || 0;
          const revenue = (item.price || 0) * quantity;

          if (productMap[productName]) {
            productMap[productName].quantity += quantity;
            productMap[productName].revenue += revenue;
          } else {
            productMap[productName] = {
              name: productName,
              quantity,
              revenue
            };
          }
        });
      });

      // Converter para array e ordenar
      const topProducts = Object.values(productMap)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      return {
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          percentageChange: revenueChange
        },
        orders: {
          current: currentOrderCount,
          previous: previousOrderCount,
          percentageChange: orderChange
        },
        averageTicket: {
          current: currentTicket,
          previous: previousTicket,
          percentageChange: ticketChange
        },
        topProducts,
        salesByWeekday
      };
    } catch (error) {
      console.error('Erro ao gerar estatísticas de desempenho:', error);
      throw new Error('Não foi possível gerar estatísticas de desempenho.');
    }
  }
} 