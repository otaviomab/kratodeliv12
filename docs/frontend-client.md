# Frontend Cliente - Documentação

## Página de Cardápio {#pagina-cardapio}

**Propósito**: Permite que os clientes visualizem o cardápio digital do estabelecimento, navegando pelas categorias e produtos disponíveis.

**Implementação**:

- Localizado em `app/cardapio/[slug]/page.tsx`
- Utiliza SSR (Server-Side Rendering) para obter dados do estabelecimento e seu cardápio
- Recursos:
  - Navegação por categorias
  - Visualização detalhada de produtos
  - Interface responsiva para dispositivos móveis e desktop
  - Carregamento otimizado de imagens

**Exemplo de Uso**:

1. Acesse a URL `/cardapio/[nome-do-estabelecimento]`
2. Visualize as categorias disponíveis no menu
3. Clique em um produto para ver detalhes
4. Adicione produtos ao carrinho conforme necessário

## Componentes Principais {#componentes}

### Header {#header}

**Propósito**: Exibe informações do estabelecimento e fornece acesso ao carrinho.

**Implementação**:

- Localizado em `components/Header.tsx`
- Exibe:
  - Logo e nome do estabelecimento
  - Botão de acesso ao carrinho com contador de itens
  - Informações de contato

### MenuItem {#menu-item}

**Propósito**: Exibe informações de um produto individual no cardápio.

**Implementação**:

- Localizado em `components/MenuItem.tsx`
- Componente do lado do cliente (`"use client"`)
- Exibe:
  - Nome e descrição do produto
  - Preço
  - Imagem (quando disponível)
  - Botão para adicionar ao carrinho

### ProductModal {#product-modal}

**Propósito**: Exibe detalhes completos de um produto e permite personalizações.

**Implementação**:

- Localizado em `components/ProductModal.tsx`
- Componente do lado do cliente
- Recursos:
  - Visualização detalhada do produto
  - Seleção de quantidade
  - Seleção de adicionais
  - Campo para observações
  - Adição ao carrinho

## Carrinho de Compras {#carrinho}

**Propósito**: Permite que os clientes revisem e gerenciem os itens que desejam pedir.

**Implementação**:

- Localizado em `app/carrinho/page.tsx` (página) e `components/Cart.tsx` (componente)
- Componente do lado do cliente
- Recursos:
  - Listagem de itens adicionados
  - Ajuste de quantidade
  - Remoção de itens
  - Cálculo do subtotal e total
  - Campo para aplicação de cupons de desconto
  - Botão para finalizar pedido

**Exemplo de Uso**:

1. Adicione produtos ao carrinho a partir da página de cardápio
2. Clique no ícone do carrinho para visualizar os itens adicionados
3. Ajuste as quantidades conforme necessário
4. Remova itens indesejados
5. Clique em "Finalizar Pedido" para prosseguir

## Finalização de Pedido {#finalizar-pedido}

**Propósito**: Permite que os clientes concluam o pedido fornecendo informações de entrega e pagamento.

**Implementação**:

- Localizado em `app/finalizar-pedido/page.tsx`
- Componente do lado do cliente
- Etapas:
  1. **Dados de Contato**: Nome, telefone, e-mail
  2. **Endereço de Entrega**: Rua, número, bairro, complemento
  3. **Método de Pagamento**: Seleção entre as opções disponíveis
  4. **Confirmação**: Revisão final do pedido

**Recursos**:

- Validação de campos obrigatórios
- Cálculo automático de taxas de entrega
- Geração de dados para pagamento (PIX, links de pagamento)
- Confirmação de pedido com número de rastreamento

**Métodos de Pagamento Suportados**:

- PIX
- Cartão de Crédito (online ou na entrega)
- Dinheiro na entrega

## Estado Global e Hooks {#estado-global}

**Propósito**: Gerencia o estado do carrinho e dados do cliente de forma global na aplicação.

**Implementação**:

- Localizado em `contexts/CartContext.tsx`
- Utiliza Context API do React
- Funcionalidades:
  - Adição de itens ao carrinho
  - Atualização de quantidades
  - Remoção de itens
  - Cálculo de totais
  - Persistência de dados no localStorage

## Utilitários e Funções Auxiliares {#utilitarios}

**Propósito**: Fornece funções reutilizáveis para manipulação de dados e formatação.

**Implementação**:

- Localizado em `lib/utils.ts`
- Funções principais:
  - `formatPrice`: Formata valores monetários
  - `generateOrderNumber`: Gera números de pedido únicos
  - `calculateDeliveryFee`: Calcula taxas de entrega com base na distância
  - `validateCoupon`: Valida códigos de cupom de desconto 