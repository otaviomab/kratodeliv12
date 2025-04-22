"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { MoreHorizontal, Download } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Phone,
  ArrowUpDown
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CustomerWithStats, listCustomers } from "@/lib/customerService";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from '@/stores/authStore';

// Tipos para dados dos clientes
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCadastro: string;
  totalPedidos: number;
  totalGasto: number;
  ultimoPedido: string;
  status: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [clientes, setClientes] = useState<CustomerWithStats[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { establishment } = useAuthStore();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Função para buscar clientes do backend
  const fetchClientes = async () => {
    if (!establishment?.id) return;
    
    try {
      setIsLoading(true);
      const result = await listCustomers(establishment.id, {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortField: mapSortField(sortField),
        sortDirection,
      });
      
      setClientes(result.customers);
      setTotalClientes(result.total);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Não foi possível carregar a lista de clientes');
    } finally {
      setIsLoading(false);
    }
  };

  // Mapeia os campos de ordenação do frontend para o backend
  const mapSortField = (field: string): string => {
    switch (field) {
      case 'nome': return 'name';
      case 'contato': return 'email';
      case 'totalPedidos': return 'totalOrders';
      case 'totalGasto': return 'totalSpent';
      case 'ultimoPedido': return 'lastOrderDate';
      default: return field;
    }
  };

  // Formatar data no padrão brasileiro
  const formatDate = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
  };

  // Efeito para buscar clientes sempre que os filtros ou ordenação mudar
  useEffect(() => {
    fetchClientes();
  }, [establishment?.id, searchTerm, statusFilter, sortField, sortDirection]);

  // Renderização dos dados para compatibilidade com o frontend existente
  const clientesMapeados: Cliente[] = clientes.map(cliente => ({
    id: cliente.id,
    nome: cliente.name,
    email: cliente.email,
    telefone: cliente.phone,
    endereco: cliente.address || '',
    dataCadastro: formatDate(cliente.createdAt),
    totalPedidos: cliente.totalOrders,
    totalGasto: cliente.totalSpent,
    ultimoPedido: formatDate(cliente.lastOrderDate),
    status: cliente.status,
  }));

  return (
    <div className="space-y-6 p-6 bg-[#fdfaf5]">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar cliente..."
              className="max-w-xs bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="ml-auto"
              onClick={() => {
                // Implementar futuramente a exportação de dados
                toast.info("Funcionalidade de exportação a ser implementada");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">Clientes</h1>
              <p className="text-sm text-gray-500">
                Gerencie e visualize todos os clientes que já realizaram pedidos
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : clientesMapeados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h2>
              <p className="text-muted-foreground max-w-md">
                {searchTerm || statusFilter !== "all" 
                  ? "Tente ajustar os filtros para encontrar o que está procurando." 
                  : "Você ainda não possui clientes cadastrados. Eles aparecerão aqui quando fizerem pedidos."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium text-sm">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort("nome")}
                      >
                        Cliente
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === "nome" ? "text-primary" : "text-gray-400"}`} />
                      </button>
                    </th>
                    <th className="py-3 text-left font-medium text-sm">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort("contato")}
                      >
                        Contato
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === "contato" ? "text-primary" : "text-gray-400"}`} />
                      </button>
                    </th>
                    <th className="py-3 text-left font-medium text-sm">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort("totalPedidos")}
                      >
                        Pedidos
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === "totalPedidos" ? "text-primary" : "text-gray-400"}`} />
                      </button>
                    </th>
                    <th className="py-3 text-left font-medium text-sm">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort("totalGasto")}
                      >
                        Total Gasto
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === "totalGasto" ? "text-primary" : "text-gray-400"}`} />
                      </button>
                    </th>
                    <th className="py-3 text-left font-medium text-sm">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort("ultimoPedido")}
                      >
                        Último Pedido
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === "ultimoPedido" ? "text-primary" : "text-gray-400"}`} />
                      </button>
                    </th>
                    <th className="py-3 text-left font-medium text-sm">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortField === "status" ? "text-primary" : "text-gray-400"}`} />
                      </button>
                    </th>
                    <th className="py-3 text-right font-medium text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesMapeados.map((cliente) => (
                    <tr key={cliente.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="font-medium">{cliente.nome}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {cliente.telefone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">{cliente.totalPedidos}</td>
                      <td className="py-4">{formatCurrency(cliente.totalGasto)}</td>
                      <td className="py-4">{cliente.ultimoPedido || "-"}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cliente.status === "ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/admin/customers/${cliente.id}`} className="w-full">
                                Ver detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/admin/customers/${cliente.id}/orders`} className="w-full">
                                Ver pedidos
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.info("Funcionalidade a ser implementada")}>
                              Enviar mensagem
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-4 text-sm text-gray-500 text-right">
                Mostrando {clientesMapeados.length} de {totalClientes} clientes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 