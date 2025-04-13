# Fluxo de Pedido - Documentação

## Visão Geral

Este documento descreve o fluxo completo de um pedido no Cardápio Digital Krato, desde a navegação do cliente pelo cardápio até a entrega do pedido e feedback.

## Diagrama do Fluxo

```
Cliente              Frontend                           Backend                 Admin
  |                     |                                  |                      |
  |-- Navega cardápio --|                                  |                      |
  |-- Seleciona item  --|                                  |                      |
  |-- Adiciona item   -->|                                  |                      |
  |                     |-- Adiciona ao carrinho local --|                      |
  |-- Visualiza carrinho->|                                  |                      |
  |-- Finaliza pedido  -->|                                  |                      |
  |                     |-- Coleta dados cliente/entrega --|                      |
  |-- Confirma dados   -->|                                  |                      |
  |                     |-- Seleciona forma pagamento    --|                      |
  |-- Confirma pagamento->|                                  |                      |
  |                     |-- Registra pedido  ------------->|                      |
  |                     |                                  |-- Notifica admin -->|
  |                     |<-- Retorna confirmação --------<-|                      |
  |<-- Exibe confirmação-|                                  |                      |
  |                     |                                  |-- Admin atualiza status
  |                     |                                  |<----------------------|
  |                     |<-- Atualiza status do pedido ---<|                      |
  |<-- Notifica cliente -|                                  |                      |
  |                     |                                  |                      |
```

## Etapas Detalhadas

### 1. Navegação e Seleção de Produtos

**Fluxo no Frontend:**
- Cliente acessa o cardápio digital através da URL personalizada (`/cardapio/[slug]`)
- Visualiza categorias e produtos disponíveis
- Clica em um produto para ver detalhes

**Implementação:**
- Página principal em `app/cardapio/[slug]/page.tsx`
- Exibição de produtos usando o componente `MenuItem.tsx`
- Modal de detalhes de produto com `ProductModal.tsx`

### 2. Adição de Itens ao Carrinho

**Fluxo no Frontend:**
- Cliente seleciona um produto para visualizar detalhes
- Escolhe adicionais/complementos (opcional)
- Adiciona observações (opcional)
- Define quantidade
- Adiciona ao carrinho

**Implementação:**
- Gerenciamento de estado do carrinho via `contexts/CartContext.tsx`
- Função `addToCart` processa o item e suas opções
- Armazenamento no localStorage para persistência

**Estrutura de Dados:**
```typescript
// Representação simplificada da estrutura do carrinho
cartItem = {
  id: string,
  productId: string,
  name: string,
  price: number,
  quantity: number,
  additionals: Array<{id: string, name: string, price: number}>,
  observations: string,
  imageUrl: string
}
```

### 3. Visualização e Gestão do Carrinho

**Fluxo no Frontend:**
- Cliente acessa o carrinho
- Visualiza itens adicionados
- Pode alterar quantidades ou remover itens
- Visualiza subtotal e total

**Implementação:**
- Página do carrinho em `app/cart/page.tsx`
- Componente `CartItem.tsx` para exibição e interação com cada item
- Funções `updateItemQuantity` e `removeFromCart` para manipulação

### 4. Coleta de Dados do Cliente e Entrega

**Fluxo no Frontend:**
- Cliente inicia processo de checkout
- Preenche dados pessoais (nome, telefone)
- Escolhe entre retirada no local ou entrega
- Se entrega, preenche endereço completo

**Implementação:**
- Formulário multietapas em `app/checkout/page.tsx`
- Componentes de formulário em `components/checkout/`
- Validação de campos obrigatórios
- Cálculo dinâmico de taxa de entrega baseado no endereço/CEP

### 5. Seleção de Forma de Pagamento

**Fluxo no Frontend:**
- Cliente seleciona método de pagamento
- Opções disponíveis conforme configuração do estabelecimento:
  - Dinheiro (com opção de troco)
  - Cartão (débito/crédito na entrega)
  - PIX (gera QR Code)
  - Pagamento online (futuro)

**Implementação:**
- Componente `PaymentSelector.tsx`
- Validação específica para cada método de pagamento
- Geração de QR Code para PIX quando selecionado

### 6. Confirmação e Registro do Pedido

**Fluxo no Frontend:**
- Cliente visualiza resumo do pedido
- Confirma todos os dados e finaliza
- Sistema envia requisição para API

**Fluxo no Backend:**
- API recebe dados do pedido
- Valida todos os campos e valores
- Registra o pedido na base de dados
- Retorna confirmação com número do pedido

**Implementação:**
- Rota de API em `app/api/orders/route.ts`
- Validação de dados no backend
- Armazenamento do pedido no banco de dados

**Estrutura de Dados:**
```typescript
// Representação simplificada da estrutura do pedido
order = {
  id: string,
  establishmentId: string,
  customerName: string, 
  customerPhone: string,
  items: Array<CartItem>,
  deliveryType: 'pickup' | 'delivery',
  deliveryAddress?: {
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    zipCode: string,
    complement?: string
  },
  paymentMethod: 'cash' | 'card' | 'pix',
  paymentDetails: {
    // Dados específicos do método de pagamento
    changeFor?: number, // Para pagamento em dinheiro
    cardType?: 'credit' | 'debit', // Para pagamento com cartão
    pixKey?: string // Para pagamento com PIX
  },
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'canceled',
  totalPrice: number,
  deliveryFee: number,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. Notificação do Estabelecimento

**Fluxo no Backend:**
- Após registro do pedido, sistema notifica o estabelecimento
- Envio de notificação via WebSocket/Realtime
- Opcionalmente, envio de notificação por WhatsApp/SMS (conforme configuração)

**Implementação:**
- Utilização do Appwrite Realtime para notificações em tempo real
- Integração com API de WhatsApp para notificações (opcional)
- Sistema de alertas sonoros no painel administrativo

### 8. Gerenciamento do Pedido (Admin)

**Fluxo no Admin:**
- Admin recebe notificação de novo pedido
- Visualiza detalhes completos
- Aceita ou rejeita o pedido
- Atualiza status conforme o progresso:
  1. Pendente (inicial)
  2. Confirmado (após aceite)
  3. Em preparação
  4. Pronto para entrega/retirada
  5. Em entrega (se aplicável)
  6. Entregue/Finalizado

**Implementação:**
- Interface em `app/admin/orders/page.tsx` (listagem)
- Detalhes em `app/admin/orders/[id]/page.tsx`
- Componentes de atualização de status
- Rota de API para atualização em `app/api/orders/status/route.ts`

### 9. Atualização de Status e Notificação do Cliente

**Fluxo no Backend:**
- Sistema recebe atualização de status
- Atualiza o registro no banco de dados
- Notifica o cliente sobre a mudança de status

**Fluxo no Frontend:**
- Cliente recebe atualização de status em tempo real
- Página de acompanhamento exibe status atual
- Opcionalmente, cliente recebe notificação push ou WhatsApp

**Implementação:**
- Página de acompanhamento em `app/order-status/[id]/page.tsx`
- Atualização via Appwrite Realtime
- Componente de exibição de status `OrderStatusTracker.tsx`

### 10. Conclusão e Feedback

**Fluxo no Frontend:**
- Após entrega/retirada, cliente recebe solicitação de feedback
- Pode avaliar o serviço e os produtos
- Feedback é registrado para análise posterior

**Implementação:**
- Formulário de feedback em `app/orders/[id]/feedback/page.tsx`
- Componente `RatingStars.tsx` para avaliação
- API para registro de feedback em `app/api/feedback/route.ts`

## Estados de Pedido

1. **Pendente**: Pedido registrado, aguardando confirmação do estabelecimento
2. **Confirmado**: Pedido aceito pelo estabelecimento
3. **Em preparação**: Estabelecimento está preparando os itens
4. **Pronto**: Pedido está pronto para entrega ou retirada
5. **Em entrega**: Pedido está a caminho (somente para entregas)
6. **Entregue/Finalizado**: Pedido foi entregue ou retirado com sucesso
7. **Cancelado**: Pedido foi cancelado pelo cliente ou estabelecimento

## Considerações de Implementação

### Segurança
- Validação de dados em ambos frontend e backend
- Proteção contra manipulação de preços ou itens
- Verificação de disponibilidade de produtos

### Performance
- Otimização de requisições durante o checkout
- Cache de dados do carrinho
- Lazy loading de componentes pesados

### Experiência do Usuário
- Feedback visual em cada etapa
- Mensagens de erro claras e específicas
- Prevenção de submissão dupla de pedidos
- Estado de carregamento durante processamento

### Situações de Erro
- Tratamento de falhas de conectividade
- Recuperação de dados em caso de recarregamento da página
- Validação de disponibilidade de itens no momento da finalização 