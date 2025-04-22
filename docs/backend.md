# Backend do Cardápio Digital Krato

## Arquitetura do Backend <a id="arquitetura"></a>

O backend do Cardápio Digital Krato é construído como uma API RESTful utilizando o sistema de API Routes do Next.js 14, proporcionando um desenvolvimento fullstack integrado e eficiente.

```
app/
├── api/
│   ├── menu/
│   │   ├── route.ts             # GET, POST (lista e criação de itens)
│   │   ├── [id]/
│   │   │   └── route.ts         # GET, PUT, DELETE (item específico)
│   │   └── categories/
│   │       └── route.ts         # GET (categorias)
│   ├── orders/
│   │   ├── route.ts             # GET, POST (lista e criação de pedidos)
│   │   ├── [id]/
│   │   │   └── route.ts         # GET, PUT (pedido específico)
│   │   └── status/
│   │       └── route.ts         # PUT (atualização de status)
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts         # POST (autenticação)
│   │   ├── register/
│   │   │   └── route.ts         # POST (registro)
│   │   └── [...nextauth]/
│   │       └── route.ts         # NextAuth.js setup
│   └── webhooks/
│       └── route.ts             # POST (webhooks de pagamento)
└── lib/
    ├── db/
    │   ├── prisma.ts            # Cliente Prisma
    │   └── schema.prisma        # Schema do banco de dados
    ├── middlewares/
    │   ├── auth.ts              # Middleware de autenticação
    │   └── validation.ts        # Middleware de validação
    └── services/
        ├── menu.service.ts      # Serviços do menu
        ├── order.service.ts     # Serviços de pedidos
        └── payment.service.ts   # Serviços de pagamento
```

## Banco de Dados <a id="banco-de-dados"></a>

### Schema

O banco de dados é modelado usando Prisma ORM com o seguinte esquema:

```prisma
// Modelo de Usuário
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  role      Role      @default(USER)
  orders    Order[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// Enum de Roles
enum Role {
  ADMIN
  USER
}

// Modelo de Categoria
model Category {
  id          String      @id @default(cuid())
  name        String
  description String?
  image       String?
  menuItems   MenuItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// Modelo de Item do Menu
model MenuItem {
  id          String      @id @default(cuid())
  name        String
  description String?
  price       Float
  image       String?
  available   Boolean     @default(true)
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

// Modelo de Pedido
model Order {
  id          String      @id @default(cuid())
  userId      String?
  user        User?       @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  total       Float
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  customerName String?
  customerPhone String?
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  table       Int?        // Número da mesa (opcional)
}

// Enum de Status de Pedido
enum OrderStatus {
  PENDING     // Aguardando confirmação
  CONFIRMED   // Confirmado pelo restaurante
  PREPARING   // Em preparação
  READY       // Pronto para entrega/retirada
  DELIVERED   // Entregue
  CANCELED    // Cancelado
}

// Enum de Método de Pagamento
enum PaymentMethod {
  CASH        // Dinheiro
  CARD        // Cartão (no local)
  PIX         // PIX
  ONLINE      // Pagamento online
}

// Enum de Status de Pagamento
enum PaymentStatus {
  PENDING     // Aguardando pagamento
  PAID        // Pago
  FAILED      // Falhou
  REFUNDED    // Reembolsado
}

// Modelo de Item de Pedido
model OrderItem {
  id          String    @id @default(cuid())
  orderId     String
  order       Order     @relation(fields: [orderId], references: [id])
  menuItemId  String
  menuItem    MenuItem  @relation(fields: [menuItemId], references: [id])
  quantity    Int
  unitPrice   Float
  observations String?   // Observações do cliente
}
```

## API Routes <a id="api-routes"></a>

### Menu

#### GET /api/menu
- **Descrição**: Retorna todos os itens do menu.
- **Parâmetros Query**:
  - `category`: Filtra por categoria
  - `available`: Filtra por disponibilidade (true/false)
  - `search`: Pesquisa por nome

#### POST /api/menu
- **Descrição**: Cria um novo item no menu.
- **Autenticação**: Requer token de admin.
- **Body**:
```json
{
  "name": "Item Nome",
  "description": "Descrição do item",
  "price": 19.90,
  "image": "url-da-imagem.jpg",
  "categoryId": "id-da-categoria",
  "available": true
}
```

#### GET /api/menu/[id]
- **Descrição**: Retorna um item específico pelo ID.

#### PUT /api/menu/[id]
- **Descrição**: Atualiza um item específico.
- **Autenticação**: Requer token de admin.

#### DELETE /api/menu/[id]
- **Descrição**: Remove um item do menu.
- **Autenticação**: Requer token de admin.

#### GET /api/menu/categories
- **Descrição**: Retorna todas as categorias.

### Pedidos

#### GET /api/orders
- **Descrição**: Retorna todos os pedidos.
- **Autenticação**: Requer token de usuário ou admin.
- **Parâmetros Query**:
  - `status`: Filtra por status (PENDING, CONFIRMED, etc.)
  - `userId`: Filtra por usuário (apenas admin)

#### POST /api/orders
- **Descrição**: Cria um novo pedido.
- **Body**:
```json
{
  "items": [
    {
      "menuItemId": "id-do-item",
      "quantity": 2,
      "observations": "Sem cebola"
    }
  ],
  "customerName": "Nome do Cliente",
  "customerPhone": "999999999",
  "paymentMethod": "PIX",
  "table": 5
}
```

#### GET /api/orders/[id]
- **Descrição**: Retorna um pedido específico.
- **Autenticação**: Requer token de usuário (próprio pedido) ou admin.

#### PUT /api/orders/[id]
- **Descrição**: Atualiza um pedido específico.
- **Autenticação**: Requer token de admin.

#### PUT /api/orders/status
- **Descrição**: Atualiza o status de um pedido.
- **Autenticação**: Requer token de admin.
- **Body**:
```json
{
  "orderId": "id-do-pedido",
  "status": "CONFIRMED"
}
```

### Autenticação

#### POST /api/auth/login
- **Descrição**: Autentica um usuário.
- **Body**:
```json
{
  "email": "usuario@email.com",
  "password": "senha"
}
```

#### POST /api/auth/register
- **Descrição**: Registra um novo usuário.
- **Body**:
```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha"
}
```

## Middlewares <a id="middlewares"></a>

### Autenticação

O middleware de autenticação verifica tokens JWT e aplica restrições baseadas em papéis (roles).

```typescript
export async function withAuth(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  allowedRoles: Role[] = []
) {
  // Verificação de token e roles
  // ...
  return handler(req);
}
```

### Validação

O middleware de validação usa Zod para garantir a integridade dos dados recebidos.

```typescript
export function withValidation<T>(
  schema: z.Schema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    // Validação dos dados
    // ...
    return handler(req, validData);
  };
}
```

## Serviços <a id="servicos"></a>

### Menu Service

Responsável pela lógica de negócios relacionada ao cardápio.

```typescript
export class MenuService {
  static async getItems(filters: MenuFilters) {
    // Busca itens no banco com filtros
  }
  
  static async createItem(data: MenuItemCreate) {
    // Cria novo item
  }
  
  // Outros métodos...
}
```

### Order Service

Gerencia a lógica de pedidos, incluindo cálculos e validações.

```typescript
export class OrderService {
  static async createOrder(data: OrderCreate) {
    // Validação de itens
    // Cálculo de total
    // Criação do pedido
  }
  
  static async updateStatus(orderId: string, status: OrderStatus) {
    // Atualiza status com validações
  }
  
  // Outros métodos...
}
```

### Payment Service

Integra com gateway de pagamento para processar transações.

```typescript
export class PaymentService {
  static async createPaymentIntent(order: Order) {
    // Integração com gateway de pagamento
  }
  
  static async processWebhook(event: PaymentEvent) {
    // Processa webhooks do gateway
  }
  
  // Outros métodos...
}
```

## Segurança <a id="seguranca"></a>

- **Autenticação**: JWT com refresh tokens
- **Autorização**: RBAC (Role-Based Access Control)
- **Validação**: Schemas Zod para todas as entradas
- **Sanitização**: Prevenção de XSS e SQL Injection
- **Rate Limiting**: Proteção contra abuso de API
- **CORS**: Configurado para permitir apenas domínios autorizados
- **Logs**: Auditoria de ações críticas

## Tratamento de Erros <a id="erros"></a>

A aplicação implementa um sistema consistente de tratamento de erros:

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  
  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Exemplo de uso:
throw new AppError('Item não encontrado', 404, 'ITEM_NOT_FOUND');
```

## Testes <a id="testes"></a>

Os testes são organizados em:

- **Unitários**: Testes de funções e serviços isolados
- **Integração**: Testes de endpoints completos
- **E2E**: Fluxos completos de usuário

Utilizamos Jest e Supertest para execução dos testes.

## Variáveis de Ambiente <a id="env"></a>

```
# Banco de Dados
DATABASE_URL=

# Autenticação
JWT_SECRET=
JWT_EXPIRY=

# Upload de Imagens
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Pagamento
PAYMENT_GATEWAY_API_KEY=
PAYMENT_WEBHOOK_SECRET=
```

## Appwrite Backend <a id="appwrite-backend"></a>

O backend do Cardápio Digital Krato utiliza o Appwrite como BaaS (Backend as a Service), aproveitando seus serviços de autenticação, banco de dados e armazenamento.

### Configuração do Banco de Dados <a id="configuracao-banco"></a>

O banco de dados do sistema está configurado no Appwrite com o ID `kratodeliv_db`.

### Coleções e Estrutura <a id="colecoes-estrutura"></a>

Foram criadas as seguintes coleções no banco de dados:

#### Establishments (Estabelecimentos)
Armazena os dados dos estabelecimentos cadastrados no sistema.

**Atributos principais:**
- `name` (string): Nome do estabelecimento
- `slug` (string): Identificador único para URL
- `description` (string): Descrição do estabelecimento
- `logoUrl` (string): URL da logo
- `coverImageUrl` (string): URL da imagem de capa
- `type` (string): Tipo de estabelecimento
- `phoneNumber` (string): Telefone de contato
- `whatsappNumber` (string): Número de WhatsApp
- `isOpen` (boolean): Status de funcionamento
- `ownerId` (string): ID do proprietário/administrador
- `createdAt` (datetime): Data de criação
- `updatedAt` (datetime): Data de atualização

#### Categories (Categorias)
Armazena as categorias do cardápio digital.

**Atributos principais:**
- `name` (string): Nome da categoria
- `description` (string): Descrição da categoria
- `imageUrl` (string): URL da imagem da categoria
- `displayOrder` (integer): Ordem de exibição
- `establishmentId` (string): ID do estabelecimento
- `createdAt` (datetime): Data de criação
- `updatedAt` (datetime): Data de atualização

#### Products (Produtos)
Armazena os produtos do cardápio.

**Atributos principais:**
- `name` (string): Nome do produto
- `description` (string): Descrição do produto
- `price` (float): Preço do produto
- `imageUrl` (string): URL da imagem do produto
- `isActive` (boolean): Status de disponibilidade
- `isCustomizable` (boolean): Indica se o produto é personalizável
- `categoryId` (string): ID da categoria
- `establishmentId` (string): ID do estabelecimento
- `createdAt` (datetime): Data de criação
- `updatedAt` (datetime): Data de atualização

#### Orders (Pedidos)
Armazena os pedidos realizados.

**Atributos principais:**
- `number` (integer): Número do pedido
- `customerId` (string): ID do cliente (opcional)
- `customerName` (string): Nome do cliente
- `customerPhone` (string): Telefone do cliente
- `establishmentId` (string): ID do estabelecimento
- `status` (string): Status do pedido
- `deliveryType` (enum): Tipo de entrega ("delivery" ou "pickup")
- `deliveryFee` (float): Taxa de entrega
- `subtotal` (float): Subtotal
- `total` (float): Total do pedido
- `paymentMethod` (string): Método de pagamento
- `change` (float): Troco (opcional)
- `notes` (string): Observações
- `createdAt` (datetime): Data de criação
- `updatedAt` (datetime): Data de atualização

#### Customers (Clientes)
Armazena os dados dos clientes.

**Atributos principais:**
- `name` (string): Nome do cliente
- `email` (string, email): Email do cliente
- `phone` (string): Telefone do cliente
- `establishmentId` (string): ID do estabelecimento
- `createdAt` (datetime): Data de criação
- `updatedAt` (datetime): Data de atualização

### Índices e Relacionamentos <a id="indices-relacionamentos"></a>

Foram criados índices para otimizar consultas frequentes:

#### Índices de Establishments:
- `idx_establishment_slug`: Índice para busca por slug
- `idx_establishment_ownerId`: Índice para busca por proprietário

#### Índices de Categories:
- `idx_category_establishmentId`: Índice para busca por estabelecimento

#### Índices de Products:
- `idx_product_categoryId`: Índice para busca por categoria
- `idx_product_establishmentId`: Índice para busca por estabelecimento

#### Índices de Orders:
- `idx_order_establishmentId`: Índice para busca por estabelecimento
- `idx_order_status`: Índice para busca por status

#### Índices de Customers:
- `idx_customer_establishmentId`: Índice para busca por estabelecimento
- `idx_customer_phone`: Índice para busca por telefone 