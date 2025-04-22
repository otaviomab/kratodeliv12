"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CustomerWithStats, getCustomer } from "@/lib/customerService";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from '@/stores/authStore';

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const [cliente, setCliente] = useState<CustomerWithStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { establishment } = useAuthStore();

  useEffect(() => {
    const fetchCliente = async () => {
      if (!establishment?.id) return;
      
      setIsLoading(true);
      try {
        const customerData = await getCustomer(params.id, establishment.id);
        setCliente(customerData);
      } catch (error) {
        console.error('Erro ao carregar os dados do cliente:', error);
        toast.error("Erro ao carregar os dados do cliente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [params.id, establishment?.id]);

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

  // Formatar data no padrão brasileiro
  const formatDate = (isoDate: string): string => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 p-6 bg-[#fdfaf5]">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Link href="/admin/customers" className="p-2 border rounded-md hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">{cliente.name}</h1>
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
                <p>{cliente.email || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p>{cliente.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p>{cliente.address || 'Não informado'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente desde</p>
                <p>{formatDate(cliente.createdAt)}</p>
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
              <p className="text-2xl font-bold">{cliente.totalOrders}</p>
            </div>
            
            <div className="p-4 bg-[#fcf8f2] rounded-lg">
              <p className="text-sm text-muted-foreground">Total Gasto</p>
              <p className="text-2xl font-bold">
                {formatCurrency(cliente.totalSpent)}
              </p>
            </div>
            
            <div className="p-4 bg-[#fcf8f2] rounded-lg">
              <p className="text-sm text-muted-foreground">Último Pedido</p>
              <p className="text-2xl font-bold">{formatDate(cliente.lastOrderDate) || 'Nenhum'}</p>
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