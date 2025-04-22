import client from './appwrite';
import { Models } from 'appwrite';
import { Order } from '../types/order';

// Constantes
const DATABASE_ID = 'kratodeliv_db';
const COLLECTION_ID = 'orders';

export class NotificationService {
  private static subscriptions: {
    [key: string]: () => void
  } = {};

  /**
   * Inscreve-se para receber notificações de novos pedidos para um estabelecimento
   */
  static subscribeToNewOrders(
    establishmentId: string,
    callback: (order: Order) => void
  ): string {
    const subscriptionId = `orders-${establishmentId}-${Date.now()}`;
    
    // Inscrever-se para eventos de criação de documentos na coleção orders
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      (response) => {
        // Verificar se é evento de criação
        if (response.events.includes(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.create`)) {
          const order = response.payload as unknown as Models.Document & Order;
          
          // Verificar se o pedido é para o estabelecimento inscrito
          if (order.establishmentId === establishmentId) {
            // Mapear para o formato Order
            const mappedOrder: Order = {
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
            
            // Chamar o callback
            callback(mappedOrder);
          }
        }
      }
    );
    
    // Guardar função de cancelamento
    this.subscriptions[subscriptionId] = unsubscribe;
    
    return subscriptionId;
  }

  /**
   * Inscreve-se para receber notificações de atualização de status de pedidos
   */
  static subscribeToOrderStatusUpdates(
    orderId: string,
    callback: (order: Order) => void
  ): string {
    const subscriptionId = `order-status-${orderId}-${Date.now()}`;
    
    // Inscrever-se para eventos de atualização do documento específico
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.${orderId}`,
      (response) => {
        // Verificar se é evento de atualização
        if (response.events.includes(`databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents.${orderId}.update`)) {
          const order = response.payload as unknown as Models.Document & Order;
          
          // Mapear para o formato Order
          const mappedOrder: Order = {
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
          
          // Chamar o callback
          callback(mappedOrder);
        }
      }
    );
    
    // Guardar função de cancelamento
    this.subscriptions[subscriptionId] = unsubscribe;
    
    return subscriptionId;
  }

  /**
   * Cancela uma inscrição
   */
  static unsubscribe(subscriptionId: string): boolean {
    if (this.subscriptions[subscriptionId]) {
      this.subscriptions[subscriptionId]();
      delete this.subscriptions[subscriptionId];
      return true;
    }
    return false;
  }

  /**
   * Cancela todas as inscrições
   */
  static unsubscribeAll(): void {
    Object.keys(this.subscriptions).forEach(id => {
      this.subscriptions[id]();
    });
    this.subscriptions = {};
  }
} 