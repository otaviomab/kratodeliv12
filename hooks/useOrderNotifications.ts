'use client';

import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/lib/notificationService';
import { Order } from '@/types/order';

type UseOrderNotificationsProps = {
  establishmentId?: string;
  onNewOrder?: (order: Order) => void;
};

export function useOrderNotifications({ 
  establishmentId,
  onNewOrder
}: UseOrderNotificationsProps) {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inscrever-se para receber notificações de novos pedidos
  const subscribe = useCallback(() => {
    if (!establishmentId) {
      setError('ID do estabelecimento é necessário para inscrever-se para notificações');
      return;
    }

    try {
      // Cancelar inscrição anterior se existir
      if (subscriptionId) {
        NotificationService.unsubscribe(subscriptionId);
      }

      // Inscrever-se para novos pedidos
      const newSubscriptionId = NotificationService.subscribeToNewOrders(
        establishmentId,
        (order) => {
          // Chamar o callback se fornecido
          if (onNewOrder) {
            onNewOrder(order);
          }
        }
      );

      setSubscriptionId(newSubscriptionId);
      setIsSubscribed(true);
      setError(null);
    } catch (err) {
      setError('Erro ao inscrever-se para notificações de pedidos');
      console.error('Erro ao inscrever-se para notificações de pedidos:', err);
    }
  }, [establishmentId, onNewOrder, subscriptionId]);

  // Cancelar inscrição
  const unsubscribe = useCallback(() => {
    if (subscriptionId) {
      NotificationService.unsubscribe(subscriptionId);
      setSubscriptionId(null);
      setIsSubscribed(false);
    }
  }, [subscriptionId]);

  // Inscrever-se automaticamente quando o ID do estabelecimento mudar
  useEffect(() => {
    if (establishmentId) {
      subscribe();
    }

    // Cleanup: cancelar inscrição ao desmontar o componente
    return () => {
      if (subscriptionId) {
        NotificationService.unsubscribe(subscriptionId);
      }
    };
  }, [establishmentId, subscribe, subscriptionId]);

  return {
    isSubscribed,
    error,
    subscribe,
    unsubscribe
  };
}

type UseOrderStatusNotificationsProps = {
  orderId?: string;
  onStatusUpdate?: (order: Order) => void;
};

export function useOrderStatusNotifications({
  orderId,
  onStatusUpdate
}: UseOrderStatusNotificationsProps) {
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inscrever-se para receber notificações de atualizações de status
  const subscribe = useCallback(() => {
    if (!orderId) {
      setError('ID do pedido é necessário para inscrever-se para notificações de status');
      return;
    }

    try {
      // Cancelar inscrição anterior se existir
      if (subscriptionId) {
        NotificationService.unsubscribe(subscriptionId);
      }

      // Inscrever-se para atualizações de status
      const newSubscriptionId = NotificationService.subscribeToOrderStatusUpdates(
        orderId,
        (order) => {
          // Chamar o callback se fornecido
          if (onStatusUpdate) {
            onStatusUpdate(order);
          }
        }
      );

      setSubscriptionId(newSubscriptionId);
      setIsSubscribed(true);
      setError(null);
    } catch (err) {
      setError('Erro ao inscrever-se para notificações de status do pedido');
      console.error('Erro ao inscrever-se para notificações de status do pedido:', err);
    }
  }, [orderId, onStatusUpdate, subscriptionId]);

  // Cancelar inscrição
  const unsubscribe = useCallback(() => {
    if (subscriptionId) {
      NotificationService.unsubscribe(subscriptionId);
      setSubscriptionId(null);
      setIsSubscribed(false);
    }
  }, [subscriptionId]);

  // Inscrever-se automaticamente quando o ID do pedido mudar
  useEffect(() => {
    if (orderId) {
      subscribe();
    }

    // Cleanup: cancelar inscrição ao desmontar o componente
    return () => {
      if (subscriptionId) {
        NotificationService.unsubscribe(subscriptionId);
      }
    };
  }, [orderId, subscribe, subscriptionId]);

  return {
    isSubscribed,
    error,
    subscribe,
    unsubscribe
  };
} 