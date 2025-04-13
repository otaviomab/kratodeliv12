# Área Administrativa (Painel do Comerciante)

## 1. Página de Login e Cadastro

### Login (/admin/login)

Interface de autenticação com campos:
- Email/usuário
- Senha
- Botão "Esqueci minha senha"
- Botão de login
- Link para cadastro 

### Cadastro (/admin/signup)

Formulário de registro com:
- Nome do estabelecimento
- Email
- Senha e confirmação
- Telefone
- CNPJ (opcional)
- Tipo de estabelecimento (restaurante, pizzaria, etc)
- Botão para finalizar cadastro 

## 2. Dashboard Principal (/admin/dashboard)

- Header com nome do estabelecimento e foto
- Sidebar de navegação (componente AdminSidebar.tsx)
- Cartões com estatísticas principais:
  - Total de pedidos do dia
  - Faturamento do dia
  - Ticket médio
  - Status de atividade (aberto/fechado) 
- Lista de pedidos recentes com:
  - Horário
  - Cliente
  - Valor
  - Status
  - Botão para visualizar detalhes 
- Gráfico simples de vendas por hora/dia (usando recharts) 

## 3. Gerenciamento de Pedidos (/admin/orders)

- Filtros por:
  - Status (novos, em andamento, entregues, cancelados)
  - Data
  - Método de pagamento 
- Lista de pedidos com:
  - ID do pedido
  - Nome do cliente
  - Horário
  - Valor total
  - Status atual
  - Método de pagamento
  - Tipo (entrega/retirada) 
- Modal para visualização completa do pedido:
  - Detalhes do cliente
  - Endereço de entrega
  - Itens do pedido
  - Observações
  - Histórico de status
  - Botões para alterar status 
- Área para impressão térmica do pedido 
 
## 4. Gerenciamento de Cardápio (/admin/menu)

- Interface para criação/edição de categorias:
  - Nome da categoria
  - Descrição
  - Ordem de exibição
  - Status (ativa/inativa) 
- Interface para produtos:
  - Lista de produtos existentes
  - Formulário para novo produto
  - Campos: nome, descrição, preço, categoria, imagem
  - Suporte para upload de imagens (react-dropzone)
  - Opção para adicionais/complementos
  - Configuração para produtos personalizados (ex: pizza meio a meio) 
 
## 5. Configurações (/admin/settings)

### Informações Gerais

- Logo do estabelecimento
- Imagem de capa
- Nome do estabelecimento
- Descrição
- Contatos (telefone, e-mail, redes sociais) 

### Endereço

- Campos para endereço completo
- Possibilidade de exibir no mapa 

### Horários de Funcionamento

- Interface para definir horários por dia da semana
- Opção para definir horários especiais/feriados 

### Entregas

- Configuração de zonas de entrega
- Taxas por região/CEP
- Tempo estimado de entrega
- Valor mínimo para pedidos 
 
### Método de Pagamento

- Seleção dos métodos aceitos:
  - Cartão na entrega
  - Dinheiro
  - PIX
- Configuração de cada método 
 
### WhatsApp

- Configuração do número para integração
- Templates de mensagens para clientes
- Opções de notificação automática 
 
### Impressão Térmica

- Configuração de impressoras
- Template do cupom
- Opções de impressão automática 
 
## 6. Relatórios (/admin/reports)

- Filtros por período (dia, semana, mês)
- Gráficos de vendas usando recharts
- Análise de produtos mais vendidos
- Relatório de faturamento
- Ticket médio por período 

## 7. Planos de Assinatura (/admin/plans)

- Visualização do plano atual
- Comparativo entre planos disponíveis
- Informações sobre recursos de cada plano
- Processo para upgrade/downgrade 
 
## Considerações para UI/UX

- Utilizar Tailwind CSS para estilização 
- Componentes de Radix UI para elementos interativos (modais, dropdowns) 
- Sistema de notificações para novos pedidos usando react-hot-toast 
- Interface responsiva para desktop e tablet
- Temas claros/escuros (opcional)
- Sons para notificações usando use-sound 

## Ordem de Desenvolvimento Sugerida

### Layout e componentes base:
- AdminSidebar
- Header
- Estrutura básica das páginas 

### Autenticação:
- Páginas de login e cadastro
- Hooks de autenticação (useAuth.ts) 

### Dashboard:
- Estrutura estática do dashboard
- Componentes de estatísticas 

### Gerenciamento de Pedidos:
- Lista de pedidos
- Modal de detalhes 

### Cardápio:
- CRUD de categorias e produtos
- Upload de imagens 

### Configurações:
- Todas as abas de configuração 

### Relatórios e Planos:
- Interfaces de relatórios
- Visualização de planos 
