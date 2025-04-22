"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CustomerWithStats, getCustomer, getCustomerOrders } from "@/lib/customerService";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from '@/stores/authStore';
import { Button } from "@/components/ui/Button";

// Interface para pedidos
interface Order {
  $id: string;
  total: number;
  createdAt: string;
  status: string;
  items?: {
    quantity: number;
    name: string;
  }[];
}

export default function CustomerOrdersPage({ params }: { params: { id: string } }) {
  const [cliente, setCliente] = useState<CustomerWithStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { establishment } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!establishment?.id) return;
      
      setIsLoading(true);
      try {
        // Buscar cliente e pedidos em paralelo
        const [customerData, ordersData] = await Promise.all([
          getCustomer(params.id, establishment.id),
          getCustomerOrders(params.id, establishment.id, { limit: 20 })
        ]);
        
        if (customerData) {
          setCliente(customerData);
        } else {
          toast.error("Cliente não encontrado");
        }
        setOrders(ordersData.orders);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error("Erro ao carregar os dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, establishment?.id]);

  // Função auxiliar para formatar preço
  const formatPrice = formatCurrency;

  // Função auxiliar para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Função auxiliar para obter o label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmado";
      case "preparing":
        return "Em preparo";
      case "ready":
        return "Pronto";
      case "delivered":
        return "Entregue";
      case "completed":
        return "Concluído";
      case "canceled":
        return "Cancelado";
      default:
        return "Desconhecido";
    }
  };

  // Função auxiliar para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-indigo-100 text-indigo-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
      case "completed":
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
              <h1 className="text-2xl font-bold">Pedidos de {cliente.name}</h1>
              <p className="text-sm text-muted-foreground">
                Total de {cliente.totalOrders} pedidos • {formatPrice(cliente.totalSpent)} em compras
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-12 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] text-center">
          <h2 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h2>
          <p className="text-muted-foreground mb-6">Este cliente ainda não fez nenhum pedido.</p>
        </div>
      ) : (
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
                  <tr key={order.$id} className="hover:bg-[#fcf8f2] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium">#{order.$id.substring(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {(order.items || []).map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/orders/${order.$id}`}>
                        <Button variant="ghost" size="sm">
                          Ver detalhes
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 