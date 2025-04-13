# Documentação da Página de Relatórios

## Visão Geral

A página de relatórios do Krato permite que os administradores do estabelecimento visualizem métricas importantes relacionadas a vendas, produtos populares e comportamento dos clientes. Esta documentação descreve a implementação, funcionalidades e uso da página de relatórios.

## Localização

- **Arquivo Principal**: `app/admin/reports/page.tsx`
- **URL de Acesso**: `/admin/reports`

## Principais Funcionalidades

### 1. Métricas Principais (Cards)

A página exibe três métricas principais em formato de cards:

- **Faturamento no Período**: Valor total de vendas no período selecionado, com comparativo ao período anterior.
- **Total de Pedidos**: Quantidade de pedidos realizados no período, com comparativo.
- **Ticket Médio**: Valor médio por pedido, com comparativo ao período anterior.

### 2. Seleção de Período

Um seletor permite que o usuário escolha o intervalo de tempo para análise:

- Últimos 7 dias (padrão)
- Últimos 30 dias
- Últimos 3 meses
- Últimos 12 meses

### 3. Relatórios por Abas

A interface é organizada em abas para diferentes tipos de relatórios:

#### Aba de Vendas
- Gráfico de vendas ao longo do tempo
- Tabela detalhada mostrando:
  - Data do pedido
  - Quantidade de pedidos
  - Valor total
  - Método de pagamento

#### Aba de Produtos Populares
- Gráfico de produtos mais vendidos
- Tabela detalhada mostrando:
  - Nome do produto
  - Quantidade vendida
  - Valor total gerado
  - Categoria do produto

#### Aba de Clientes
- Gráfico de frequência de clientes
- Tabela de clientes frequentes com:
  - Nome do cliente
  - Total de pedidos realizados
  - Valor total gasto
  - Data do último pedido

### 4. Exportação de Dados

Botões para exportação de relatórios em diferentes formatos:
- Excel
- PDF

## Implementação Técnica

### Estrutura de Componentes

A página foi implementada como um componente React com estado local para:
- Período selecionado (`reportPeriod`)
- Aba ativa (`activeTab`)

### Dados

Os dados são obtidos através de simulação para fins de demonstração:
- `salesData`: Dados de vendas diárias
- `topProducts`: Produtos mais vendidos
- `customerData`: Informações de clientes frequentes

Na implementação final, estes dados serão obtidos via API do Appwrite.

### Responsividade

A interface é totalmente responsiva:
- Layout fluido que se adapta a diferentes tamanhos de tela
- Alteração para layout vertical em dispositivos móveis
- Design adaptativo para elementos como tabelas e cards

## Fluxo de Uso

1. O administrador acessa a página de relatórios
2. Seleciona o período desejado para análise
3. Navega entre as abas para visualizar diferentes métricas
4. Utiliza os botões de exportação para salvar relatórios, se necessário

## Considerações Futuras

Em versões futuras, a página de relatórios poderá incluir:

- Gráficos interativos com bibliotecas como Chart.js ou Recharts
- Filtros adicionais por categorias, métodos de pagamento, etc.
- Relatórios personalizáveis onde o usuário seleciona as métricas desejadas
- Agendamento de relatórios recorrentes por e-mail 