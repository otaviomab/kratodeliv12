"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Dados simulados das principais categorias
const data = [
  { name: 'Pratos Principais', value: 4000 },
  { name: 'Bebidas', value: 3000 },
  { name: 'Sobremesas', value: 2000 },
  { name: 'Entradas', value: 1500 },
  { name: 'Combos', value: 1000 },
];

// Cores para as categorias
const COLORS = ['#FF6B2B', '#FFC107', '#2196F3', '#4CAF50', '#9C27B0'];

interface TopCategoriesChartProps {
  className?: string;
}

export default function TopCategoriesChart({ className }: TopCategoriesChartProps) {
  return (
    <div className={`bg-card rounded-lg border shadow-sm p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-4">Categorias Mais Vendidas</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`R$ ${value}`, 'Vendas']}
              contentStyle={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                color: 'var(--foreground)'
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 