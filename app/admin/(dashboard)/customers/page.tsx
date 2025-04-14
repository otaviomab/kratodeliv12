"use client";

import { useState } from "react";
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

// Dados de exemplo para os clientes
const clientesDados: Cliente[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    dataCadastro: "15/03/2023",
    totalPedidos: 12,
    totalGasto: 745.90,
    ultimoPedido: "22/04/2023",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    telefone: "(11) 91234-5678",
    endereco: "Avenida Paulista, 1000 - São Paulo, SP",
    dataCadastro: "02/04/2023",
    totalPedidos: 8,
    totalGasto: 523.50,
    ultimoPedido: "18/04/2023",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Pedro Santos",
    email: "pedro.santos@email.com",
    telefone: "(11) 99876-5432",
    endereco: "Rua Augusta, 500 - São Paulo, SP",
    dataCadastro: "10/01/2023",
    totalPedidos: 15,
    totalGasto: 982.30,
    ultimoPedido: "25/04/2023",
    status: "ativo",
  },
  {
    id: "4",
    nome: "Ana Souza",
    email: "ana.souza@email.com",
    telefone: "(11) 97654-3210",
    endereco: "Rua Oscar Freire, 300 - São Paulo, SP",
    dataCadastro: "05/02/2023",
    totalPedidos: 6,
    totalGasto: 310.75,
    ultimoPedido: "10/04/2023",
    status: "inativo",
  },
  {
    id: "5",
    nome: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    telefone: "(11) 92345-6789",
    endereco: "Alameda Santos, 800 - São Paulo, SP",
    dataCadastro: "20/03/2023",
    totalPedidos: 4,
    totalGasto: 189.60,
    ultimoPedido: "15/04/2023",
    status: "ativo",
  },
  {
    id: "6",
    nome: "Juliana Costa",
    email: "juliana.costa@email.com",
    telefone: "(11) 95678-1234",
    endereco: "Rua Haddock Lobo, 250 - São Paulo, SP",
    dataCadastro: "08/02/2023",
    totalPedidos: 10,
    totalGasto: 650.20,
    ultimoPedido: "20/04/2023",
    status: "ativo",
  },
  {
    id: "7",
    nome: "Roberto Almeida",
    email: "roberto.almeida@email.com",
    telefone: "(11) 94321-8765",
    endereco: "Avenida Rebouças, 600 - São Paulo, SP",
    dataCadastro: "12/01/2023",
    totalPedidos: 5,
    totalGasto: 287.45,
    ultimoPedido: "05/04/2023",
    status: "inativo",
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Função para filtrar e ordenar clientes
  const getFilteredClientes = () => {
    let filtered = clientesDados;

    // Aplicar busca
    if (searchTerm) {
      filtered = filtered.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de status
    if (statusFilter !== "all") {
      filtered = filtered.filter(cliente => cliente.status === statusFilter);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "nome":
          comparison = a.nome.localeCompare(b.nome);
          break;
        case "contato":
          comparison = a.email.localeCompare(b.email);
          break;
        case "totalPedidos":
          comparison = a.totalPedidos - b.totalPedidos;
          break;
        case "totalGasto":
          comparison = a.totalGasto - b.totalGasto;
          break;
        case "ultimoPedido":
          comparison = new Date(a.ultimoPedido.split('/').reverse().join('-')).getTime() - 
                      new Date(b.ultimoPedido.split('/').reverse().join('-')).getTime();
          break;
        default:
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  const clientesFiltrados = getFilteredClientes();

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
              <SelectContent className="bg-white">
                <SelectItem value="all" className="bg-white hover:bg-[#fcf8f2]">Todos</SelectItem>
                <SelectItem value="ativo" className="bg-white hover:bg-[#fcf8f2]">Ativos</SelectItem>
                <SelectItem value="inativo" className="bg-white hover:bg-[#fcf8f2]">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Clientes</h1>
                <p className="text-sm text-muted-foreground/100">
                  Gerencie e visualize todos os clientes que já realizaram pedidos
                </p>
              </div>
              <Button variant="outline" className="bg-background/100">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>

            <div className="mt-6 rounded-md border bg-background/100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/100">
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 -ml-3 bg-transparent hover:bg-muted/100"
                          onClick={() => handleSort("nome")}
                        >
                          Nome
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 -ml-3 bg-transparent hover:bg-muted/100"
                          onClick={() => handleSort("contato")}
                        >
                          Contato
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 justify-center w-full bg-transparent hover:bg-muted/100"
                          onClick={() => handleSort("totalPedidos")}
                        >
                          Total Pedidos
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 justify-center w-full bg-transparent hover:bg-muted/100"
                          onClick={() => handleSort("totalGasto")}
                        >
                          Total Gasto
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 justify-center w-full bg-transparent hover:bg-muted/100"
                          onClick={() => handleSort("ultimoPedido")}
                        >
                          Último Pedido
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id} className="border-b hover:bg-[#fcf8f2] transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{cliente.nome}</div>
                            <div className="text-sm text-muted-foreground/100">
                              Cliente desde {cliente.dataCadastro}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{cliente.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{cliente.telefone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex items-center justify-center rounded-full bg-orange-100/100 px-2.5 py-0.5 text-sm font-medium text-orange-700">
                            {cliente.totalPedidos} pedidos
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          R$ {cliente.totalGasto.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">{cliente.ultimoPedido}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 bg-background/100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white w-[160px]">
                              <DropdownMenuItem className="cursor-pointer hover:bg-[#fcf8f2]">
                                <Link href={`/admin/customers/${cliente.id}`} className="w-full">
                                  Ver detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-[#fcf8f2]">
                                <Link href={`/admin/customers/${cliente.id}/orders`} className="w-full">
                                  Ver pedidos
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-[#fcf8f2]">
                                Desativar cliente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/100">
                <p className="text-sm text-muted-foreground/100">
                  Mostrando {clientesFiltrados.length} de {clientesDados.length} clientes
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-background/100">
                    Anterior
                  </Button>
                  <Button variant="outline" size="sm" className="bg-background/100">
                    Próximo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 