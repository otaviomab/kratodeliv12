"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Dados simulados para o gráfico
const generateSalesData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Gerando valor aleatório entre 500 e 2000
    const value = Math.floor(Math.random() * 1500) + 500;
    
    data.push({
      date: date,
      value: value
    });
  }
  
  return data;
};

interface SalesChartProps {
  className?: string;
}

export default function SalesChart({ className }: SalesChartProps) {
  const data = generateSalesData();
  
  return (
    <div className={`bg-card rounded-lg border shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-6">Vendas na Última Semana</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'EEE', {locale: ptBR})}
              className="text-xs text-muted-foreground"
            />
            <YAxis 
              tickFormatter={(value) => `R$${value}`}
              className="text-xs text-muted-foreground"
            />
            <Tooltip 
              labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy (EEEE)', {locale: ptBR})}
              formatter={(value) => [`R$ ${value}`, 'Vendas']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
              itemStyle={{
                color: 'var(--primary)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--primary)" 
              fill="var(--primary)" 
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 