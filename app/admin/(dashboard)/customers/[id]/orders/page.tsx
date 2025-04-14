"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface Cliente {
  id: string;
  nome: string;
  totalPedidos: number;
  totalGasto: number;
}

export default function CustomerOrdersPage({ params }: { params: { id: string } }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento de dados
        setTimeout(() => {
          const mockCliente: Cliente = {
            id: params.id,
            nome: "João Silva",
            totalPedidos: 12,
            totalGasto: 745.90
          };

          const mockOrders: Order[] = [
            {
              id: "123456",
              date: "22/04/2023 14:30",
              total: 89.90,
              status: "delivered",
              items: [
                { name: "Hambúrguer Artesanal", quantity: 1, price: 29.90 },
                { name: "Batata Frita", quantity: 1, price: 15.90 },
                { name: "Refrigerante", quantity: 1, price: 7.90 }
              ]
            },
            {
              id: "123457",
              date: "20/04/2023 19:15",
              total: 45.80,
              status: "delivered",
              items: [
                { name: "Pizza Margherita", quantity: 1, price: 45.90 }
              ]
            },
            {
              id: "123458",
              date: "15/04/2023 12:45",
              total: 67.50,
              status: "delivered",
              items: [
                { name: "Salada Caesar", quantity: 1, price: 32.90 },
                { name: "Suco Natural", quantity: 2, price: 17.30 }
              ]
            }
          ];
          
          setCliente(mockCliente);
          setOrders(mockOrders);
          setIsLoading(false);
        }, 1000);
      } catch {
        toast.error("Erro ao carregar os dados");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Função auxiliar para formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Cliente não encontrado</h2>
        <p className="text-muted-foreground mb-6">O cliente solicitado não está disponível.</p>
        <Link href="/admin/customers" className="inline-flex items-center px-4 py-2 border rounded-md">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#fdfaf5]">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Link href={`/admin/customers/${cliente.id}`} className="p-2 border rounded-md hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Pedidos de {cliente.nome}</h1>
              <p className="text-sm text-muted-foreground">
                Total de {cliente.totalPedidos} pedidos • {formatPrice(cliente.totalGasto)} em compras
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Pedido</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Itens</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fcf8f2] transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 