"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  CreditCard,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";

// Componente de card de resumo
interface StatCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => (
  <div className="bg-white dark:bg-card rounded-lg p-6 transition-all duration-200 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] border border-border/10">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="p-2 bg-primary/5 rounded-full text-primary">{icon}</div>
    </div>
    <div className="text-2xl font-semibold text-foreground">{value}</div>
    <div className="flex items-center mt-2 text-sm">
      {change.positive ? (
        <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
      ) : (
        <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
      )}
      <span
        className={`${
          change.positive ? "text-green-500" : "text-red-500"
        } font-medium`}
      >
        {change.value} {change.positive ? "aumento" : "queda"}
      </span>
    </div>
  </div>
);

// Dados de exemplo para o gráfico
const chartData = [
  { day: "Dom", sales: 2100 },
  { day: "Seg", sales: 1800 },
  { day: "Ter", sales: 2400 },
  { day: "Qua", sales: 2800 },
  { day: "Qui", sales: 3200 },
  { day: "Sex", sales: 4100 },
  { day: "Sáb", sales: 4800 },
];

// Dados de pedidos recentes para a tabela
const recentOrders = [
  {
    id: "PED-15432",
    customer: "Maria Silva",
    status: "Entregue",
    date: "Hoje, 14:30",
    amount: "R$ 89,90",
  },
  {
    id: "PED-15431",
    customer: "João Oliveira",
    status: "Em preparo",
    date: "Hoje, 13:45",
    amount: "R$ 76,40",
  },
  {
    id: "PED-15430",
    customer: "Ana Paula Santos",
    status: "Recebido",
    date: "Hoje, 12:20",
    amount: "R$ 125,00",
  },
  {
    id: "PED-15429",
    customer: "Roberto Almeida",
    status: "Entregue",
    date: "Hoje, 11:15",
    amount: "R$ 45,90",
  },
  {
    id: "PED-15428",
    customer: "Camila Martins",
    status: "Entregue",
    date: "Ontem, 20:40",
    amount: "R$ 92,50",
  },
];

// Períodos para filtragem
const timeRanges = [
  { id: "day", label: "Hoje" },
  { id: "week", label: "Esta semana" },
  { id: "month", label: "Este mês" },
  { id: "year", label: "Este ano" },
];

// Dados dos produtos mais vendidos
const topSellingProducts = [
  { name: "Hambúrguer Artesanal", quantity: 42, revenue: "R$ 1.260,00" },
  { name: "Pizza Margherita", quantity: 38, revenue: "R$ 1.140,00" },
  { name: "Batata Frita Grande", quantity: 36, revenue: "R$ 540,00" },
  { name: "Coca-Cola 500ml", quantity: 32, revenue: "R$ 320,00" },
];

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");

  return (
    <div className="space-y-6 p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-card p-6 rounded-lg border border-border/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedTimeRange(range.id)}
              className={`px-4 py-2 text-sm rounded-md transition-all duration-200 font-medium ${
                selectedTimeRange === range.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Faturamento Total"
          value="R$ 24.350,00"
          change={{ value: "12%", positive: true }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Pedidos"
          value="285"
          change={{ value: "8%", positive: true }}
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <StatCard
          title="Ticket Médio"
          value="R$ 85,44"
          change={{ value: "3%", positive: true }}
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          title="Clientes"
          value="192"
          change={{ value: "5%", positive: false }}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Gráfico e pedidos recentes */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Gráfico de vendas */}
        <div className="lg:col-span-4 bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Vendas Semanais</h3>
              <p className="text-sm text-muted-foreground">Acompanhe o desempenho das suas vendas</p>
            </div>
            <Link 
              href="/admin/reports" 
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Ver relatórios
            </Link>
          </div>
          
          {/* Gráfico melhorado */}
          <div className="h-64 flex items-end justify-between">
            {chartData.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1 group">
                <div 
                  className="bg-primary/80 w-7 rounded-t-md transition-all duration-200 group-hover:bg-primary"
                  style={{ height: `${(day.sales / 5000) * 100}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-y-8 text-xs bg-card text-foreground shadow-sm rounded px-2 py-1">
                    R$ {day.sales.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 text-xs font-medium">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedidos recentes */}
        <div className="lg:col-span-3 bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Pedidos Recentes</h3>
              <p className="text-sm text-muted-foreground">Últimas atualizações de pedidos</p>
            </div>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Clock className="h-4 w-4" />
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-md bg-[#fdfaf5] dark:bg-card/60 hover:bg-[#fcf8f2] dark:hover:bg-card/80 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{order.customer}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{order.id}</span>
                    <span>•</span>
                    <span>{order.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <span className={`text-sm ${
                    order.status === 'Entregue' ? 'text-green-500' :
                    order.status === 'Em preparo' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de produtos mais vendidos */}
      <div className="bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Produtos Mais Vendidos</h3>
            <p className="text-sm text-muted-foreground">Top produtos por receita</p>
          </div>
          <Link 
            href="/admin/menu/products" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Gerenciar produtos
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border/10">
                <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-left">Produto</th>
                <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-left">Unidades Vendidas</th>
                <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-left">Receita Total</th>
                <th className="py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Tendência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {topSellingProducts.map((product, index) => (
                <tr key={index} className="hover:bg-[#fdfaf5] dark:hover:bg-card/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap font-medium">{product.name}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{product.quantity}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{product.revenue}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <TrendingUp className="h-5 w-5 text-green-500 inline" />
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