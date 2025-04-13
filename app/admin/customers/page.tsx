"use client";

import { useState } from "react";
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  Mail, 
  Phone,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const estadosCliente = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: "ativo" },
  { label: "Inativos", value: "inativo" },
];

const ordenacoes = [
  { label: "Mais recentes", value: "recentes" },
  { label: "Mais antigos", value: "antigos" },
  { label: "Maior valor gasto", value: "maior_valor" },
  { label: "Maior número de pedidos", value: "mais_pedidos" },
  { label: "Nome (A-Z)", value: "nome_asc" },
  { label: "Nome (Z-A)", value: "nome_desc" },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("recentes");

  // Função para filtrar e ordenar clientes
  const getFilteredClientes = () => {
    let filtered = [...clientesDados];

    // Aplicar filtro de pesquisa
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      filtered = filtered.filter(
        cliente => 
          cliente.nome.toLowerCase().includes(termo) || 
          cliente.email.toLowerCase().includes(termo) ||
          cliente.telefone.includes(termo)
      );
    }

    // Aplicar filtro de status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(cliente => cliente.status === statusFilter);
    }

    // Aplicar ordenação
    switch (sortOrder) {
      case "recentes":
        filtered.sort((a, b) => new Date(b.dataCadastro.split('/').reverse().join('-')).getTime() - new Date(a.dataCadastro.split('/').reverse().join('-')).getTime());
        break;
      case "antigos":
        filtered.sort((a, b) => new Date(a.dataCadastro.split('/').reverse().join('-')).getTime() - new Date(b.dataCadastro.split('/').reverse().join('-')).getTime());
        break;
      case "maior_valor":
        filtered.sort((a, b) => b.totalGasto - a.totalGasto);
        break;
      case "mais_pedidos":
        filtered.sort((a, b) => b.totalPedidos - a.totalPedidos);
        break;
      case "nome_asc":
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case "nome_desc":
        filtered.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      default:
        break;
    }

    return filtered;
  };

  const clientesFiltrados = getFilteredClientes();

  const formatarData = (dataString: string): string => {
    return dataString; // Já está no formato adequado (DD/MM/YYYY)
  };

  const formatarValor = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize todos os clientes que já realizaram pedidos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              {estadosCliente.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {ordenacoes.map((orden) => (
                <SelectItem key={orden.value} value={orden.value}>
                  {orden.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Nome
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  Contato
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Total Pedidos
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Total Gasto
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    Último Pedido
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr 
                    key={cliente.id}
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="font-medium">{cliente.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          Cliente desde {formatarData(cliente.dataCadastro)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5 mr-2" />
                          {cliente.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Phone className="h-3.5 w-3.5 mr-2" />
                          {cliente.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center">
                          {cliente.totalPedidos}
                        </div>
                        pedidos
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium">
                        {formatarValor(cliente.totalGasto)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        {formatarData(cliente.ultimoPedido)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Ver pedidos</DropdownMenuItem>
                          <DropdownMenuItem>Enviar mensagem</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            {cliente.status === "ativo" ? "Desativar cliente" : "Ativar cliente"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum cliente encontrado com os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <div>Mostrando {clientesFiltrados.length} de {clientesDados.length} clientes</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={clientesFiltrados.length === 0}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled={clientesFiltrados.length === 0}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
} 