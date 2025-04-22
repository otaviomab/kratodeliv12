# Referência da API do Cardápio Digital Krato

Este documento descreve em detalhes os endpoints da API REST do Cardápio Digital Krato, incluindo parâmetros, respostas e exemplos de uso.

## Base URL

```
https://api.seu-dominio.com
```

Para desenvolvimento local:

```
http://localhost:3000/api
```

## Autenticação

A API utiliza autenticação JWT. Para endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-token-jwt>
```

## Endpoints

### Menu

#### Listar Itens do Menu

```
GET /api/menu
```

Retorna todos os itens do menu, com opções de filtro.

**Parâmetros Query:**

| Parâmetro  | Tipo    | Descrição                                   |
|------------|---------|---------------------------------------------|
| category   | string  | Filtra por categoria específica             |
| available  | boolean | Filtra por disponibilidade (true/false)     |
| search     | string  | Pesquisa por nome do item                   |
| limit      | number  | Limita o número de resultados               |
| offset     | number  | Define o offset para paginação              |

**Resposta (200 OK):**

```json
{
  "items": [
    {
      "id": "abc123",
      "name": "Hamburger Clássico",
      "description": "Hambúrguer de carne bovina com queijo, alface e tomate",
      "price": 25.90,
      "image": "https://cloudinary.com/...",
      "categoryId": "cat456",
      "available": true,
      "createdAt": "2023-07-15T14:30:00Z",
      "updatedAt": "2023-07-15T14:30:00Z"
    },
    // ...mais itens
  ],
  "meta": {
    "total": 47,
    "limit": 10,
    "offset": 0
  }
}
```

#### Obter Item do Menu por ID

```
GET /api/menu/:id
```

Retorna um item específico do menu pelo ID.

**Resposta (200 OK):**

```json
{
  "id": "abc123",
  "name": "Hamburger Clássico",
  "description": "Hambúrguer de carne bovina com queijo, alface e tomate",
  "price": 25.90,
  "image": "https://cloudinary.com/...",
  "categoryId": "cat456",
  "category": {
    "id": "cat456",
    "name": "Hambúrgueres"
  },
  "available": true,
  "createdAt": "2023-07-15T14:30:00Z",
  "updatedAt": "2023-07-15T14:30:00Z"
}
```

**Resposta (404 Not Found):**

```json
{
  "error": "Item não encontrado",
  "code": "ITEM_NOT_FOUND"
}
```

#### Criar Item do Menu

```
POST /api/menu
```

Cria um novo item no menu.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Body:**

```json
{
  "name": "Pizza Margherita",
  "description": "Pizza com molho de tomate, muçarela e manjericão",
  "price": 45.90,
  "image": "https://cloudinary.com/...",
  "categoryId": "cat789",
  "available": true
}
```

**Resposta (201 Created):**

```json
{
  "id": "xyz789",
  "name": "Pizza Margherita",
  "description": "Pizza com molho de tomate, muçarela e manjericão",
  "price": 45.90,
  "image": "https://cloudinary.com/...",
  "categoryId": "cat789",
  "available": true,
  "createdAt": "2023-07-16T10:15:00Z",
  "updatedAt": "2023-07-16T10:15:00Z"
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Dados inválidos",
  "code": "INVALID_DATA",
  "details": [
    {
      "field": "price",
      "message": "O preço deve ser um número positivo"
    }
  ]
}
```

#### Atualizar Item do Menu

```
PUT /api/menu/:id
```

Atualiza um item existente no menu.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Body:**

```json
{
  "name": "Pizza Margherita Especial",
  "description": "Pizza com molho de tomate italiano, muçarela de búfala e manjericão fresco",
  "price": 49.90,
  "available": true
}
```

**Resposta (200 OK):**

```json
{
  "id": "xyz789",
  "name": "Pizza Margherita Especial",
  "description": "Pizza com molho de tomate italiano, muçarela de búfala e manjericão fresco",
  "price": 49.90,
  "image": "https://cloudinary.com/...",
  "categoryId": "cat789",
  "available": true,
  "createdAt": "2023-07-16T10:15:00Z",
  "updatedAt": "2023-07-16T11:30:00Z"
}
```

#### Excluir Item do Menu

```
DELETE /api/menu/:id
```

Remove um item do menu.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Resposta (204 No Content)**

### Categorias

#### Listar Categorias

```
GET /api/menu/categories
```

Retorna todas as categorias disponíveis.

**Resposta (200 OK):**

```json
{
  "categories": [
    {
      "id": "cat456",
      "name": "Hambúrgueres",
      "description": "Nossos deliciosos hambúrgueres artesanais",
      "image": "https://cloudinary.com/...",
      "createdAt": "2023-06-10T09:00:00Z",
      "updatedAt": "2023-06-10T09:00:00Z"
    },
    {
      "id": "cat789",
      "name": "Pizzas",
      "description": "Pizzas tradicionais e especiais",
      "image": "https://cloudinary.com/...",
      "createdAt": "2023-06-10T09:05:00Z",
      "updatedAt": "2023-06-10T09:05:00Z"
    }
    // ...mais categorias
  ]
}
```

#### Criar Categoria

```
POST /api/menu/categories
```

Cria uma nova categoria.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Body:**

```json
{
  "name": "Sobremesas",
  "description": "Deliciosas sobremesas para finalizar sua refeição",
  "image": "https://cloudinary.com/..."
}
```

**Resposta (201 Created):**

```json
{
  "id": "cat101",
  "name": "Sobremesas",
  "description": "Deliciosas sobremesas para finalizar sua refeição",
  "image": "https://cloudinary.com/...",
  "createdAt": "2023-07-17T13:45:00Z",
  "updatedAt": "2023-07-17T13:45:00Z"
}
```

### Pedidos

#### Listar Pedidos

```
GET /api/orders
```

Retorna todos os pedidos, com filtros opcionais.

**Headers:**

```
Authorization: Bearer <token>
```

**Parâmetros Query:**

| Parâmetro  | Tipo     | Descrição                                   |
|------------|----------|---------------------------------------------|
| status     | string   | Filtra por status (PENDING, CONFIRMED, etc.)|
| userId     | string   | Filtra por usuário (apenas admin)           |
| startDate  | ISO date | Data inicial para filtro                    |
| endDate    | ISO date | Data final para filtro                      |
| limit      | number   | Limita o número de resultados               |
| offset     | number   | Define o offset para paginação              |

**Resposta (200 OK):**

```json
{
  "orders": [
    {
      "id": "ord123",
      "status": "CONFIRMED",
      "total": 71.80,
      "items": [
        {
          "id": "item1",
          "menuItemId": "abc123",
          "name": "Hamburger Clássico",
          "quantity": 2,
          "unitPrice": 25.90,
          "observations": "Sem cebola"
        },
        {
          "id": "item2",
          "menuItemId": "def456",
          "name": "Batata Frita Grande",
          "quantity": 1,
          "unitPrice": 20.00,
          "observations": null
        }
      ],
      "customerName": "João Silva",
      "customerPhone": "11999887766",
      "paymentMethod": "PIX",
      "paymentStatus": "PAID",
      "table": null,
      "createdAt": "2023-07-15T19:30:00Z",
      "updatedAt": "2023-07-15T19:35:00Z"
    },
    // ...mais pedidos
  ],
  "meta": {
    "total": 124,
    "limit": 10,
    "offset": 0
  }
}
```

#### Criar Pedido

```
POST /api/orders
```

Cria um novo pedido.

**Body:**

```json
{
  "items": [
    {
      "menuItemId": "abc123",
      "quantity": 2,
      "observations": "Sem cebola"
    },
    {
      "menuItemId": "def456",
      "quantity": 1,
      "observations": null
    }
  ],
  "customerName": "João Silva",
  "customerPhone": "11999887766",
  "paymentMethod": "PIX",
  "table": null
}
```

**Resposta (201 Created):**

```json
{
  "id": "ord123",
  "status": "PENDING",
  "total": 71.80,
  "items": [
    {
      "id": "item1",
      "menuItemId": "abc123",
      "name": "Hamburger Clássico",
      "quantity": 2,
      "unitPrice": 25.90,
      "observations": "Sem cebola"
    },
    {
      "id": "item2",
      "menuItemId": "def456",
      "name": "Batata Frita Grande",
      "quantity": 1,
      "unitPrice": 20.00,
      "observations": null
    }
  ],
  "customerName": "João Silva",
  "customerPhone": "11999887766",
  "paymentMethod": "PIX",
  "paymentStatus": "PENDING",
  "table": null,
  "createdAt": "2023-07-15T19:30:00Z",
  "updatedAt": "2023-07-15T19:30:00Z",
  "paymentInfo": {
    "pixCode": "00020126360014BR.GOV.BCB.PIX0114115533607700520400005303986540510.005802BR5913Krato Delivery6008Sao Paulo62070503***63041234",
    "pixImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhE..."
  }
}
```

#### Obter Pedido por ID

```
GET /api/orders/:id
```

Retorna um pedido específico.

**Headers:**

```
Authorization: Bearer <token>
```

**Resposta (200 OK):**

```json
{
  "id": "ord123",
  "status": "CONFIRMED",
  "total": 71.80,
  "items": [
    {
      "id": "item1",
      "menuItemId": "abc123",
      "name": "Hamburger Clássico",
      "quantity": 2,
      "unitPrice": 25.90,
      "observations": "Sem cebola"
    },
    {
      "id": "item2",
      "menuItemId": "def456",
      "name": "Batata Frita Grande",
      "quantity": 1,
      "unitPrice": 20.00,
      "observations": null
    }
  ],
  "customerName": "João Silva",
  "customerPhone": "11999887766",
  "paymentMethod": "PIX",
  "paymentStatus": "PAID",
  "table": null,
  "createdAt": "2023-07-15T19:30:00Z",
  "updatedAt": "2023-07-15T19:35:00Z"
}
```

#### Atualizar Status do Pedido

```
PUT /api/orders/status
```

Atualiza o status de um pedido.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Body:**

```json
{
  "orderId": "ord123",
  "status": "PREPARING"
}
```

**Resposta (200 OK):**

```json
{
  "id": "ord123",
  "status": "PREPARING",
  "updatedAt": "2023-07-15T19:45:00Z"
}
```

### Autenticação

#### Login

```
POST /api/auth/login
```

Autentica um usuário.

**Body:**

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta (200 OK):**

```json
{
  "user": {
    "id": "user123",
    "name": "Nome Completo",
    "email": "usuario@email.com",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta (401 Unauthorized):**

```json
{
  "error": "Email ou senha inválidos",
  "code": "INVALID_CREDENTIALS"
}
```

#### Registro

```
POST /api/auth/register
```

Registra um novo usuário.

**Body:**

```json
{
  "name": "Nome Completo",
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Resposta (201 Created):**

```json
{
  "user": {
    "id": "user456",
    "name": "Nome Completo",
    "email": "usuario@email.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Email já está em uso",
  "code": "EMAIL_IN_USE"
}
```

#### Atualizar Token

```
POST /api/auth/refresh
```

Atualiza o token JWT usando o refresh token.

**Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Upload de Imagens

#### Upload de Imagem

```
POST /api/upload
```

Realiza upload de uma imagem.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**

```
file: [arquivo binário]
folder: "menu" (opcional, default: "general")
```

**Resposta (200 OK):**

```json
{
  "url": "https://cloudinary.com/...",
  "publicId": "menu/image123",
  "width": 800,
  "height": 600,
  "format": "jpg",
  "size": 124567
}
```

### Webhooks

#### Webhook de Pagamento

```
POST /api/webhooks
```

Recebe notificações de pagamento do gateway.

**Headers:**

```
X-Signature: assinatura-para-verificação
```

**Body:** (varia conforme o gateway de pagamento)

```json
{
  "event": "payment.success",
  "data": {
    "orderId": "ord123",
    "transactionId": "trans456",
    "amount": 71.80,
    "status": "paid"
  }
}
```

**Resposta (200 OK):**

```json
{
  "received": true
}
```

### Estabelecimento (Establishment)

#### Buscar Estabelecimento por Slug

```
GET /api/establishment/:slug
```

Retorna os dados do estabelecimento correspondente ao slug fornecido.

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                                      |
|-----------|--------|------------------------------------------------|
| slug      | string | Slug único do estabelecimento (identificador amigável para URL) |

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "abc123",
    "name": "Restaurante Exemplo",
    "slug": "restaurante-exemplo",
    "description": "Um ótimo restaurante para todas as ocasiões",
    "logoUrl": "https://storage.example.com/logos/abc123.jpg",
    "coverImageUrl": "https://storage.example.com/covers/abc123.jpg",
    "type": "restaurant",
    "address": {
      "street": "Rua Exemplo",
      "number": "123",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01001-000"
    },
    "businessHours": [
      {
        "dayOfWeek": 0,
        "openTime": "12:00",
        "closeTime": "22:00",
        "isOpen": true
      },
      {
        "dayOfWeek": 1,
        "openTime": "11:00",
        "closeTime": "23:00",
        "isOpen": true
      },
      // ... outros dias da semana
    ],
    "deliverySettings": {
      "hasDelivery": true,
      "minimumOrderValue": 20,
      "deliveryFee": 5,
      "estimatedDeliveryTime": 45,
      "deliveryZones": []
    },
    "paymentMethods": ["credit_card", "debit_card", "cash", "pix"],
    "phoneNumber": "(11) 99999-9999",
    "whatsappNumber": "(11) 99999-9999",
    "isOpen": true,
    "ownerId": "user123",
    "createdAt": "2023-07-15T14:30:00Z",
    "updatedAt": "2023-07-15T14:30:00Z"
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "error": "Estabelecimento não encontrado"
}
```

#### Buscar Estabelecimento por ID

```
GET /api/establishment/:id
```

Retorna os dados do estabelecimento correspondente ao ID único fornecido.

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Resposta (200 OK):**

Mesmo formato da resposta da busca por slug.

**Resposta (404 Not Found):**

```json
{
  "error": "Estabelecimento não encontrado"
}
```

#### Criar Estabelecimento

```
POST /api/establishment
```

Cria um novo estabelecimento no sistema.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Body:**

```json
{
  "name": "Novo Restaurante",
  "slug": "novo-restaurante",
  "description": "Descrição do novo restaurante",
  "type": "restaurant",
  "ownerId": "user456",
  "address": {
    "street": "Rua Nova",
    "number": "456",
    "neighborhood": "Jardins",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01453-000"
  },
  "businessHours": [
    {
      "dayOfWeek": 1,
      "openTime": "11:00",
      "closeTime": "23:00",
      "isOpen": true
    },
    // ... outros dias da semana
  ],
  "paymentMethods": ["credit_card", "pix"],
  "phoneNumber": "(11) 88888-8888",
  "whatsappNumber": "(11) 88888-8888",
  "isOpen": true
}
```

**Resposta (201 Created):**

```json
{
  "establishment": {
    "id": "def456",
    "name": "Novo Restaurante",
    "slug": "novo-restaurante",
    // ... outros campos com os valores fornecidos
    "createdAt": "2023-08-10T09:15:00Z",
    "updatedAt": "2023-08-10T09:15:00Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Dados obrigatórios não fornecidos (nome, slug, ownerId)"
}
```

**Resposta (409 Conflict):**

```json
{
  "error": "Já existe um estabelecimento com este slug"
}
```

#### Atualizar Dados do Estabelecimento

```
PATCH /api/establishment/:id/update
```

Atualiza as informações gerais do estabelecimento.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Body:**

```json
{
  "name": "Nome Atualizado",
  "description": "Descrição atualizada",
  "type": "restaurant",
  "phoneNumber": "(11) 98765-4321",
  "whatsappNumber": "(11) 98765-4321",
  "paymentMethods": ["credit_card", "pix", "cash"]
}
```

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "123abc",
    "name": "Nome Atualizado",
    "description": "Descrição atualizada",
    "type": "restaurant",
    "phoneNumber": "(11) 98765-4321",
    "whatsappNumber": "(11) 98765-4321",
    "paymentMethods": ["credit_card", "pix", "cash"],
    // ... outros campos do estabelecimento
    "updatedAt": "2023-08-10T15:30:00Z"
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "error": "Estabelecimento não encontrado"
}
```

#### Atualizar Endereço do Estabelecimento

```
PATCH /api/establishment/:id/address
```

Atualiza o endereço do estabelecimento.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Body:**

```json
{
  "street": "Rua Nova",
  "number": "123",
  "complement": "Sala 45",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "latitude": -23.5505,
  "longitude": -46.6333
}
```

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "123abc",
    "address": {
      "street": "Rua Nova",
      "number": "123",
      "complement": "Sala 45",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567",
      "latitude": -23.5505,
      "longitude": -46.6333
    },
    // ... outros campos do estabelecimento
    "updatedAt": "2023-08-10T15:40:00Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Campo obrigatório não fornecido: street"
}
```

#### Atualizar Horários de Funcionamento

```
PATCH /api/establishment/:id/business-hours
```

Atualiza os horários de funcionamento do estabelecimento.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Body:**

```json
[
  {
    "dayOfWeek": 0,
    "isOpen": true,
    "openTime": "08:00",
    "closeTime": "18:00"
  },
  {
    "dayOfWeek": 1,
    "isOpen": true,
    "openTime": "08:00",
    "closeTime": "18:00"
  },
  {
    "dayOfWeek": 6,
    "isOpen": false
  }
]
```

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "123abc",
    "businessHours": [
      {
        "dayOfWeek": 0,
        "isOpen": true,
        "openTime": "08:00",
        "closeTime": "18:00"
      },
      {
        "dayOfWeek": 1,
        "isOpen": true,
        "openTime": "08:00",
        "closeTime": "18:00"
      },
      {
        "dayOfWeek": 6,
        "isOpen": false
      }
    ],
    // ... outros campos do estabelecimento
    "updatedAt": "2023-08-10T15:50:00Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Para dias com isOpen=true, openTime e closeTime são obrigatórios"
}
```

#### Atualizar Configurações de Entrega

```
PATCH /api/establishment/:id/delivery-settings
```

Atualiza as configurações de entrega do estabelecimento.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Body:**

```json
{
  "hasDelivery": true,
  "minimumOrderValue": 20,
  "deliveryFee": 5,
  "estimatedDeliveryTime": 45,
  "deliveryZones": [
    {
      "name": "Zona 1 (até 2km)",
      "fee": 5,
      "estimatedTime": 30
    },
    {
      "name": "Zona 2 (2-5km)",
      "fee": 8,
      "estimatedTime": 45
    }
  ]
}
```

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "123abc",
    "deliverySettings": {
      "hasDelivery": true,
      "minimumOrderValue": 20,
      "deliveryFee": 5,
      "estimatedDeliveryTime": 45,
      "deliveryZones": [
        {
          "name": "Zona 1 (até 2km)",
          "fee": 5,
          "estimatedTime": 30
        },
        {
          "name": "Zona 2 (2-5km)",
          "fee": 8,
          "estimatedTime": 45
        }
      ]
    },
    // ... outros campos do estabelecimento
    "updatedAt": "2023-08-10T16:00:00Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "O campo 'hasDelivery' é obrigatório"
}
```

#### Atualizar Métodos de Pagamento

```
PATCH /api/establishment/:id/payment-methods
```

Atualiza os métodos de pagamento aceitos pelo estabelecimento.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Body:**

```json
[
  "credit_card",
  "debit_card",
  "cash",
  "pix"
]
```

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "123abc",
    "paymentMethods": [
      "credit_card",
      "debit_card",
      "cash",
      "pix"
    ],
    // ... outros campos do estabelecimento
    "updatedAt": "2023-08-10T16:10:00Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Método de pagamento inválido: cheque. Métodos válidos: credit_card, debit_card, cash, pix, bank_transfer, meal_voucher, food_voucher"
}
```

#### Configurar Integração com WhatsApp

```
PATCH /api/establishment/:id/whatsapp
```

Configura a integração com WhatsApp para notificações.

**Headers:**

```
Authorization: Bearer <admin-token>
```

**Parâmetros de URL:**

| Parâmetro | Tipo   | Descrição                               |
|-----------|--------|------------------------------------------|
| id        | string | ID único do estabelecimento no banco de dados |

**Body:**

```json
{
  "whatsappNumber": "+5511987654321",
  "notifyNewOrders": true,
  "notifyStatusChanges": true,
  "customMessages": {
    "newOrder": "Olá! Você recebeu um novo pedido #{{orderId}}",
    "orderConfirmed": "O pedido #{{orderId}} foi confirmado",
    "orderReady": "O pedido #{{orderId}} está pronto para retirada/entrega",
    "orderDelivered": "O pedido #{{orderId}} foi entregue"
  }
}
```

**Resposta (200 OK):**

```json
{
  "establishment": {
    "id": "123abc",
    "whatsappNumber": "+5511987654321",
    "whatsappConfig": {
      "whatsappNumber": "+5511987654321",
      "notifyNewOrders": true,
      "notifyStatusChanges": true,
      "customMessages": {
        "newOrder": "Olá! Você recebeu um novo pedido #{{orderId}}",
        "orderConfirmed": "O pedido #{{orderId}} foi confirmado",
        "orderReady": "O pedido #{{orderId}} está pronto para retirada/entrega",
        "orderDelivered": "O pedido #{{orderId}} foi entregue"
      }
    },
    // ... outros campos do estabelecimento
    "updatedAt": "2023-08-10T16:20:00Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "error": "Número de WhatsApp não fornecido"
}
```

## Códigos de Erro

| Código               | Descrição                                     |
|----------------------|-----------------------------------------------|
| INVALID_CREDENTIALS  | Credenciais inválidas (email/senha)           |
| EMAIL_IN_USE         | Email já está em uso                          |
| ITEM_NOT_FOUND       | Item não encontrado                           |
| ORDER_NOT_FOUND      | Pedido não encontrado                         |
| INVALID_DATA         | Dados inválidos fornecidos                    |
| INVALID_STATUS       | Status de pedido inválido                     |
| UNAUTHORIZED         | Não autorizado a acessar o recurso            |
| INSUFFICIENT_BALANCE | Saldo insuficiente (para operações de crédito)|
| SERVER_ERROR         | Erro interno do servidor                      |
| INVALID_TOKEN        | Token inválido ou expirado                    |

## Limitações de Taxa

A API possui limite de requisições para evitar abusos:

- 100 requisições por minuto por IP para endpoints públicos
- 300 requisições por minuto para clientes autenticados
- 1000 requisições por minuto para usuários admin

Caso ultrapasse os limites, você receberá o status 429 (Too Many Requests).

## Paginação

Endpoints que retornam listas suportam paginação através dos parâmetros:

- `limit`: Número máximo de itens por página (padrão: 10, máximo: 100)
- `offset`: Posição inicial para paginação (0-indexed)

A resposta incluirá metadados de paginação:

```json
{
  "items": [...],
  "meta": {
    "total": 47,
    "limit": 10,
    "offset": 0
  }
}
```

## Versionamento

A API atual está na v1. Para garantir compatibilidade, utilize o prefixo `/api/v1/` nas requisições.

Exemplo:
```
GET /api/v1/menu
```

## Suporte e Contato

Para questões técnicas ou dúvidas sobre a API, entre em contato:

- Email: suporte@cardapio-krato.com
- Documentação completa: https://docs.cardapio-krato.com/api 

## API de Planos de Assinatura {#api-planos-assinatura}

A API de planos de assinatura permite gerenciar diferentes níveis de acesso e recursos para os estabelecimentos.

### Listar Planos Disponíveis

```
GET /api/subscription/plans
```

**Descrição**: Retorna todos os planos de assinatura ativos disponíveis.

**Autenticação**: Não requer autenticação

**Parâmetros**: Nenhum

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

### Obter Detalhes de um Plano

```
GET /api/subscription/plans/:id
```

**Descrição**: Retorna detalhes de um plano específico.

**Autenticação**: Não requer autenticação

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

### Obter Assinatura de Estabelecimento

```
GET /api/establishment/:identifier/subscription
```

**Descrição**: Retorna a assinatura atual de um estabelecimento.

**Autenticação**: Requer autenticação do estabelecimento

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
}
```

**Resposta de Erro (404 Not Found)**:

```json
{
  "message": "Nenhuma assinatura encontrada para este estabelecimento"
}
```

### Atualizar Assinatura

```
POST /api/establishment/:identifier/subscription/update
```

**Descrição**: Cria ou atualiza a assinatura de um estabelecimento.

**Autenticação**: Requer autenticação do estabelecimento

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
}
```

**Resposta de Erro (400 Bad Request)**:

```json
{
  "error": "ID do plano e ciclo de faturamento são obrigatórios"
}
```

### Cancelar Assinatura

```
POST /api/establishment/:identifier/subscription/cancel
```

**Descrição**: Cancela a assinatura atual de um estabelecimento.

**Autenticação**: Requer autenticação do estabelecimento

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

### Verificar Acesso a Recursos

```
POST /api/establishment/:identifier/check-feature
```

**Descrição**: Verifica se um estabelecimento tem acesso a um recurso específico baseado em seu plano.

**Autenticação**: Requer autenticação do estabelecimento

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

### Verificar Limites de Produtos

```
GET /api/establishment/:identifier/product-limit
```

**Descrição**: Verifica o limite de produtos disponíveis para um estabelecimento baseado em seu plano.

**Autenticação**: Requer autenticação do estabelecimento

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