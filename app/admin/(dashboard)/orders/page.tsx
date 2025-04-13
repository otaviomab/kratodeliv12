"use client";

import { useState } from "react";
import { Filter, Search, FileDown, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function OrdersPage() {
  // Estados para filtros e ordenação
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dados simulados de pedidos
  const mockOrders = [
    {
      id: "123456",
      customer: "João Silva",
      date: "2023-11-25 14:30",
      items: [
        { name: "Hambúrguer Artesanal", quantity: 1, price: 29.90 },
        { name: "Batata Frita", quantity: 1, price: 15.90 },
        { name: "Refrigerante", quantity: 1, price: 7.90 }
      ],
      total: 53.70,
      status: "delivered",
      paymentMethod: "pix",
      deliveryAddress: "Rua das Flores, 123 - Centro"
    },
    {
      id: "123457",
      customer: "Maria Oliveira",
      date: "2023-11-25 15:10",
      items: [
        { name: "Pizza Margherita", quantity: 1, price: 45.90 },
        { name: "Água Mineral", quantity: 1, price: 5.00 }
      ],
      total: 50.90,
      status: "preparing",
      paymentMethod: "credit_card",
      deliveryAddress: "Av. Brasil, 789 - Jardim América"
    },
    {
      id: "123458",
      customer: "Pedro Santos",
      date: "2023-11-25 15:45",
      items: [
        { name: "Porção de Pastéis", quantity: 1, price: 25.90 },
        { name: "Refrigerante", quantity: 2, price: 15.80 }
      ],
      total: 41.70,
      status: "ready",
      paymentMethod: "credit_card",
      deliveryAddress: "Rua Ipiranga, 234 - Bairro Novo"
    },
    {
      id: "123459",
      customer: "Ana Souza",
      date: "2023-11-25 16:20",
      items: [
        { name: "Combo Família", quantity: 1, price: 89.90 }
      ],
      total: 89.90,
      status: "received",
      paymentMethod: "cash",
      deliveryAddress: "Rua das Palmeiras, 567 - Jardim Botânico"
    },
    {
      id: "123460",
      customer: "Carlos Pereira",
      date: "2023-11-25 17:05",
      items: [
        { name: "Salada Caesar", quantity: 1, price: 32.90 },
        { name: "Suco Natural", quantity: 1, price: 12.90 }
      ],
      total: 45.80,
      status: "delivered",
      paymentMethod: "pix",
      deliveryAddress: "Av. Central, 890 - Vila Nova"
    }
  ];

  // Filtragem de pedidos
  const filteredOrders = mockOrders.filter(order => {
    // Filtro por termo de busca
    if (searchTerm && !order.customer.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.id.includes(searchTerm)) {
      return false;
    }
    
    return true;
  });

  // Funções para manipulação de pedidos
  const handleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulação de carregamento
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Pedidos atualizados com sucesso");
    }, 1000);
  };

  const handleExport = () => {
    toast.success("Exportação de pedidos iniciada");
    // Lógica de exportação seria implementada aqui
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

  // Função auxiliar para formatar preço
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
      case "meal_voucher":
        return "Vale Refeição";
      case "food_voucher":
        return "Vale Alimentação";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho e Filtros */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Pedidos</h1>
            <span className="text-sm text-muted-foreground">
              {filteredOrders.length} pedidos encontrados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button
              onClick={handleExport}
              className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por cliente ou número do pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-border/10 bg-white dark:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-white dark:bg-card border border-border/10 hover:bg-muted transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="rounded border-border/10"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Pedido</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Pagamento</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#fdfaf5] dark:hover:bg-card/80 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-border/10"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentMethodLabel(order.paymentMethod)}
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