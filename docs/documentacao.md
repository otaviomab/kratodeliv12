# Documentação Detalhada - Cardápio Digital Krato

## Introdução ao Sistema {#introducao}

**Propósito**: O Cardápio Digital Krato é uma plataforma que permite a restaurantes e estabelecimentos de alimentação gerenciar seu cardápio digital, receber pedidos online e administrar todo o processo de atendimento ao cliente.

**Implementação**: Desenvolvido com Next.js, TypeScript e Tailwind CSS para o frontend, com Appwrite como backend.

## Gerenciamento de Cardápio {#cardapio}

### Categorias {#categorias}

**Propósito**: Permite que o administrador organize os produtos em categorias lógicas como "Entradas", "Pratos Principais", "Sobremesas", etc.

**Implementação**: 

- Localizado em `app/admin/menu/page.tsx` (listagem) e `app/admin/menu/categories/[id]/page.tsx` (edição/criação)
- Utiliza estados React para manipulação dos dados
- Funcionalidades:
  - Listagem de categorias com busca e filtros
  - Criação de novas categorias
  - Edição de categorias existentes
  - Ativação/desativação de categorias
  - Exclusão de categorias

**Exemplo de Uso**:

1. Acesse o painel administrativo em `/admin/menu`
2. Clique em "Nova Categoria" para adicionar uma categoria
3. Preencha o nome e descrição (opcional)
4. Utilize os botões de ação para editar, desativar ou excluir categorias existentes
5. Clique em "Ver Produtos" para visualizar os produtos de uma categoria específica

### Produtos {#produtos}

**Propósito**: Gerencia os itens individuais do cardápio com suas informações, preços e configurações.

**Implementação**:

- Localizado em `app/admin/menu/products/page.tsx` (listagem) e `app/admin/menu/products/[id]/page.tsx` (edição/criação)
- Características principais:
  - Listagem de produtos com filtros por categoria e busca textual
  - Formulário completo para criação/edição de produtos
  - Suporte para imagens via URL
  - Configurações de status (ativo/inativo)
  - Configuração para produtos customizáveis

**Exemplo de Uso**:

1. Acesse o painel administrativo em `/admin/menu/products`
2. Use os filtros para encontrar produtos por categoria ou termos de busca
3. Clique em "Novo Produto" para adicionar um produto
4. Preencha os dados do produto (nome, descrição, preço, categoria, etc.)
5. Ative as opções relevantes (produto customizável, possui adicionais)
6. Salve o produto para adicioná-lo ao cardápio

### Gerenciamento de Adicionais {#adicionais}

**Propósito**: Permite configurar itens adicionais que podem ser escolhidos pelos clientes para personalizar produtos.

**Implementação**:

- Integrado à página de edição de produtos `app/admin/menu/products/[id]/page.tsx`
- Funcionalidades:
  - Adicionar/remover itens adicionais a um produto
  - Definir preço individual para cada adicional
  - Visualização em tempo real dos adicionais configurados

**Exemplo de Uso**:

1. Na tela de edição do produto, ative a opção "Possui adicionais"
2. Clique em "Adicionar" para incluir um novo adicional
3. Defina o nome e preço do adicional
4. Adicione quantos adicionais forem necessários
5. Remova adicionais clicando no ícone de lixeira

## Gerenciamento de Pedidos {#pedidos}

### Listagem de Pedidos {#listagem-pedidos}

**Propósito**: Permite visualizar e gerenciar todos os pedidos recebidos pelo estabelecimento.

**Implementação**:

- Localizado em `app/admin/orders/page.tsx`
- Recursos:
  - Listagem de pedidos com filtros por status e busca
  - Organização por data/hora
  - Atualização de status diretamente na listagem
  - Acesso rápido aos detalhes de cada pedido

### Detalhes de Pedido {#detalhes-pedido}

**Propósito**: Fornece visualização completa de um pedido específico, incluindo itens, valores, dados do cliente e opções de gerenciamento.

**Implementação**:

- Localizado em `app/admin/orders/[id]/page.tsx`
- Recursos:
  - Visualização detalhada dos itens do pedido
  - Informações do cliente e endereço de entrega
  - Cálculo de subtotal, taxa de entrega e total
  - Funcionalidade de impressão do pedido
  - Painel para atualização de status

**Exemplo de Uso**:

1. Na listagem de pedidos, clique em "Detalhes" para um pedido específico
2. Visualize todas as informações do pedido na tela de detalhes
3. Utilize os botões de status para atualizar o andamento do pedido
4. Clique em "Imprimir" para gerar uma versão para impressão

### Status de Pedidos {#status-pedidos}

**Propósito**: Gerencia o ciclo de vida dos pedidos desde o recebimento até a entrega.

**Implementação**:

- Status disponíveis:
  - Recebido: Pedido inicial
  - Em preparo: Pedido está sendo preparado na cozinha
  - Pronto: Pedido finalizado, aguardando entrega/retirada
  - Entregue: Pedido entregue ao cliente
  - Cancelado: Pedido foi cancelado

## Módulo de Configurações {#configuracoes}

**Propósito**: Permite aos estabelecimentos personalizar diversos aspectos de sua operação, incluindo informações gerais, endereço, horários de funcionamento, configurações de entrega, métodos de pagamento e integrações.

**Implementação**:
- O módulo foi desenvolvido como uma série de endpoints API separados para facilitar a manutenção
- Cada endpoint segue um padrão consistente de validação, atualização e resposta
- Implementado com rotas Next.js API Routes no padrão REST
- Integração com banco de dados Appwrite para armazenamento persistente
- Para detalhes completos de cada API, consulte a [Referência de API](docs/api-reference.md#api-do-módulo-de-configurações)

### Informações Gerais {#informacoes-gerais}

**Propósito**: Gerencia informações básicas do estabelecimento como nome, descrição, tipo e contatos.

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/update/route.ts`
- Funcionalidades:
  - Atualização de nome, descrição e tipo do estabelecimento
  - Gerenciamento de números de telefone e WhatsApp
  - Validação de dados obrigatórios
  - Suporte para campos opcionais

**Exemplo de Uso**:
1. Acesse a página de configurações do estabelecimento
2. Edite as informações gerais no formulário correspondente
3. Clique em "Salvar" para atualizar os dados

**Validações**:
- ID do estabelecimento válido
- Campos opcionais são validados se fornecidos

### Gerenciamento de Endereço {#gerenciamento-endereco}

**Propósito**: Permite configurar e atualizar o endereço físico do estabelecimento.

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/address/route.ts`
- Funcionalidades:
  - Atualização completa de informações de endereço
  - Validação de campos obrigatórios (rua, número, bairro, cidade, estado, CEP)
  - Suporte para informações complementares e geolocalização

**Validações**:
- Todos os campos obrigatórios devem ser preenchidos
- Formatação adequada para CEP
- Verificação da existência do estabelecimento antes da atualização

### Horários de Funcionamento {#horarios-funcionamento}

**Propósito**: Configura os horários em que o estabelecimento está aberto para atendimento.

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/business-hours/route.ts`
- Funcionalidades:
  - Configuração de horários para cada dia da semana
  - Opção para marcar dias em que o estabelecimento não funciona
  - Validação de formato de horário (HH:MM)
  - Verificação automática do status atual (aberto/fechado)

**Validações**:
- Dias marcados como abertos devem ter horários de abertura e fechamento
- Formato de hora deve seguir o padrão HH:MM
- Dias da semana devem ser representados por números de 0 (domingo) a 6 (sábado)

### Configurações de Entrega {#configuracoes-entrega}

**Propósito**: Gerencia as configurações relacionadas ao serviço de entrega do estabelecimento.

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/delivery-settings/route.ts`
- Funcionalidades:
  - Ativação/desativação do serviço de entrega
  - Configuração de valor mínimo para pedidos
  - Definição de taxa de entrega padrão
  - Configuração de tempo estimado de entrega
  - Gerenciamento de zonas de entrega com taxas específicas

**Exemplo de Zonas de Entrega**:
- Zona 1 (até 2km): Taxa de R$ 5,00
- Zona 2 (2-5km): Taxa de R$ 8,00
- Zona 3 (5-10km): Taxa de R$ 12,00

**Validações**:
- Campo `hasDelivery` é obrigatório
- Valores numéricos devem ser positivos
- Zonas de entrega devem conter nome e taxa válida

### Métodos de Pagamento {#metodos-pagamento}

**Propósito**: Configura quais métodos de pagamento são aceitos pelo estabelecimento.

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/payment-methods/route.ts`
- Funcionalidades:
  - Seleção de múltiplos métodos de pagamento
  - Validação contra lista de métodos suportados
  - Remoção automática de duplicatas

**Métodos Suportados**:
- Cartão de crédito (`credit_card`)
- Cartão de débito (`debit_card`)
- Dinheiro (`cash`)
- PIX (`pix`)
- Transferência bancária (`bank_transfer`)
- Vale-refeição (`meal_voucher`)
- Vale-alimentação (`food_voucher`)

**Validações**:
- Cada método deve estar na lista de métodos suportados
- Remoção automática de métodos duplicados
- Verificação da existência do estabelecimento antes da atualização

### Integração com WhatsApp {#integracao-whatsapp}

**Propósito**: Configura a integração para envio de notificações via WhatsApp.

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/whatsapp/route.ts`
- Funcionalidades:
  - Configuração do número de WhatsApp do estabelecimento
  - Ativação/desativação de notificações para novos pedidos
  - Ativação/desativação de notificações para alterações de status
  - Personalização de mensagens para diferentes eventos

**Exemplo de Mensagens Personalizadas**:
- Novo pedido: "Olá! Você recebeu um novo pedido #{{orderId}}"
- Pedido confirmado: "O pedido #{{orderId}} foi confirmado"
- Pedido pronto: "O pedido #{{orderId}} está pronto para retirada/entrega"
- Pedido entregue: "O pedido #{{orderId}} foi entregue"

**Validações**:
- O número de WhatsApp deve seguir um formato válido
- Pelo menos um tipo de notificação deve estar ativado
- Verificação da existência do estabelecimento antes da atualização

## Rotas de API {#rotas-api}

### Menu API

**Propósito**: Fornecer endpoints para acessar o cardápio digital

**Implementação**:

- Localizada em `app/api/menu/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `categories` e `products`

**Endpoints**:

- `GET /api/menu?establishmentId={id}` - Retorna o cardápio completo de um estabelecimento
  - Inclui todas as categorias e produtos ativos
  - Parâmetros:
    - `establishmentId` (obrigatório): ID do estabelecimento

### API de Categorias

**Propósito**: Gerencia as categorias do cardápio digital, permitindo operações de CRUD completo.

**Implementação**:

- Localizada em `app/api/menu/categories/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `categories`

**Endpoints**:

- `GET /api/menu/categories?establishmentId={id}` - Lista categorias de um estabelecimento
- `POST /api/menu/categories` - Cria uma nova categoria
- `PUT /api/menu/categories` - Atualiza uma categoria existente
- `DELETE /api/menu/categories?id={id}` - Remove uma categoria

### API do Estabelecimento

**Propósito**: Gerencia informações do estabelecimento.

**Implementação**:

- Localizada em `app/api/establishment/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:

- `GET /api/establishment?identifier={id}` - Retorna informações de um estabelecimento
  - Parâmetros:
    - `identifier` (obrigatório): ID do estabelecimento

### API de Carrinho

**Propósito**: Gerencia o carrinho de compras do cliente.

**Implementação**:

- Localizada em `app/api/cart/route.ts`
- Utiliza cookies no navegador para armazenamento local
- Funções para adicionar, remover e atualizar itens

**Endpoints**:

- `POST /api/cart/add` - Adiciona um item ao carrinho
- `POST /api/cart/remove` - Remove um item do carrinho
- `POST /api/cart/update` - Atualiza a quantidade de um item
- `POST /api/cart/clear` - Limpa o carrinho

### API do Módulo de Configurações {#api-configuracoes}

**Propósito**: Gerencia as configurações personalizadas dos estabelecimentos.

#### API de Informações Gerais {#api-informacoes-gerais}

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/update/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:
- `PATCH /api/establishment/[identifier]/update` - Atualiza informações gerais do estabelecimento
  - Parâmetros de URL:
    - `identifier` (obrigatório): ID do estabelecimento
  - Corpo da Requisição:
    - `name` (opcional): Nome do estabelecimento
    - `description` (opcional): Descrição do estabelecimento
    - `type` (opcional): Tipo do estabelecimento (restaurante, bar, etc.)
    - `phone` (opcional): Número de telefone
    - `whatsapp` (opcional): Número de WhatsApp
  - Resposta:
    - Objeto com dados atualizados do estabelecimento

**Exemplo de Uso**:
```http
PATCH /api/establishment/123456/update
Content-Type: application/json

{
  "name": "Restaurante Exemplo",
  "description": "Especializado em comida italiana",
  "type": "restaurant",
  "phone": "11999887766",
  "whatsapp": "11999887766"
}
```

#### API de Endereço {#api-endereco}

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/address/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:
- `PATCH /api/establishment/[identifier]/address` - Atualiza endereço do estabelecimento
  - Parâmetros de URL:
    - `identifier` (obrigatório): ID do estabelecimento
  - Corpo da Requisição:
    - `street` (obrigatório): Nome da rua
    - `number` (obrigatório): Número
    - `complement` (opcional): Complemento
    - `neighborhood` (obrigatório): Bairro
    - `city` (obrigatório): Cidade
    - `state` (obrigatório): Estado
    - `zipCode` (obrigatório): CEP
  - Resposta:
    - Objeto com dados atualizados do estabelecimento

**Exemplo de Uso**:
```http
PATCH /api/establishment/123456/address
Content-Type: application/json

{
  "street": "Rua Exemplo",
  "number": "123",
  "complement": "Sala 101",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567"
}
```

#### API de Horários de Funcionamento {#api-horarios}

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/business-hours/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:
- `PATCH /api/establishment/[identifier]/business-hours` - Atualiza horários de funcionamento
  - Parâmetros de URL:
    - `identifier` (obrigatório): ID do estabelecimento
  - Corpo da Requisição:
    - Array de objetos com horários para cada dia da semana:
      - `day` (obrigatório): Número do dia da semana (0-6, sendo 0=domingo)
      - `isOpen` (obrigatório): Indica se está aberto neste dia
      - `openTime` (condicional): Horário de abertura (obrigatório se isOpen=true)
      - `closeTime` (condicional): Horário de fechamento (obrigatório se isOpen=true)
  - Resposta:
    - Objeto com dados atualizados do estabelecimento

**Exemplo de Uso**:
```http
PATCH /api/establishment/123456/business-hours
Content-Type: application/json

[
  {
    "day": 0,
    "isOpen": false
  },
  {
    "day": 1,
    "isOpen": true,
    "openTime": "10:00",
    "closeTime": "22:00"
  },
  {
    "day": 2,
    "isOpen": true,
    "openTime": "10:00",
    "closeTime": "22:00"
  }
]
```

#### API de Configurações de Entrega {#api-entrega}

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/delivery-settings/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:
- `PATCH /api/establishment/[identifier]/delivery-settings` - Atualiza configurações de entrega
  - Parâmetros de URL:
    - `identifier` (obrigatório): ID do estabelecimento
  - Corpo da Requisição:
    - `isDeliveryEnabled` (obrigatório): Indica se o serviço de entrega está ativo
    - `minimumOrderValue` (opcional): Valor mínimo para pedidos com entrega
    - `defaultDeliveryFee` (opcional): Taxa de entrega padrão
    - `estimatedDeliveryTime` (opcional): Tempo estimado de entrega em minutos
    - `deliveryZones` (opcional): Array de zonas de entrega com taxas específicas
  - Resposta:
    - Objeto com dados atualizados do estabelecimento

**Exemplo de Uso**:
```http
PATCH /api/establishment/123456/delivery-settings
Content-Type: application/json

{
  "isDeliveryEnabled": true,
  "minimumOrderValue": 20.00,
  "defaultDeliveryFee": 5.00,
  "estimatedDeliveryTime": 45,
  "deliveryZones": [
    {
      "name": "Zona 1",
      "radius": 2,
      "fee": 5.00
    },
    {
      "name": "Zona 2",
      "radius": 5,
      "fee": 8.00
    }
  ]
}
```

#### API de Métodos de Pagamento {#api-pagamentos}

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/payment-methods/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:
- `PATCH /api/establishment/[identifier]/payment-methods` - Atualiza métodos de pagamento aceitos
  - Parâmetros de URL:
    - `identifier` (obrigatório): ID do estabelecimento
  - Corpo da Requisição:
    - Array de strings com métodos de pagamento
  - Resposta:
    - Objeto com dados atualizados do estabelecimento

**Exemplo de Uso**:
```http
PATCH /api/establishment/123456/payment-methods
Content-Type: application/json

[
  "creditCard",
  "debitCard",
  "cash",
  "pix"
]
```

#### API de Integração com WhatsApp {#api-whatsapp}

**Implementação**:
- Localizada em `app/api/establishment/[identifier]/whatsapp/route.ts`
- Utiliza o Appwrite Database como backend
- Database ID: `kratodeliv_db`
- Collection ID: `establishments`

**Endpoints**:
- `PATCH /api/establishment/[identifier]/whatsapp` - Configura integração com WhatsApp
  - Parâmetros de URL:
    - `identifier` (obrigatório): ID do estabelecimento
  - Corpo da Requisição:
    - `whatsappNumber` (obrigatório): Número de WhatsApp para receber notificações
    - `notifyNewOrders` (opcional): Notifica sobre novos pedidos
    - `notifyStatusChanges` (opcional): Notifica sobre mudanças de status
    - `customMessages` (opcional): Mensagens personalizadas para diferentes eventos
  - Resposta:
    - Objeto com dados atualizados do estabelecimento

**Exemplo de Uso**:
```http
PATCH /api/establishment/123456/whatsapp
Content-Type: application/json

{
  "whatsappNumber": "5511999887766",
  "notifyNewOrders": true,
  "notifyStatusChanges": true,
  "customMessages": {
    "newOrder": "Olá! Você recebeu um novo pedido #{{orderId}}",
    "orderReady": "O pedido #{{orderId}} está pronto para retirada/entrega"
  }
}
```

## Arquitetura <a id="arquitetura"></a>

O projeto utiliza uma arquitetura baseada em Next.js 14 com App Router, que permite uma estrutura organizada de rotas e layouts. A organização segue o conceito de feature-based design, onde cada funcionalidade principal tem seu próprio diretório contendo seus componentes, hooks e utilitários.

### Tecnologias Principais:
- **Next.js 14**: Framework React com suporte a SSR, SSG e renderização híbrida
- **React**: Biblioteca para construção de interfaces
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **Shadcn/UI**: Biblioteca de componentes UI reutilizáveis
- **TypeScript**: Linguagem tipada para desenvolvimento com maior segurança

## Componentes Principais <a id="componentes-principais"></a>

### Layouts
- **RootLayout**: Layout base para toda a aplicação
- **AdminLayout**: Layout específico para seções administrativas
- **MenuLayout**: Layout para as páginas de cardápio

### Componentes UI
- **Card**: Exibe itens de cardápio
- **Button**: Componente reutilizável para botões
- **Navbar**: Barra de navegação principal
- **Sidebar**: Barra lateral para navegação administrativa
- **ImageDisplay**: Componente para exibição otimizada de imagens
- **StatusIndicator**: Indicador de status para pedidos

## Páginas <a id="paginas"></a>

### Principais Páginas
- **Home**: Página inicial com apresentação do cardápio
- **Menu**: Exibição do cardápio completo
- **Cart**: Carrinho de compras
- **OrderStatus**: Página para acompanhamento de pedidos
- **AdminDashboard**: Painel administrativo principal
- **AdminMenu**: Gerenciamento de itens do cardápio

## Setup Inicial <a id="setup-inicial"></a>

Para iniciar o projeto localmente:

```bash
# Instalação de dependências
yarn install

# Executar em modo de desenvolvimento
yarn dev

# Construir para produção
yarn build

# Iniciar em modo de produção
yarn start
```

## Layouts <a id="layouts"></a>

Os layouts são definidos usando o sistema de layouts aninhados do Next.js, permitindo compartilhar elementos de UI entre diferentes rotas sem precisar recarregar componentes comuns.

## Estilização com Tailwind CSS <a id="estilizacao"></a>

O projeto utiliza Tailwind CSS para estilização, com algumas classes utilitárias personalizadas definidas no arquivo `tailwind.config.js`. 

### Extensões de Cores
```js
colors: {
  primary: { ... },
  secondary: { ... },
  accent: { ... }
}
```

## Componentes UI <a id="componentes-ui"></a>

Os componentes de UI seguem uma estrutura consistente:
- Props tipadas com TypeScript
- Suporte a extensão de classes CSS via `className`
- Variantes disponíveis para diferentes estilos/comportamentos
- Acessibilidade como prioridade

## Navegação do Cardápio <a id="navegacao-cardapio"></a>

A navegação do cardápio é organizada por categorias, permitindo ao usuário navegar facilmente entre diferentes tipos de produtos. A estrutura de rotas é projetada para ser intuitiva e refletir a organização do menu físico.

## Processo de Pedido <a id="processo-pedido"></a>

O fluxo de pedido consiste nas seguintes etapas:
1. Adição de itens ao carrinho
2. Revisão do carrinho
3. Confirmação do pedido
4. Acompanhamento do status

## Status de Pedido <a id="status-pedido"></a>

O sistema de status de pedido utiliza uma visualização por etapas que mostra claramente em qual estágio o pedido se encontra:
- Recebido
- Em preparação
- Pronto para entrega
- Em rota de entrega
- Entregue

## Painel Administrativo <a id="painel-administrativo"></a>

O painel administrativo permite:
- Gerenciamento de itens do cardápio
- Acompanhamento de pedidos
- Controle de estoque
- Visualização de estatísticas
- Gerenciamento de usuários

## Formatadores <a id="formatadores"></a>

Utilitários para formatação de dados:
- Formatação de preços
- Formatação de datas
- Formatação de status

## Tipos e Interfaces <a id="tipos-interfaces"></a>

Os principais tipos e interfaces estão definidos em arquivos `.d.ts` específicos ou junto aos componentes relevantes. O uso rigoroso de tipagem ajuda a prevenir erros comuns durante o desenvolvimento.

## Estrutura de Rotas <a id="estrutura-rotas"></a>

A estrutura de rotas segue o padrão do App Router do Next.js:
- `/`: Página inicial
- `/menu`: Cardápio principal
- `/menu/[category]`: Visualização por categoria
- `/cart`: Carrinho de compras
- `/order-status`: Status do pedido
- `/admin`: Painel administrativo
- `/admin/menu`: Gerenciamento do cardápio
- `/admin/orders`: Gerenciamento de pedidos

## Navegação Dinâmica <a id="navegacao-dinamica"></a>

A aplicação utiliza navegação dinâmica para categorias e produtos, permitindo URLs amigáveis e SEO-friendly. 

## Dashboard Administrativo <a id="dashboard-administrativo"></a>

### Propósito
Fornecer uma visão geral do estabelecimento com indicadores de desempenho, gráficos e lista de pedidos recentes.

### Implementação
O dashboard utiliza componentes React com o framework Next.js 15 e gráficos implementados com a biblioteca Recharts para visualização de dados.

#### Componentes Principais

1. **SalesChart**
   - **Propósito**: Exibir um gráfico de área mostrando as vendas da última semana.
   - **Implementação**: Utiliza `AreaChart` do Recharts com dados simulados gerados dinamicamente.
   - **Localização**: `components/SalesChart.tsx`
   - **Características**: 
     - Formatação de datas em português usando `date-fns` e `locale/ptBR`
     - Layout responsivo
     - Tooltip personalizado para melhor visualização dos valores

2. **TopCategoriesChart**
   - **Propósito**: Exibir as categorias mais vendidas em formato de gráfico de pizza.
   - **Implementação**: Utiliza `PieChart` do Recharts com dados simulados.
   - **Localização**: `components/TopCategoriesChart.tsx`
   - **Características**:
     - Esquema de cores para diferentes categorias
     - Visualização em percentual
     - Legendas interativas

3. **DashboardPage**
   - **Propósito**: Página principal do dashboard que agrega cartões de estatísticas e gráficos.
   - **Implementação**: Componente React com layout baseado em grid.
   - **Localização**: `app/admin/dashboard/page.tsx`
   - **Características**:
     - Cartões de estatísticas (pedidos, faturamento, ticket médio)
     - Indicador de status do estabelecimento (aberto/fechado)
     - Lista de pedidos recentes
     - Filtro por período

## Sistema de Gerenciamento de Pedidos <a id="sistema-gerenciamento-pedidos"></a>

### Propósito
Permitir o acompanhamento e gerenciamento completo dos pedidos recebidos pelo estabelecimento.

### Implementação
Sistema baseado em uma tabela de listagem com filtros e um modal para visualização detalhada e alteração de status.

#### Componentes Principais

1. **OrderDetailsModal**
   - **Propósito**: Modal para visualização detalhada de um pedido e alteração de status.
   - **Implementação**: Componente React com estado para controle de status.
   - **Localização**: `components/OrderDetailsModal.tsx`
   - **Características**:
     - Informações do cliente
     - Lista de itens do pedido com preços
     - Resumo financeiro com subtotal e taxa de entrega
     - Botões para alteração de status do pedido
     - Interface para observações e adicionais dos itens

2. **OrdersPage**
   - **Propósito**: Página de listagem de pedidos com filtros.
   - **Implementação**: Componente Cliente React com estado para abertura do modal.
   - **Localização**: `app/admin/orders/page.tsx`
   - **Características**:
     - Filtros por status e data
     - Tabela responsiva
     - Paginação
     - Botões para detalhes e alteração rápida

## Sistema de Autenticação <a id="sistema-autenticacao"></a>

### Propósito
Gerenciar o login, cadastro e estado de autenticação dos usuários na aplicação.

### Implementação
Contexto React para gerenciar o estado global de autenticação, preparado para integração futura com Appwrite.

#### Componentes Principais

1. **AuthContext**
   - **Propósito**: Contexto de autenticação para gerenciar login, cadastro e sessão.
   - **Implementação**: Context API do React com hooks personalizados.
   - **Localização**: `contexts/AuthContext.tsx`
   - **Características**:
     - Funções para login e cadastro
     - Gerenciamento de estado do usuário autenticado
     - Persistência em localStorage
     - Preparado para integração com Appwrite Auth no futuro
     - Tratamento de erros de autenticação

**Observação**: O sistema de autenticação está estruturado mas não está funcional, pois depende de integração com backend real (Appwrite). Ele serve como base para implementação futura.

## Autenticação

### Sistema de Rotas e Layouts {#autenticacao-rotas}

**Propósito**: Gerenciar a estrutura de rotas e layouts para páginas de autenticação e administrativas.

**Implementação**:
- Criação de dois grupos de rotas:
  - `(auth)`: Para páginas de autenticação sem sidebar
  - `(dashboard)`: Para páginas administrativas com sidebar
- Layouts específicos para cada grupo em:
  - `/app/admin/(auth)/layout.tsx`
  - `/app/admin/(dashboard)/layout.tsx`

**Exemplo**:
```tsx
// app/admin/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
```

### Páginas de Autenticação
O sistema possui três páginas principais para autenticação, todas seguindo o mesmo padrão visual moderno:

#### Login (`/admin/login`)
**Propósito**: Permite que usuários existentes acessem o sistema administrativo.

**Implementação**:
- Utiliza componentes do shadcn/ui para consistência visual
- Campos:
  - Email (obrigatório)
  - Senha (obrigatório)
  - Checkbox "Lembrar de mim"
- Links para:
  - Recuperação de senha
  - Criação de nova conta
- Estilização:
  - Cor principal: #fe5f02 (laranja)
  - Gradiente suave no background
  - Card com sombra e sem borda
  - Feedback visual nos estados de hover e loading

#### Cadastro (`/admin/cadastrar`)
**Propósito**: Permite que novos estabelecimentos criem uma conta no sistema.

**Implementação**:
- Utiliza componentes do shadcn/ui
- Campos:
  - Nome do estabelecimento (obrigatório)
  - WhatsApp (obrigatório)
    - Formatação automática: (XX) XXXXX-XXXX
    - Validação para 11 dígitos (DDD + 9 dígitos)
  - Email (obrigatório)
  - Senha (obrigatório)
  - Confirmar senha (obrigatório)
  - Checkbox de aceite dos termos (obrigatório)
- Links para:
  - Termos de Serviço
  - Política de Privacidade
  - Página de login
- Mesma estilização da página de login

#### Recuperação de Senha (`/admin/recuperar-senha`)
**Propósito**: Permite que usuários redefinam suas senhas através do email.

**Implementação**:
- Utiliza componentes do shadcn/ui
- Estados:
  1. Formulário inicial:
     - Campo de email (obrigatório)
     - Botão de envio
  2. Confirmação de envio:
     - Ícone de sucesso animado
     - Mensagens informativas
     - Link para verificar spam
- Link para retornar ao login
- Mesma estilização das outras páginas

### Componentes Compartilhados
Todas as páginas de autenticação compartilham:
- Logo do sistema (ícone Store)
- Título com efeito de gradiente
- Card com sombra
- Inputs estilizados
- Botões com estados de loading
- Links com transições suaves
- Feedback visual consistente

### Temas
O sistema suporta dois temas:

**Tema Claro**:
- Background: #FFFFFF
- Texto: #171717
- Elementos secundários: #F5F5F5

**Tema Escuro**:
- Background: #1C1C1C (cinza grafite)
- Cards: #2A2A2A
- Elementos secundários: #323232
- Bordas: #404040

A cor principal (#fe5f02) é mantida em ambos os temas para consistência da marca.

### Responsividade
Todas as páginas são totalmente responsivas:
- Layout centralizado
- Margens adaptativas
- Largura máxima de 400px para formulários
- Espaçamento otimizado para mobile
- Inputs e botões com tamanho adequado para touch

## Estrutura do Projeto

### Organização de Diretórios {#estrutura-diretorios}

**Propósito**: Manter o código organizado e facilitar a manutenção.

**Implementação**:
```
/app/admin/
├── (auth)/
│   ├── login/
│   ├── cadastrar/
│   ├── recuperar-senha/
│   └── layout.tsx
├── (dashboard)/
│   ├── dashboard/
│   ├── menu/
│   ├── orders/
│   ├── planos/
│   ├── reports/
│   ├── settings/
│   └── layout.tsx
└── layout.tsx
```

### Grupos de Rotas {#estrutura-grupos-rotas}

**Propósito**: Separar logicamente diferentes áreas da aplicação e seus layouts.

**Implementação**:
- Grupo `(auth)`:
  - URLs públicas: `/admin/login`, `/admin/cadastrar`, `/admin/recuperar-senha`
  - Layout simples sem sidebar
  - Foco em autenticação e registro
- Grupo `(dashboard)`:
  - URLs protegidas: `/admin/dashboard`, `/admin/menu`, etc.
  - Layout completo com sidebar
  - Acesso apenas para usuários autenticados

**Exemplo de URL**:
- URL pública: `example.com/admin/login`
- URL interna: `/app/admin/(auth)/login/page.tsx` 

### Cardápio (Menu)

**Propósito**: Gerenciar as categorias de produtos do cardápio do restaurante.

**Implementação**: 
- Página implementada com React e TypeScript
- Interface moderna com Tailwind CSS
- Gerenciamento de estado local com React Hooks (useState, useEffect)
- Sistema de notificações com Sonner

**Funcionalidades**:

1. **Listagem de Categorias**
   - Exibição em formato de tabela com colunas para nome, descrição, quantidade de produtos e status
   - Indicador visual de status (ativo/inativo) com badges coloridos
   - Hover effect nas linhas da tabela

2. **Ações por Categoria**
   - Botão "Desativar/Ativar": Fundo âmbar (bg-amber-100) com texto âmbar escuro
   - Botão "Ver produtos": Fundo com cor primária em 10% de opacidade
   - Botão "Excluir": Fundo vermelho claro (bg-red-100) com texto vermelho escuro
   - Todos os botões possuem:
     - Padding vertical (py-1.5) e horizontal (px-3)
     - Bordas arredondadas (rounded-md)
     - Efeito hover com transição suave
     - Alto contraste para melhor legibilidade

3. **Busca e Filtragem**
   - Campo de busca com ícone
   - Filtragem em tempo real por nome e descrição
   - Contador de categorias encontradas

4. **Gerenciamento de Categorias**
   - Modal para adicionar nova categoria
   - Modal de confirmação para exclusão
   - Feedback visual com toast notifications
   - Botão de atualização com animação de loading

**Temas**:
- Suporte a tema claro e escuro
- Cores consistentes com a identidade visual
- Backgrounds e borders adaptáveis ao tema

**Responsividade**:
- Layout adaptável para diferentes tamanhos de tela
- Cabeçalho responsivo com quebra de linha em telas menores
- Tabela com scroll horizontal em dispositivos móveis

**Estados de Loading**:
- Spinner animado durante carregamento inicial
- Feedback visual durante operações assíncronas
- Desabilitação de botões durante operações

### Atualizações de Estilo - Dashboard

**Propósito**: Padronizar o visual do dashboard com fundo cream e cards brancos.

**Implementação**: 
- Adicionado fundo cream (`bg-[#fdfaf5]`) ao container principal
- Cards com fundo branco e sombra suave
- Botões primários com texto branco para melhor contraste
- Zonas de entrega com fundo mais claro (`bg-[#fcf8f2]`)

**Páginas Atualizadas**:
1. Menu
2. Clientes
3. Relatórios
4. Planos
5. Configurações

**Detalhes das Alterações**:
- Container Principal: `space-y-6 p-6 bg-[#fdfaf5]`
- Cards: `bg-white dark:bg-card rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]`
- Botões Primários: `bg-primary text-white` (substituindo `text-primary-foreground` para garantir contraste)
- Zonas de Entrega: `bg-[#fcf8f2] dark:bg-card/80`

**Compatibilidade com Tema Escuro**:
- Mantida através da classe `dark:bg-card`
- Cards e elementos de interface adaptam-se automaticamente

### Página de Clientes
**Propósito**: Gerenciar e visualizar informações dos clientes cadastrados no sistema.

**Implementação**: 
- Interface com fundo cream (`bg-[#fdfaf5]`) e cards brancos para melhor contraste
- Busca por nome ou email do cliente
- Filtro de status (Todos/Ativos/Inativos) com fundo branco sólido
- Tabela com ordenação dinâmica nos cabeçalhos:
  - Nome (ordem alfabética)
  - Contato (ordem alfabética por email)
  - Total de Pedidos (ordem numérica)
  - Total Gasto (ordem numérica)
  - Último Pedido (ordem cronológica)

**Exemplo de Uso**:
```tsx
// Ordenação na tabela
const handleSort = (field: string) => {
  if (sortField === field) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortDirection("asc");
  }
};

// Uso no cabeçalho
<Button 
  variant="ghost" 
  className="flex items-center gap-1 -ml-3 bg-transparent hover:bg-muted/100"
  onClick={() => handleSort("nome")}
>
  Nome
  <ArrowUpDown className="h-4 w-4" />
</Button>
```

### Página de Relatórios
**Propósito**: Apresentar métricas e análises do negócio de forma clara e organizada.

**Implementação**:
- Interface com fundo cream (`bg-[#fdfaf5]`) e cards brancos
- Seletor de período com fundo branco sólido:
  - Últimos 7 dias
  - Últimos 15 dias
  - Últimos 30 dias
  - Últimos 90 dias
- Cards de métricas principais:
  - Vendas Totais
  - Pedidos
  - Ticket Médio
  - Novos Clientes
- Tabs para diferentes visualizações:
  - Vendas
  - Produtos Populares
  - Clientes

**Exemplo de Estilo**:
```tsx
// Estilo padrão para selects
<Select value={periodo} onValueChange={setPeriodo}>
  <SelectTrigger className="w-[180px] bg-white">
    <SelectValue placeholder="Período" />
  </SelectTrigger>
  <SelectContent className="bg-white">
    <SelectItem className="bg-white hover:bg-[#fcf8f2]">
      Últimos 7 dias
    </SelectItem>
  </SelectContent>
</Select>
```

### Padrões de UI
**Cores**:
- Fundo principal: `bg-[#fdfaf5]` (cream)
- Cards e elementos: `bg-white`
- Hover em items: `hover:bg-[#fcf8f2]`

**Componentes**:
- Selects sempre com fundo branco sólido
- Botões de ordenação com ícone `ArrowUpDown`
- Cards com sombra suave e bordas arredondadas

## Módulo de Relatórios {#modulo-relatorios}

**Propósito**: Fornece funcionalidades avançadas para geração de relatórios e análise de desempenho do estabelecimento, incluindo relatórios de vendas, produtos mais vendidos, faturamento e estatísticas comparativas.

**Implementação**: 
- Implementado através do serviço `ReportService` em `lib/reportService.ts`
- Utiliza consultas otimizadas ao banco de dados Appwrite para extrair e processar métricas relevantes
- Suporta comparação entre períodos para análise de tendências
- Implementa formatação e agregação de dados para diferentes visualizações (diária, semanal, mensal)

### Relatório de Vendas por Período {#relatorio-vendas}

**Propósito**: Gera um relatório detalhado de vendas em um período específico com opções de agrupamento.

**Implementação**:
- Método `ReportService.generateSalesReport()`
- Funcionalidades:
  - Agrupamento por dia, semana ou mês
  - Cálculo de total de vendas no período
  - Contagem de pedidos e ticket médio
  - Distribuição de vendas por método de pagamento
  - Contagem de pedidos por status

**Exemplo de Uso**:
```typescript
// Gerar relatório de vendas dos últimos 30 dias
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);
const endDate = new Date();

const salesReport = await ReportService.generateSalesReport(
  'establishmentId123',
  startDate.toISOString(),
  endDate.toISOString(),
  'day' // Agrupamento diário
);

console.log(`Total de vendas: R$ ${salesReport.totalSales}`);
console.log(`Quantidade de pedidos: ${salesReport.orderCount}`);
console.log(`Ticket médio: R$ ${salesReport.averageTicket}`);
```

**Tratamento de Erros**:
- Validação de parâmetros de data
- Tratamento de erros de consulta ao banco de dados
- Resposta estruturada em caso de falha

### Produtos Mais Vendidos {#produtos-mais-vendidos}

**Propósito**: Identifica e analisa os produtos com maior volume de vendas em um período específico.

**Implementação**:
- Método `ReportService.listTopProducts()`
- Funcionalidades:
  - Listagem de produtos ordenados por quantidade vendida
  - Cálculo de receita gerada por cada produto
  - Opção para limitar a quantidade de produtos retornados
  - Exclusão automática de pedidos cancelados da análise

**Exemplo de Uso**:
```typescript
// Listar os 5 produtos mais vendidos do mês atual
const startDate = new Date();
startDate.setDate(1); // Primeiro dia do mês
const endDate = new Date();

const topProducts = await ReportService.listTopProducts(
  'establishmentId123',
  startDate.toISOString(),
  endDate.toISOString(),
  5 // Limitar aos 5 mais vendidos
);

console.log(`Total de produtos vendidos: ${topProducts.totalQuantity}`);
console.log(`Receita total: R$ ${topProducts.totalRevenue}`);

// Listar os produtos
topProducts.products.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}: ${product.quantity} unidades - R$ ${product.revenue}`);
});
```

**Validações**:
- Verificação da existência do estabelecimento
- Validação de datas (início e fim)
- Limite de produtos deve ser um número positivo

### Faturamento por Período {#faturamento-periodo}

**Propósito**: Calcula e analisa o faturamento em um período específico, com comparação opcional com período anterior.

**Implementação**:
- Método `ReportService.calculateRevenue()`
- Funcionalidades:
  - Cálculo de faturamento total no período selecionado
  - Distribuição de faturamento por data, dia da semana e mês
  - Comparação automática com período anterior de mesma duração
  - Cálculo de percentual de crescimento ou queda
  - Indicação de tendência (crescimento, queda ou estabilidade)

**Exemplo de Uso**:
```typescript
// Calcular faturamento do último trimestre com comparação
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 3);
const endDate = new Date();

const revenueReport = await ReportService.calculateRevenue(
  'establishmentId123',
  startDate.toISOString(),
  endDate.toISOString(),
  true // Comparar com período anterior
);

console.log(`Faturamento total: R$ ${revenueReport.total}`);
console.log(`Crescimento: ${revenueReport.growth.percentageFromPreviousPeriod.toFixed(2)}%`);
console.log(`Tendência: ${revenueReport.growth.trend}`);

// Analisar vendas por dia da semana
Object.entries(revenueReport.byWeekday).forEach(([day, value]) => {
  console.log(`${day}: R$ ${value}`);
});
```

### Cálculo de Ticket Médio {#calculo-ticket-medio}

**Propósito**: Calcula o valor médio dos pedidos em um período específico e compara com o período anterior.

**Implementação**:
- Método `ReportService.calculateAverageTicket()`
- Funcionalidades:
  - Cálculo preciso do ticket médio no período atual
  - Cálculo do ticket médio no período anterior de mesma duração
  - Análise de variação percentual
  - Indicação de tendência (aumento, diminuição ou estabilidade)

**Exemplo de Uso**:
```typescript
// Calcular o ticket médio dos últimos 7 dias
const startDate = new Date();
startDate.setDate(startDate.getDate() - 7);
const endDate = new Date();

const ticketReport = await ReportService.calculateAverageTicket(
  'establishmentId123',
  startDate.toISOString(),
  endDate.toISOString()
);

console.log(`Ticket médio atual: R$ ${ticketReport.currentPeriod.toFixed(2)}`);
console.log(`Ticket médio anterior: R$ ${ticketReport.previousPeriod.toFixed(2)}`);
console.log(`Variação: ${ticketReport.percentageChange.toFixed(2)}%`);
console.log(`Tendência: ${ticketReport.trend}`);
```

### Estatísticas de Desempenho {#estatisticas-desempenho}

**Propósito**: Gera um conjunto completo de estatísticas de desempenho para diferentes períodos (diário, semanal, mensal ou anual).

**Implementação**:
- Método `ReportService.generatePerformanceStats()`
- Funcionalidades:
  - Análise completa de faturamento, pedidos e ticket médio
  - Identificação dos 5 produtos mais vendidos no período
  - Distribuição de vendas por dia da semana
  - Comparação automática com o período equivalente anterior
  - Cálculo de variações percentuais para todas as métricas

**Exemplo de Uso**:
```typescript
// Gerar estatísticas de desempenho mensal
const stats = await ReportService.generatePerformanceStats(
  'establishmentId123',
  'monthly', // Análise mensal (outras opções: daily, weekly, yearly)
  true // Comparar com período anterior
);

console.log('=== FATURAMENTO ===');
console.log(`Atual: R$ ${stats.revenue.current}`);
console.log(`Anterior: R$ ${stats.revenue.previous}`);
console.log(`Variação: ${stats.revenue.percentageChange.toFixed(2)}%`);

console.log('=== PEDIDOS ===');
console.log(`Atual: ${stats.orders.current}`);
console.log(`Anterior: ${stats.orders.previous}`);
console.log(`Variação: ${stats.orders.percentageChange.toFixed(2)}%`);

console.log('=== TICKET MÉDIO ===');
console.log(`Atual: R$ ${stats.averageTicket.current.toFixed(2)}`);
console.log(`Anterior: R$ ${stats.averageTicket.previous.toFixed(2)}`);
console.log(`Variação: ${stats.averageTicket.percentageChange.toFixed(2)}%`);

console.log('=== TOP 5 PRODUTOS ===');
stats.topProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}: ${product.quantity} unidades - R$ ${product.revenue}`);
});
```

**Validações**:
- Validação do ID do estabelecimento
- Verificação do tipo de período (daily, weekly, monthly, yearly)
- Tratamento adequado para períodos sem dados anteriores

### Interfaces e Tipos {#relatorios-interfaces}

O módulo define tipos TypeScript claros para todas as respostas:

**SalesReport**: Relatório de vendas por período
```typescript
interface SalesReport {
  totalSales: number;
  orderCount: number;
  averageTicket: number;
  salesByDate: Record<string, number>;
  salesByPaymentMethod: Record<string, number>;
  salesByStatus: Record<string, number>;
}
```

**TopProductsReport**: Relatório de produtos mais vendidos
```typescript
interface TopProductsReport {
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  totalQuantity: number;
  totalRevenue: number;
}
```

**RevenueReport**: Relatório de faturamento por período
```typescript
interface RevenueReport {
  total: number;
  byDate: Record<string, number>;
  byWeekday: Record<string, number>;
  byMonth: Record<string, number>;
  growth: {
    percentageFromPreviousPeriod: number;
    trend: 'up' | 'down' | 'stable';
  };
}
```

### Considerações de Desempenho {#relatorios-desempenho}

O módulo foi projetado considerando as melhores práticas para otimização de desempenho:

- Uso de queries otimizadas ao banco de dados Appwrite
- Processamento em lote para grandes volumes de dados
- Exclusão automática de pedidos cancelados das análises
- Reutilização de cálculos intermediários para reduzir processamento redundante
- Implementação de limite alto (100.000) para garantir a recuperação de todos os dados relevantes

### Tratamento de Erros {#relatorios-tratamento-erros}

O módulo implementa tratamento robusto de erros:

- Validação de parâmetros antes da execução
- Captura e log adequado de exceções
- Mensagens de erro descritivas para facilitar a depuração
- Fallbacks seguros para casos onde dados anteriores não estão disponíveis

O módulo de Relatórios fornece uma base sólida para análise de dados e tomada de decisões baseada em métricas reais, permitindo que os estabelecimentos compreendam melhor seu desempenho e identifiquem oportunidades de melhoria.

## Módulo de Planos de Assinatura {#modulo-planos}

**Propósito**: Implementa um sistema de planos de assinatura que define diferentes níveis de acesso e limitações para os estabelecimentos, permitindo que o sistema tenha diferentes tiers de serviço (Básico, Profissional e Premium).

**Implementação**: 
- Desenvolvido usando Appwrite Database para armazenar planos e assinaturas
- Implementado com APIs RESTful para gerenciar assinaturas
- Sistema de verificação de acesso a recursos baseado no plano
- Middleware para limitar acesso a recursos não disponíveis no plano atual
- Hook React para uso no frontend

### Planos Disponíveis {#planos-disponiveis}

O sistema oferece três planos de assinatura com diferentes recursos e limitações:

#### Plano Básico

**Propósito**: Fornece funcionalidades essenciais para estabelecimentos pequenos que estão começando.

**Implementação**:
- ID: `basic_plan`
- Preço: R$ 49,90/mês ou R$ 479,90/ano
- Recursos incluídos:
  - Cardápio digital personalizado
  - Gerenciamento de pedidos
  - Até 50 produtos cadastrados
  - Relatórios básicos
  - Suporte por e-mail

#### Plano Profissional

**Propósito**: Oferece mais recursos para estabelecimentos em crescimento que precisam de funcionalidades avançadas.

**Implementação**:
- ID: `professional_plan`
- Preço: R$ 89,90/mês ou R$ 863,90/ano
- Recursos incluídos:
  - Todos os recursos do plano Básico
  - Até 150 produtos cadastrados
  - Gestão de múltiplos estabelecimentos
  - Sistema de delivery integrado
  - Relatórios avançados
  - Suporte prioritário
  - Integração com sistemas de pagamento

#### Plano Premium

**Propósito**: Fornece solução completa para grandes estabelecimentos com necessidades avançadas.

**Implementação**:
- ID: `premium_plan`
- Preço: R$ 149,90/mês ou R$ 1439,90/ano
- Recursos incluídos:
  - Todos os recursos do plano Profissional
  - Produtos ilimitados
  - API para integrações personalizadas
  - Relatórios detalhados e exportáveis
  - Suporte dedicado 24/7
  - Personalização completa da marca
  - Gerenciamento de fidelidade
  - Análise avançada de dados de clientes

### Recursos por Plano {#recursos-plano}

Os recursos são restringidos conforme o plano de assinatura do estabelecimento. A tabela abaixo mostra os principais recursos e suas disponibilidades:

| Recurso | Básico | Profissional | Premium |
|---------|:------:|:------------:|:-------:|
| Cardápio digital | ✅ | ✅ | ✅ |
| Gestão de pedidos | ✅ | ✅ | ✅ |
| Limite de produtos | 50 | 150 | Ilimitado |
| Relatórios básicos | ✅ | ✅ | ✅ |
| Relatórios avançados | ❌ | ✅ | ✅ |
| Múltiplos estabelecimentos | ❌ | ✅ | ✅ |
| Sistema de delivery | ❌ | ✅ | ✅ |
| Análise avançada de dados | ❌ | ❌ | ✅ |
| Integração com sistemas de pagamento | ❌ | ✅ | ✅ |
| Personalização completa | ❌ | ❌ | ✅ |
| Suporte prioritário | ❌ | ✅ | ✅ |
| Suporte 24/7 | ❌ | ❌ | ✅ |

### Serviço de Assinaturas {#servico-assinaturas}

**Propósito**: Gerencia os planos de assinatura e verifica se os estabelecimentos têm acesso às funcionalidades.

**Implementação**:
- Localizado em `lib/subscriptionService.ts`
- Fornece métodos para:
  - Listar planos disponíveis
  - Obter detalhes de um plano específico
  - Gerenciar assinaturas de estabelecimentos
  - Verificar acesso a recursos com base no plano
  - Verificar limites de produtos com base no plano

**Principais interfaces**:

```typescript
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PENDING = 'pending'
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  order: number;
  isActive: boolean;
  isFeatured: boolean;
}

export interface EstablishmentSubscription {
  id: string;
  establishmentId: string;
  planId: string;
  plan?: SubscriptionPlan;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
}
```

**Métodos principais**:

- `listAvailablePlans`: Lista todos os planos ativos disponíveis.
- `getPlanById`: Obtém detalhes de um plano específico pelo ID.
- `getEstablishmentSubscription`: Obtém a assinatura atual de um estabelecimento.
- `updateEstablishmentSubscription`: Cria ou atualiza uma assinatura para um estabelecimento.
- `cancelSubscription`: Cancela a assinatura de um estabelecimento.
- `hasFeatureAccess`: Verifica se um estabelecimento tem acesso a um recurso específico.
- `getMaxProductCount`: Obtém o número máximo de produtos que um estabelecimento pode cadastrar.

### Middleware de Proteção {#middleware-protecao}

**Propósito**: Controla o acesso a recursos baseado no plano atual do estabelecimento.

**Implementação**:
- Localizado em `middleware/featureGuard.ts`
- Fornece dois middlewares principais:
  - `featureGuard`: Verifica se o estabelecimento tem acesso a um recurso específico
  - `productLimitGuard`: Verifica se o estabelecimento atingiu o limite de produtos

**Exemplo de uso do Middleware de Proteção**:

```typescript
// Em uma rota Next.js
import { featureGuard } from '@/middleware/featureGuard';

export default async function ProtectedRoute(req: NextRequest) {
  // Verificar acesso ao recurso "Relatórios avançados"
  const response = await featureGuard(req, 'Relatórios avançados');
  
  // Se o middleware retornou uma resposta, significa que o acesso foi negado
  if (response) {
    return response; // Redireciona para a página de planos
  }
  
  // Continuar o fluxo normalmente se tiver acesso
  // ...
}
```

### Hook React de Assinaturas {#hook-assinaturas}

**Propósito**: Fornece uma interface fácil para interagir com a API de assinaturas no frontend.

**Implementação**:
- Localizado em `hooks/useSubscription.ts`
- Utiliza React Hooks para gerenciar estado e efeitos
- Fornece métodos para:
  - Carregar planos disponíveis
  - Carregar assinatura atual
  - Atualizar assinatura
  - Cancelar assinatura
  - Verificar acesso a recursos
  - Verificar limites de produtos

**Exemplo de uso do Hook de Assinaturas**:

```tsx
import { useSubscription } from '@/hooks/useSubscription';
import { BillingCycle } from '@/lib/subscriptionService';

function PlanosPage() {
  const { 
    plans, 
    subscription, 
    isLoading, 
    error, 
    updateSubscription 
  } = useSubscription();

  const handleSelectPlan = async (planId: string) => {
    try {
      await updateSubscription(planId, BillingCycle.MONTHLY);
      alert('Plano atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar plano:', err);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h1>Nossos Planos</h1>
      {plans.map(plan => (
        <div key={plan.id}>
          <h2>{plan.name}</h2>
          <p>{plan.description}</p>
          <p>Preço: R$ {plan.priceMonthly.toFixed(2)}/mês</p>
          <button onClick={() => handleSelectPlan(plan.id)}>
            {subscription?.planId === plan.id ? 'Plano Atual' : 'Selecionar Plano'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Interfaces e Tipos {#planos-interfaces}

O módulo define várias interfaces e tipos para garantir segurança e consistência de tipos:

- `SubscriptionStatus`: Enum que define os possíveis status de uma assinatura (ativo, trial, cancelado, expirado, pendente).
- `BillingCycle`: Enum que define os ciclos de faturamento disponíveis (mensal, anual).
- `SubscriptionPlan`: Interface que define a estrutura de um plano de assinatura.
- `EstablishmentSubscription`: Interface que define a estrutura de uma assinatura de estabelecimento.

### Tratamento de Erros {#planos-tratamento-erros}

O módulo implementa tratamento robusto de erros em vários níveis:

1. **API Endpoints**:
   - Validação de parâmetros de entrada
   - Respostas de erro com códigos HTTP apropriados
   - Mensagens descritivas para facilitar o debugging

2. **Serviço de Assinatura**:
   - Try/catch em todas as operações de banco de dados
   - Fallbacks para valores padrão em caso de erro
   - Logs detalhados com informações relevantes

3. **Hook React**:
   - Tratamento de erros em todas as chamadas de API
   - Estado de erro exposto para componentes consumidores
   - Retry automático para algumas operações

## API do Módulo de Planos de Assinatura {#api-planos}

### Listar Planos Disponíveis {#api-listar-planos}

```
GET /api/subscription/plans
```

**Propósito**: Retorna todos os planos de assinatura ativos disponíveis.

**Implementação**:
- Localizado em `app/api/subscription/plans/route.ts`
- Não requer autenticação
- Usa o SubscriptionService para buscar planos ativos
- Ordenados por ordem de exibição

**Resposta de Sucesso (200 OK)**:

```json
{
  "plans": [
    {
      "id": "basic_plan",
      "name": "Básico",
      "description": "Ideal para pequenos estabelecimentos que estão começando.",
      "priceMonthly": 49.9,
      "priceYearly": 479.9,
      "features": [
        "Cardápio digital personalizado",
        "Gerenciamento de pedidos",
        "Até 50 produtos cadastrados",
        "Relatórios básicos",
        "Suporte por e-mail"
      ],
      "order": 1,
      "isActive": true,
      "isFeatured": false
    },
    // Outros planos...
  ]
}
```

**Resposta de Erro (500 Internal Server Error)**:

```json
{
  "error": "Erro ao listar planos de assinatura"
}
```

### Obter Detalhes de um Plano {#api-detalhes-plano}

```
GET /api/subscription/plans/:id
```

**Propósito**: Retorna detalhes de um plano específico.

**Implementação**:
- Localizado em `app/api/subscription/plans/[id]/route.ts`
- Não requer autenticação
- Usa o SubscriptionService para buscar um plano específico pelo ID

**Parâmetros de URL**:
- `id`: ID do plano (ex: basic_plan, professional_plan, premium_plan)

**Resposta de Sucesso (200 OK)**:

```json
{
  "plan": {
    "id": "professional_plan",
    "name": "Profissional",
    "description": "Perfeito para restaurantes em crescimento que precisam de mais recursos.",
    "priceMonthly": 89.9,
    "priceYearly": 863.9,
    "features": [
      "Todos os recursos do plano Básico",
      "Até 150 produtos cadastrados",
      "Gestão de múltiplos estabelecimentos",
      "Sistema de delivery integrado",
      "Relatórios avançados",
      "Suporte prioritário",
      "Integração com sistemas de pagamento"
    ],
    "order": 2,
    "isActive": true,
    "isFeatured": true
  }
}
```

**Resposta de Erro (404 Not Found)**:

```json
{
  "error": "Plano não encontrado"
}
```

### Obter Assinatura de Estabelecimento {#api-assinatura-estabelecimento}

```
GET /api/establishment/:identifier/subscription
```

**Propósito**: Retorna a assinatura atual de um estabelecimento.

**Implementação**:
- Localizado em `app/api/establishment/[identifier]/subscription/route.ts`
- Requer autenticação do estabelecimento
- Usa o SubscriptionService para buscar a assinatura atual

**Parâmetros de URL**:
- `identifier`: ID do estabelecimento

**Resposta de Sucesso (200 OK)**:

```json
{
  "subscription": {
    "id": "sub_123456",
    "establishmentId": "est_123456",
    "planId": "professional_plan",
    "startDate": "2024-07-01T12:00:00.000Z",
    "endDate": "2024-08-01T12:00:00.000Z",
    "status": "active",
    "billingCycle": "monthly",
    "plan": {
      "id": "professional_plan",
      "name": "Profissional",
      // Outros detalhes do plano...
    }
  }
}
```

**Resposta de Erro (404 Not Found)**:

```json
{
  "message": "Nenhuma assinatura encontrada para este estabelecimento"
}
```

### Atualizar Assinatura {#api-atualizar-assinatura}

```
POST /api/establishment/:identifier/subscription/update
```

**Propósito**: Cria ou atualiza a assinatura de um estabelecimento.

**Implementação**:
- Localizado em `app/api/establishment/[identifier]/subscription/update/route.ts`
- Requer autenticação do estabelecimento
- Usa o SubscriptionService para criar ou atualizar a assinatura

**Parâmetros de URL**:
- `identifier`: ID do estabelecimento

**Corpo da Requisição**:

```json
{
  "planId": "professional_plan",
  "billingCycle": "monthly"
}
```

**Resposta de Sucesso (200 OK)**:

```json
{
  "subscription": {
    "id": "sub_123456",
    "establishmentId": "est_123456",
    "planId": "professional_plan",
    "startDate": "2024-07-01T12:00:00.000Z",
    "endDate": "2024-08-01T12:00:00.000Z",
    "status": "active",
    "billingCycle": "monthly",
    "plan": {
      "id": "professional_plan",
      "name": "Profissional",
      // Outros detalhes do plano...
    }
  }
}
```

**Resposta de Erro (400 Bad Request)**:

```json
{
  "error": "ID do plano e ciclo de faturamento são obrigatórios"
}
```

### Cancelar Assinatura {#api-cancelar-assinatura}

```
POST /api/establishment/:identifier/subscription/cancel
```

**Propósito**: Cancela a assinatura atual de um estabelecimento.

**Implementação**:
- Localizado em `app/api/establishment/[identifier]/subscription/cancel/route.ts`
- Requer autenticação do estabelecimento
- Usa o SubscriptionService para cancelar a assinatura

**Parâmetros de URL**:
- `identifier`: ID do estabelecimento

**Resposta de Sucesso (200 OK)**:

```json
{
  "message": "Assinatura cancelada com sucesso",
  "subscription": {
    "id": "sub_123456",
    "establishmentId": "est_123456",
    "planId": "professional_plan",
    "startDate": "2024-07-01T12:00:00.000Z",
    "endDate": "2024-08-01T12:00:00.000Z",
    "status": "canceled",
    "billingCycle": "monthly"
  }
}
```

**Resposta de Erro (404 Not Found)**:

```json
{
  "message": "Nenhuma assinatura encontrada para este estabelecimento"
}
```

### Verificar Acesso a Recursos {#api-verificar-acesso}

```
POST /api/establishment/:identifier/check-feature
```

**Propósito**: Verifica se um estabelecimento tem acesso a um recurso específico baseado em seu plano.

**Implementação**:
- Localizado em `app/api/establishment/[identifier]/check-feature/route.ts`
- Requer autenticação do estabelecimento
- Usa o SubscriptionService para verificar acesso ao recurso

**Parâmetros de URL**:
- `identifier`: ID do estabelecimento

**Corpo da Requisição**:

```json
{
  "featureName": "Relatórios avançados"
}
```

**Resposta de Sucesso (200 OK)**:

```json
{
  "hasAccess": true,
  "feature": "Relatórios avançados"
}
```

**Resposta de Erro (400 Bad Request)**:

```json
{
  "error": "Nome do recurso não fornecido"
}
```

### Verificar Limites de Produtos {#api-verificar-limites}

```
GET /api/establishment/:identifier/product-limit
```

**Propósito**: Verifica o limite de produtos disponíveis para um estabelecimento baseado em seu plano.

**Implementação**:
- Localizado em `app/api/establishment/[identifier]/product-limit/route.ts`
- Requer autenticação do estabelecimento
- Usa o SubscriptionService para verificar o limite de produtos

**Parâmetros de URL**:
- `identifier`: ID do estabelecimento

**Resposta de Sucesso (200 OK)**:

```json
{
  "maxProducts": 150,
  "currentProductCount": 45,
  "remainingProducts": 105,
  "canAddMore": true
}
```

**Resposta de Erro (500 Internal Server Error)**:

```json
{
  "error": "Erro ao verificar limite de produtos"
}
```

## Segurança e Otimização {#seguranca-otimizacao}

### Validação de Dados {#validacao-dados}

**Propósito**: Garantir a integridade e validade dos dados recebidos pelo backend.

**Implementação**: 
- Usa biblioteca `zod` para definir esquemas de validação
- Middleware `withValidation` localizado em `middleware/withValidation.ts`
- Retorna mensagens de erro detalhadas para o cliente

**Exemplo de Uso**:
```typescript
import { z } from 'zod';
import { withValidation } from '@/middleware/withValidation';

// Definir esquema de validação
const produtoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  preco: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
  categoriaId: z.string().uuid('ID de categoria inválido'),
  estabelecimentoId: z.string().uuid('ID de estabelecimento inválido')
});

// Handler da rota
async function criarProdutoHandler(req: NextRequest, data: z.infer<typeof produtoSchema>) {
  // Dados já validados
  const { nome, preco, categoriaId, estabelecimentoId } = data;
  // Implementação...
}

// Aplicar middleware à rota
export const POST = withValidation(produtoSchema, criarProdutoHandler);
```

### Permissões Multi-tenant {#permissoes-multi-tenant}

**Propósito**: Garantir que cada usuário acesse apenas seus próprios dados, implementando uma separação segura entre os dados de diferentes estabelecimentos.

**Implementação**:
- Middleware `withMultiTenantAuth` localizado em `middleware/withMultiTenantAuth.ts`
- Verifica se o usuário tem permissão para acessar o recurso solicitado
- Suporta diferentes tipos de recursos (estabelecimento, menu, pedido, cliente)

**Exemplo de Uso**:
```typescript
import { withMultiTenantAuth } from '@/middleware/withMultiTenantAuth';

// Handler da rota
async function obterDetalhesEstabelecimentoHandler(req: NextRequest) {
  // A verificação de permissão já foi realizada
  const { id } = req.params;
  // Implementação...
}

// Aplicar middleware à rota
export const GET = withMultiTenantAuth(
  'establishment', // Tipo de recurso
  'id',            // Nome do parâmetro que contém o ID do recurso
  obterDetalhesEstabelecimentoHandler
);
```

### Cache {#cache}

**Propósito**: Otimizar o desempenho do aplicativo, reduzindo a carga no banco de dados para consultas frequentes.

**Implementação**:
- Serviço `CacheService` localizado em `lib/cacheService.ts`
- Cache em memória com TTL (Time To Live) configurável
- Suporte para invalidação de cache por prefixo de chave

**Exemplo de Uso**:
```typescript
import { CacheService } from '@/lib/cacheService';

// Buscar produtos com cache
export async function listarProdutosPorCategoria(categoriaId: string) {
  const cacheKey = `categoria:${categoriaId}:produtos`;
  
  return await CacheService.getOrSet(
    cacheKey,
    async () => {
      // Esta função só é executada se os dados não estiverem no cache
      const produtos = await databases.listDocuments(
        'kratodeliv_db',
        'products',
        [Query.equal('categoryId', categoriaId)]
      );
      return produtos.documents;
    },
    300 // TTL de 5 minutos
  );
}

// Invalidar cache ao atualizar um produto
export async function atualizarProduto(produtoId: string, dados: any) {
  const produto = await databases.updateDocument(
    'kratodeliv_db',
    'products',
    produtoId,
    dados
  );
  
  // Invalidar caches relacionados
  CacheService.delete(`produto:${produtoId}`);
  CacheService.invalidateByPrefix(`categoria:${produto.categoryId}`);
  
  return produto;
}
```

### Sistema de Logs {#sistema-logs}

**Propósito**: Registrar operações críticas, erros e atividades importantes para monitoramento, depuração e auditoria.

**Implementação**:
- Serviço `LoggingService` localizado em `lib/loggingService.ts`
- Suporta diferentes níveis de log (INFO, WARNING, ERROR, CRITICAL)
- Registra logs no console e persiste no Appwrite Database
- Configurável por ambiente (produção, desenvolvimento, teste)

**Exemplo de Uso**:
```typescript
import { LoggingService, ActivityType } from '@/lib/loggingService';

// Registrar login bem-sucedido
await LoggingService.info(
  ActivityType.AUTH,
  `Login bem-sucedido: ${usuario.email}`,
  {
    userId: usuario.id,
    ip: request.headers.get('x-forwarded-for') || undefined,
    userAgent: request.headers.get('user-agent') || undefined
  }
);

// Registrar erro crítico
try {
  // Alguma operação crítica
} catch (error) {
  await LoggingService.critical(
    ActivityType.PAYMENT,
    'Falha no processamento de pagamento',
    {
      resourceId: pagamento.id,
      establishmentId: estabelecimento.id,
      metadata: {
        error: error.message,
        paymentMethod: pagamento.metodo,
        amount: pagamento.valor
      }
    }
  );
  throw error;
}
```

### Rate Limiting {#rate-limiting}

**Propósito**: Proteger o sistema contra abusos, limitando o número de requisições por IP, usuário ou endpoint específico.

**Implementação**:
- Middleware `withRateLimit` localizado em `middleware/rateLimiter.ts`
- Implementação em memória (para ambiente com servidor único)
- Suporta diferentes tipos de limitação (por IP, por usuário, por endpoint)
- Integrado com o sistema de logs para registrar abusos

**Configurações**:
- API pública: 100 requisições por minuto por IP
- API autenticada: 300 requisições por minuto por usuário
- Rotas sensíveis (login, pagamento): 5-10 requisições por minuto

**Exemplo de Uso**:
```typescript
import { withRateLimit } from '@/middleware/rateLimiter';

// Aplicar rate limiting à rota de login
export const POST = withRateLimit(
  loginHandler,
  {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minuto
    type: 'ip',
    endpoint: 'auth/login',
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
  }
);

// Aplicar rate limiting à API de listagem de produtos (mais permissiva)
export const GET = withRateLimit(
  listarProdutosHandler,
  {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minuto
    type: 'ip'
  }
);
```

### Considerações de Segurança

- Todas as senhas são armazenadas usando o sistema de hashing do Appwrite
- Dados sensíveis nunca são expostos via API
- As permissões do Appwrite são configuradas para garantir que cada usuário acesse apenas seus próprios dados
- Todas as rotas administrativas verificam a autenticação e as permissões do usuário
- Logs de segurança são mantidos para operações críticas
- O rate limiting protege contra ataques de força bruta e DDoS

### Melhores Práticas Implementadas

1. **Validação de Entradas**
   - Todas as entradas de usuário são validadas antes do processamento
   - Esquemas Zod garantem a integridade dos dados

2. **Sanitização de Dados**
   - Dados de entrada são sanitizados para evitar injeção de SQL e XSS
   - Dados sensíveis são filtrados dos logs

3. **Proteção contra Ataques Comuns**
   - Proteção contra CSRF implementada através de tokens
   - Proteção contra ataques de força bruta através de rate limiting
   - Cabeçalhos de segurança configurados para proteção adicional

4. **Otimização de Desempenho**
   - Cache implementado para consultas frequentes