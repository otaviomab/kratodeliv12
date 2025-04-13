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

## Rotas de API {#rotas-api}

### API de Menu

**Propósito**: Fornece acesso ao cardápio para o frontend do cliente.

**Implementação**:

- Localizada em `app/api/menu/route.ts`
- Endpoints:
  - `GET /api/menu`: Retorna todas as categorias e produtos
  - Suporta filtros por categoria, disponibilidade e termos de busca

### API de Estabelecimento

**Propósito**: Fornece dados sobre o estabelecimento.

**Implementação**:

- Localizada em `app/api/establishment/[slug]/route.ts`
- Endpoints:
  - `GET /api/establishment/[slug]`: Retorna informações do estabelecimento com base no slug

### API de Carrinho

**Propósito**: Gerencia operações relacionadas ao carrinho de compras.

**Implementação**:

- Localizada em `app/api/cart/route.ts`
- Endpoints:
  - `GET /api/cart`: Retorna o conteúdo atual do carrinho
  - `POST /api/cart`: Adiciona um item ao carrinho
  - `PUT /api/cart`: Atualiza a quantidade de um item
  - `DELETE /api/cart`: Remove um item ou limpa o carrinho

### API de Pedidos

**Propósito**: Gerencia operações relacionadas a pedidos.

**Implementação**:

- Localizada em `app/api/orders/route.ts`
- Endpoints:
  - `GET /api/orders`: Retorna pedidos, com opção de filtro por status
  - `POST /api/orders`: Cria um novo pedido

**Atualização de Status**:

- Localizada em `app/api/orders/status/route.ts`
- Endpoints:
  - `PUT /api/orders/status`: Atualiza o status de um pedido existente

# Documentação do Cardápio Digital Krato

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