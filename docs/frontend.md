# Frontend do Cardápio Digital Krato

## Estrutura do Frontend <a id="estrutura"></a>

A estrutura do frontend foi desenvolvida com base no Next.js 14 e seu sistema de App Router, que proporciona uma organização clara e intuitiva dos componentes e páginas.

```
app/
├── (client)/ 
│   ├── cart/ 
│   ├── menu/ 
│   │   └── [category]/
│   ├── order-status/
│   └── page.tsx
├── (admin)/
│   ├── dashboard/
│   ├── menu/
│   ├── orders/
│   └── users/
├── api/
│   ├── menu/
│   ├── orders/
│   └── auth/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── cards/
│   └── forms/
├── hooks/
│   ├── useCart.ts
│   ├── useMenu.ts
│   └── useOrders.ts
├── lib/
│   ├── utils.ts
│   ├── formatters.ts
│   └── validation.ts
├── styles/
│   └── globals.css
└── types/
    ├── menu.d.ts
    ├── order.d.ts
    └── user.d.ts
```

## Componentes <a id="componentes"></a>

### Componentes Reutilizáveis

Os componentes são organizados por função e reutilizáveis em toda a aplicação:

#### UI Base (components/ui/)
- **Button**: Componente de botão personalizável com diversas variantes
- **Card**: Cartão para exibição de informações
- **Dialog**: Modal para interações específicas
- **Input**: Campo de entrada de texto
- **Select**: Componente de seleção dropdown
- **Badge**: Badges para marcação de status e categorias

#### Formulários (components/forms/)
- **MenuItemForm**: Formulário para criação/edição de itens
- **OrderForm**: Formulário para conclusão de pedidos
- **SearchForm**: Componente de busca

#### Cards (components/cards/)
- **MenuCard**: Exibe um item do cardápio com imagem, título, descrição e preço
- **CategoryCard**: Exibe uma categoria com imagem e título
- **OrderCard**: Exibe resumo de um pedido

#### Layout (components/layout/)
- **Navbar**: Barra de navegação principal
- **Footer**: Rodapé da aplicação
- **Sidebar**: Barra lateral para navegação administrativa
- **Container**: Componente para contenção e alinhamento
- **Grid**: Sistema de grade para layout responsivo

## Páginas <a id="paginas"></a>

### Páginas do Cliente

#### Home (/)
Página inicial com destaques do cardápio e categorias principais.

#### Menu (/menu)
Exibe o cardápio completo, com filtros por categoria e busca.

#### Categoria (/menu/[category])
Exibe itens de uma categoria específica.

#### Carrinho (/cart)
Visualização do carrinho de compras, com opção de alterar quantidades e finalizar pedido.

#### Status do Pedido (/order-status)
Acompanhamento em tempo real do status do pedido.

### Páginas Administrativas

#### Dashboard (/admin)
Resumo geral do estabelecimento, com métricas e gráficos.

#### Gerenciamento de Menu (/admin/menu)
Interface para adicionar, editar e remover itens do cardápio.

#### Pedidos (/admin/orders)
Visualização e gerenciamento de pedidos, com opção de alterar status.

#### Usuários (/admin/users)
Gerenciamento de usuários e permissões.

## Hooks Personalizados <a id="hooks"></a>

Os hooks personalizados encapsulam lógicas complexas e são reutilizáveis:

### useCart
Gerencia o estado do carrinho de compras:
- Adicionar item
- Remover item
- Atualizar quantidade
- Calcular total
- Finalizar pedido

### useMenu
Gerencia os dados do cardápio:
- Carregar itens
- Filtrar por categoria
- Buscar por nome
- Ordenar por preço/popularidade

### useOrders
Gerencia os pedidos:
- Listar pedidos
- Filtrar por status
- Atualizar status
- Calcular tempo médio

## Responsividade <a id="responsividade"></a>

O design responsivo é implementado usando:
- Tailwind CSS breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`)
- Grid layout e Flexbox
- Componentes adaptáveis a diferentes tamanhos de tela
- Navegação específica para mobile

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Estado Global <a id="estado-global"></a>

O estado global é gerenciado utilizando:
- Context API para estados compartilhados (ex: carrinho, autenticação)
- Hooks personalizados para lógica de negócio
- Local storage para persistência entre sessões

## Comunicação com API <a id="api"></a>

A comunicação com o backend é feita através de:
- Route Handlers do Next.js
- Server Components para dados estáticos/cacheavéis
- Client Components para interatividade

## Performance <a id="performance"></a>

Estratégias para otimização de performance:

### Carregamento de Imagens
- Componente `Image` do Next.js para otimização automática
- Lazy loading para carregar sob demanda
- Formatos modernos (WebP/AVIF)

### Renderização
- Server Components quando possível
- Streaming para carregamento progressivo
- Suspense para melhor UX durante carregamento

### Dados
- SWR para cache e revalidação
- Pré-carregamento de rotas mais acessadas
- Prefetch de dados para navegação antecipada

## Acessibilidade <a id="acessibilidade"></a>

A aplicação segue as diretrizes WCAG:
- Uso correto de elementos semânticos
- Labels apropriadas para formulários
- Suporte a navegação por teclado
- Contraste adequado
- Mensagens de erro claras e acessíveis

## Temas <a id="temas"></a>

O sistema de temas utiliza:
- Variáveis CSS para cores e espaçamentos
- Sistema claro/escuro via Tailwind
- Suporte a temas personalizados para diferentes estabelecimentos 