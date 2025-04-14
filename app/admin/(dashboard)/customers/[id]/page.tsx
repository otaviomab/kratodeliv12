"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento de dados
        setTimeout(() => {
          const mockCliente: Cliente = {
            id: params.id,
            nome: "João Silva",
            email: "joao.silva@email.com",
            telefone: "(11) 98765-4321",
            endereco: "Rua das Flores, 123 - São Paulo, SP",
            dataCadastro: "15/03/2023",
            totalPedidos: 12,
            totalGasto: 745.90,
            ultimoPedido: "22/04/2023",
            status: "ativo"
          };
          
          setCliente(mockCliente);
          setIsLoading(false);
        }, 1000);
      } catch {
        toast.error("Erro ao carregar os dados do cliente");
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [params.id]);

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
            <Link href="/admin/customers" className="p-2 border rounded-md hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">{cliente.nome}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/customers/${cliente.id}/orders`}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Ver Pedidos
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{cliente.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p>{cliente.telefone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p>{cliente.endereco}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente desde</p>
                <p>{cliente.dataCadastro}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#fcf8f2] rounded-lg">
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-2xl font-bold">{cliente.totalPedidos}</p>
            </div>
            
            <div className="p-4 bg-[#fcf8f2] rounded-lg">
              <p className="text-sm text-muted-foreground">Total Gasto</p>
              <p className="text-2xl font-bold">
                R$ {cliente.totalGasto.toFixed(2)}
              </p>
            </div>
            
            <div className="p-4 bg-[#fcf8f2] rounded-lg">
              <p className="text-sm text-muted-foreground">Último Pedido</p>
              <p className="text-2xl font-bold">{cliente.ultimoPedido}</p>
            </div>
            
            <div className="p-4 bg-[#fcf8f2] rounded-lg">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-2xl font-bold capitalize">{cliente.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 