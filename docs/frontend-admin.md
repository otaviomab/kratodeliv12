# Frontend Admin - Documentação

## Visão Geral

O módulo de administração do Cardápio Digital Krato permite que proprietários de estabelecimentos gerenciem todos os aspectos de seu cardápio digital, configurações do estabelecimento e pedidos recebidos.

## Autenticação {#autenticacao}

**Propósito**: Controla o acesso ao painel administrativo.

**Implementação**:

- Páginas de login e recuperação de senha em `app/admin/login/page.tsx` e `app/admin/recuperar-senha/page.tsx`
- Autenticação baseada em JWT (JSON Web Tokens)
- Armazenamento de tokens no localStorage para persistência de sessão
- Middleware de autenticação em `middleware.ts` para proteger rotas administrativas

## Dashboard {#dashboard}

**Propósito**: Fornece uma visão geral das métricas e atividades do estabelecimento.

**Implementação**:

- Localizado em `app/admin/page.tsx`
- Componentes:
  - Cartões de estatísticas (vendas, pedidos, produtos)
  - Gráficos de desempenho (vendas diárias/mensais)
  - Lista de pedidos recentes
  - Notificações e alertas

## Gerenciamento de Cardápio {#gerenciamento-cardapio}

### Categorias {#categorias}

**Propósito**: Permite criar, editar e organizar categorias de produtos.

**Implementação**:

- Localizado em `app/admin/menu/page.tsx` (listagem) e `app/admin/menu/categories/[id]/page.tsx` (edição)
- Funcionalidades:
  - Criação de novas categorias
  - Edição de categorias existentes
  - Reordenação de categorias (arrastar e soltar)
  - Ativação/desativação de categorias

### Produtos {#produtos}

**Propósito**: Permite gerenciar todos os produtos do cardápio.

**Implementação**:

- Localizado em `app/admin/menu/products/page.tsx` (listagem) e `app/admin/menu/products/[id]/page.tsx` (edição)
- Funcionalidades:
  - Cadastro de novos produtos
  - Edição de produtos existentes
  - Upload de imagens
  - Definição de preços, descrições e disponibilidade
  - Associação a categorias
  - Configuração de adicionais e opções

### Adicionais {#adicionais}

**Propósito**: Permite criar e gerenciar itens adicionais para produtos.

**Implementação**:

- Integrado na página de edição de produto
- Funcionalidades:
  - Criação de grupos de adicionais
  - Definição de itens opcionais ou obrigatórios
  - Configuração de preços para cada adicional
  - Limites mínimos e máximos de seleção

## Gerenciamento de Pedidos {#gerenciamento-pedidos}

**Propósito**: Permite visualizar, gerenciar e processar pedidos recebidos.

**Implementação**:

- Localizado em `app/admin/orders/page.tsx` (listagem) e `app/admin/orders/[id]/page.tsx` (detalhes)
- Funcionalidades:
  - Visualização de pedidos por status (novos, em preparação, entrega, concluídos)
  - Detalhes completos do pedido (itens, valores, endereço, cliente)
  - Atualização de status do pedido
  - Histórico de alterações
  - Notificações de novos pedidos
  - Impressão de comanda

## Configurações {#configuracoes}

**Propósito**: Permite configurar informações e preferências do estabelecimento.

**Implementação**:

- Localizado em `app/admin/settings/page.tsx`
- Seções:
  - **Informações Gerais**: Nome, descrição, logo, contato
  - **Endereço**: Endereço físico do estabelecimento
  - **Horário de Funcionamento**: Dias e horários de operação
  - **Entrega**: Configurações de entrega, taxas, áreas atendidas
  - **Pagamentos**: Métodos de pagamento aceitos
  - **Notificações**: Configurações de alertas por e-mail, SMS

## Relatórios {#relatorios}

**Propósito**: Fornece insights sobre vendas, produtos populares e comportamento do cliente.

**Implementação**:

- Localizado em `app/admin/reports/page.tsx`
- Tipos de relatórios:
  - Vendas por período
  - Produtos mais vendidos
  - Horários de pico
  - Clientes frequentes
  - Desempenho de categorias

## Componentes Reutilizáveis {#componentes-admin}

### Sidebar {#sidebar}

**Propósito**: Fornece navegação principal pelo painel administrativo.

**Implementação**:

- Localizado em `components/admin/Sidebar.tsx`
- Links para todas as seções do painel
- Indicador da seção atual
- Versão responsiva (recolhível em dispositivos móveis)

### DataTable {#datatable}

**Propósito**: Exibe dados em formato tabular com recursos avançados.

**Implementação**:

- Localizado em `components/ui/DataTable.tsx`
- Recursos:
  - Ordenação de colunas
  - Filtros
  - Paginação
  - Seleção de linhas
  - Ações em massa
  - Exportação de dados

### Form {#form}

**Propósito**: Componentes reutilizáveis para criação de formulários.

**Implementação**:

- Localizado em `components/ui/Form.tsx`
- Elementos:
  - Inputs
  - Select
  - Checkbox
  - Radio
  - Upload de imagens
  - Editor de texto rico
  - Date/time picker 