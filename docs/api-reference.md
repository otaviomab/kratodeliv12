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