"use client";

import { useState } from "react";
import { Filter, Search, FileDown, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function OrdersPage() {
  // Estados para filtros e ordenação
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    // Filtro por status
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
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

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // Aqui seria implementada a lógica para atualizar o status
    toast.success(`Status do pedido #${orderId} atualizado para ${getStatusLabel(newStatus)}`);
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
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            className="p-2 border rounded-md"
            disabled={isLoading}
          >
            <RefreshCcw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={handleExport}
            className="p-2 border rounded-md"
          >
            <FileDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por cliente ou número do pedido"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-md text-sm"
              />
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="flex items-center space-x-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 p-2 border rounded-md text-sm"
              >
                <option value="all">Todos os status</option>
                <option value="received">Recebido</option>
                <option value="preparing">Em preparo</option>
                <option value="ready">Pronto</option>
                <option value="delivered">Entregue</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium">#{order.id}</div>
                    <div className="text-xs text-muted-foreground">{getPaymentMethodLabel(order.paymentMethod)}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{order.customer}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{order.deliveryAddress}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(order.date).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        Detalhes
                      </Link>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs border-none cursor-pointer"
                      >
                        <option value="received">Recebido</option>
                        <option value="preparing">Em preparo</option>
                        <option value="ready">Pronto</option>
                        <option value="delivered">Entregue</option>
                        <option value="canceled">Cancelado</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum pedido encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium">{filteredOrders.length}</span> pedidos
        </div>
        <div className="flex space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={true} // Na simulação temos apenas uma página
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
} 