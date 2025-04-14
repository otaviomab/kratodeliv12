"use client";

import { useState } from "react";
import { DownloadIcon, PieChartIcon, BarChartIcon, TrendingUpIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReactNode } from "react";

// Tipos para os dados
interface SaleData extends Record<string, unknown> {
  data: string;
  pedidos: number;
  valor: number;
  metodo: string;
}

interface ProductData extends Record<string, unknown> {
  nome: string;
  vendas: number;
  valor: number;
  categoria: string;
}

interface CustomerData extends Record<string, unknown> {
  nome: string;
  pedidos: number;
  valor: number;
  ultimoPedido: string;
}

// Dados de exemplo para os relatórios
const salesData: SaleData[] = [
  { data: "01/05/2023", pedidos: 12, valor: 645.9, metodo: "PIX" },
  { data: "02/05/2023", pedidos: 8, valor: 423.5, metodo: "Cartão" },
  { data: "03/05/2023", pedidos: 15, valor: 789.3, metodo: "Dinheiro" },
  { data: "04/05/2023", pedidos: 10, valor: 512.8, metodo: "PIX" },
  { data: "05/05/2023", pedidos: 14, valor: 698.2, metodo: "Cartão" },
];

const topProducts: ProductData[] = [
  { nome: "Pizza Calabresa", vendas: 48, valor: 1248.0, categoria: "Pizzas" },
  { nome: "Hambúrguer Artesanal", vendas: 36, valor: 936.0, categoria: "Hambúrgueres" },
  { nome: "Coca-Cola 2L", vendas: 28, valor: 280.0, categoria: "Bebidas" },
  { nome: "Batata Frita Grande", vendas: 25, valor: 375.0, categoria: "Acompanhamentos" },
  { nome: "Pudim", vendas: 22, valor: 220.0, categoria: "Sobremesas" },
];

const customerData: CustomerData[] = [
  { nome: "João Silva", pedidos: 8, valor: 412.5, ultimoPedido: "05/05/2023" },
  { nome: "Maria Oliveira", pedidos: 6, valor: 325.8, ultimoPedido: "03/05/2023" },
  { nome: "Pedro Santos", pedidos: 5, valor: 276.3, ultimoPedido: "01/05/2023" },
  { nome: "Ana Souza", pedidos: 4, valor: 210.7, ultimoPedido: "30/04/2023" },
  { nome: "Carlos Ferreira", pedidos: 3, valor: 156.2, ultimoPedido: "28/04/2023" },
];

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("7dias");

  // Função para renderizar tabelas
  const renderTable = (data: Record<string, unknown>[], headers: string[], keys: string[]) => (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {headers.map((header, index) => (
              <th key={index} className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-muted/50">
              {keys.map((key, colIndex) => (
                <td key={colIndex} className="p-4 align-middle">
                  {key === "valor" 
                    ? `R$ ${Number(row[key]).toFixed(2)}` 
                    : String(row[key]) as ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 p-6 bg-[#fdfaf5]">
      <div className="bg-white rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            <p className="text-muted-foreground">
              Acompanhe o desempenho do seu negócio
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={reportPeriod}
              onValueChange={setReportPeriod}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="7dias" className="bg-white hover:bg-[#fcf8f2]">Últimos 7 dias</SelectItem>
                <SelectItem value="15dias" className="bg-white hover:bg-[#fcf8f2]">Últimos 15 dias</SelectItem>
                <SelectItem value="30dias" className="bg-white hover:bg-[#fcf8f2]">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias" className="bg-white hover:bg-[#fcf8f2]">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.231,89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +12.4% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 78,94</div>
              <p className="text-xs text-muted-foreground">
                +4.3% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+249</div>
              <p className="text-xs text-muted-foreground">
                +10.2% em relação ao período anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vendas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="vendas">Vendas</TabsTrigger>
            <TabsTrigger value="produtos">Produtos Populares</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="vendas">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Histórico de Vendas</CardTitle>
                <CardDescription>
                  Acompanhe as vendas diárias do seu estabelecimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-[#fcf8f2] rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Gráfico de Vendas no Período</p>
                </div>
                {renderTable(
                  salesData,
                  ["Data", "Pedidos", "Valor Total (R$)", "Método de Pagamento"],
                  ["data", "pedidos", "valor", "metodo"]
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="produtos">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>
                  Veja quais são os produtos com maior saída
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-[#fcf8f2] rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Gráfico de Produtos Mais Vendidos</p>
                </div>
                {renderTable(
                  topProducts,
                  ["Nome do Produto", "Quantidade Vendida", "Valor Total (R$)", "Categoria"],
                  ["nome", "vendas", "valor", "categoria"]
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clientes">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Clientes Frequentes</CardTitle>
                <CardDescription>
                  Analise seus clientes mais fiéis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-[#fcf8f2] rounded-md flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">Gráfico de Frequência de Clientes</p>
                </div>
                {renderTable(
                  customerData,
                  ["Nome do Cliente", "Total de Pedidos", "Valor Gasto (R$)", "Último Pedido"],
                  ["nome", "pedidos", "valor", "ultimoPedido"]
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 