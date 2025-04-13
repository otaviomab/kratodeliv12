"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  observations?: string;
  additionals?: { name: string; price: number }[];
}

interface Order {
  id: string;
  customer: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryFee?: number;
  notes?: string;
  phoneNumber?: string;
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    // Simulação de carregamento de dados
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // Em um ambiente real, buscaria os dados da API
        setTimeout(() => {
          const mockOrder: Order = {
            id: params.id,
            customer: "João Silva",
            date: "2023-11-25 14:30",
            phoneNumber: "(11) 98765-4321",
            items: [
              { 
                name: "Hambúrguer Artesanal", 
                quantity: 1, 
                price: 29.90,
                additionals: [
                  { name: "Queijo Extra", price: 3.50 },
                  { name: "Bacon", price: 4.00 }
                ],
                observations: "Sem cebola, por favor."
              },
              { name: "Batata Frita Grande", quantity: 1, price: 15.90 },
              { name: "Refrigerante 350ml", quantity: 1, price: 7.90 }
            ],
            total: 61.20,
            status: "preparing",
            paymentMethod: "pix",
            deliveryAddress: "Rua das Flores, 123 - Centro, São Paulo - SP",
            deliveryFee: 5.00,
            notes: "Campainha não funciona, por favor ligar ao chegar."
          };
          
          setOrder(mockOrder);
          setCurrentStatus(mockOrder.status);
          setIsLoading(false);
        }, 1000);
      } catch {
        toast.error("Erro ao carregar os dados do pedido");
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    toast.success(`Status atualizado para: ${getStatusLabel(newStatus)}`);
    
    // Aqui seria implementada a chamada à API para atualizar o status
  };

  const handlePrint = () => {
    window.print();
  };

  // Função auxiliar para obter o label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "received":
        return "Recebido";
      case "preparing":
        return "Em preparo";
      case "ready":
        return "Pronto";
      case "delivered":
        return "Entregue";
      case "canceled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  // Função auxiliar para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-amber-100 text-amber-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função auxiliar para obter método de pagamento
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito";
      case "debit_card":
        return "Cartão de Débito";
      case "pix":
        return "PIX";
      case "cash":
        return "Dinheiro";
      default:
        return "Desconhecido";
    }
  };

  // Função auxiliar para formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Pedido não encontrado</h2>
        <p className="text-muted-foreground mb-6">O pedido solicitado não está disponível.</p>
        <Link href="/admin/orders" className="inline-flex items-center px-4 py-2 border rounded-md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Link href="/admin/orders" className="p-2 border rounded-md hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm hover:bg-muted"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações do Pedido */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Detalhes do Pedido</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Data e Hora</p>
                <p>{new Date(order.date).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                    {getStatusLabel(currentStatus)}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                <p>{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">{formatPrice(order.total)}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-3">Itens do Pedido</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-baseline">
                          <span className="font-medium">{item.quantity}x</span>
                          <span className="ml-2">{item.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.price)} por unidade
                        </p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>

                    {item.additionals && item.additionals.length > 0 && (
                      <div className="mt-2 pl-6">
                        <p className="text-sm font-medium mb-1">Adicionais:</p>
                        <ul className="space-y-1">
                          {item.additionals.map((additional, idx) => (
                            <li key={idx} className="text-sm flex justify-between">
                              <span>{additional.name}</span>
                              <span>{formatPrice(additional.price)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.observations && (
                      <div className="mt-2 pl-6">
                        <p className="text-sm font-medium mb-1">Observações:</p>
                        <p className="text-sm text-muted-foreground">{item.observations}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Subtotal</span>
                  <span>
                    {formatPrice(order.total - (order.deliveryFee || 0))}
                  </span>
                </div>
                {order.deliveryFee !== undefined && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm">Taxa de entrega</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-2 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Lateral */}
        <div className="space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Cliente</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{order.customer}</p>
              </div>
              
              {order.phoneNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p>{order.phoneNumber}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                <p>{order.deliveryAddress}</p>
              </div>
              
              {order.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Atualização de Status */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Atualizar Status</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => handleStatusChange("received")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm ${currentStatus === "received" ? "bg-amber-100 text-amber-800 border-amber-200 border-2" : "bg-muted/50 hover:bg-muted"}`}
              >
                <span>Recebido</span>
                {currentStatus === "received" && <CheckCircle2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => handleStatusChange("preparing")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm ${currentStatus === "preparing" ? "bg-blue-100 text-blue-800 border-blue-200 border-2" : "bg-muted/50 hover:bg-muted"}`}
              >
                <span>Em preparo</span>
                {currentStatus === "preparing" && <CheckCircle2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => handleStatusChange("ready")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm ${currentStatus === "ready" ? "bg-green-100 text-green-800 border-green-200 border-2" : "bg-muted/50 hover:bg-muted"}`}
              >
                <span>Pronto</span>
                {currentStatus === "ready" && <CheckCircle2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => handleStatusChange("delivered")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm ${currentStatus === "delivered" ? "bg-purple-100 text-purple-800 border-purple-200 border-2" : "bg-muted/50 hover:bg-muted"}`}
              >
                <span>Entregue</span>
                {currentStatus === "delivered" && <CheckCircle2 className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => handleStatusChange("canceled")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm ${currentStatus === "canceled" ? "bg-red-100 text-red-800 border-red-200 border-2" : "bg-muted/50 hover:bg-muted"}`}
              >
                <span>Cancelado</span>
                {currentStatus === "canceled" && <CheckCircle2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 