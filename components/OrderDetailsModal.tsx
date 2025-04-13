"use client";

import { useState } from "react";
import { X } from "lucide-react";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "ready" 
  | "delivered" 
  | "canceled";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  observations?: string;
  additionals?: {
    name: string;
    price: number;
  }[];
}

export interface Order {
  id: string;
  number: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: Date;
  deliveryFee?: number;
  isDelivery: boolean;
}

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onStatusChange
}: OrderDetailsModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  
  if (!isOpen) return null;
  
  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    onStatusChange?.(order.id, newStatus);
  };
  
  const getStatusBadgeClass = (statusValue: OrderStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    
    switch (statusValue) {
      case "pending":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "confirmed":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "preparing":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "ready":
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case "delivered":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "canceled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Pedido #{order.number}</h3>
            <p className="text-sm text-muted-foreground">
              {order.createdAt.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
          <span className={getStatusBadgeClass(status)}>
            {status === "pending" ? "Pendente" :
             status === "confirmed" ? "Confirmado" :
             status === "preparing" ? "Preparando" :
             status === "ready" ? "Pronto" :
             status === "delivered" ? "Entregue" :
             "Cancelado"}
          </span>
          <button 
            onClick={onClose} 
            className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted"
          >
            <X size={16} />
            <span className="sr-only">Fechar</span>
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Informações do Cliente</h4>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm">{order.customerPhone}</p>
              {order.isDelivery && order.customerAddress && (
                <div className="mt-2 text-sm">
                  <p>{`${order.customerAddress.street}, ${order.customerAddress.number}`}</p>
                  {order.customerAddress.complement && <p>{order.customerAddress.complement}</p>}
                  <p>{`${order.customerAddress.neighborhood}, ${order.customerAddress.city} - ${order.customerAddress.state}`}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Itens do Pedido</h4>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="bg-muted/30 p-4 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    <span>R$ {(item.quantity * item.unitPrice).toFixed(2).replace(".", ",")}</span>
                  </div>
                  
                  {item.additionals && item.additionals.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Adicionais:</p>
                      <ul className="text-sm text-muted-foreground">
                        {item.additionals.map((additional, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{additional.name}</span>
                            <span>+ R$ {additional.price.toFixed(2).replace(".", ",")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.observations && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Observações:</p>
                      <p className="text-sm text-muted-foreground">{item.observations}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Resumo</h4>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R$ {(order.totalPrice - (order.deliveryFee || 0)).toFixed(2).replace(".", ",")}</span>
              </div>
              
              {order.isDelivery && order.deliveryFee && (
                <div className="flex justify-between mb-2">
                  <span>Taxa de entrega</span>
                  <span>R$ {order.deliveryFee.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>R$ {order.totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              
              <div className="mt-4 text-sm">
                <span className="font-medium">Forma de pagamento: </span>
                <span>{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Alterar Status</h4>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleStatusChange("confirmed")}
              className={`px-3 py-1 rounded-md text-sm ${status === "confirmed" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Confirmar
            </button>
            <button 
              onClick={() => handleStatusChange("preparing")}
              className={`px-3 py-1 rounded-md text-sm ${status === "preparing" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Preparando
            </button>
            <button 
              onClick={() => handleStatusChange("ready")}
              className={`px-3 py-1 rounded-md text-sm ${status === "ready" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Pronto
            </button>
            <button 
              onClick={() => handleStatusChange("delivered")}
              className={`px-3 py-1 rounded-md text-sm ${status === "delivered" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Entregue
            </button>
            <button 
              onClick={() => handleStatusChange("canceled")}
              className={`px-3 py-1 rounded-md text-sm ${status === "canceled" ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 