// Tipos de estabelecimento
export const ESTABLISHMENT_TYPES = [
  { id: 'restaurant', label: 'Restaurante' },
  { id: 'pizzeria', label: 'Pizzaria' },
  { id: 'bakery', label: 'Padaria' },
  { id: 'bar', label: 'Bar' },
  { id: 'cafe', label: 'Café' },
  { id: 'fastfood', label: 'Fast Food' },
  { id: 'icecream', label: 'Sorveteria' },
  { id: 'other', label: 'Outro' },
];

// Status de pedidos
export const ORDER_STATUS = [
  { id: 'pending', label: 'Pendente', color: 'yellow' },
  { id: 'confirmed', label: 'Confirmado', color: 'blue' },
  { id: 'preparing', label: 'Preparando', color: 'purple' },
  { id: 'ready', label: 'Pronto', color: 'green' },
  { id: 'delivering', label: 'Em entrega', color: 'orange' },
  { id: 'delivered', label: 'Entregue', color: 'green' },
  { id: 'canceled', label: 'Cancelado', color: 'red' },
];

// Métodos de pagamento
export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Dinheiro' },
  { id: 'credit_card', label: 'Cartão de crédito' },
  { id: 'debit_card', label: 'Cartão de débito' },
  { id: 'pix', label: 'PIX' },
];

// Tipos de entrega
export const DELIVERY_TYPES = [
  { id: 'delivery', label: 'Entrega' },
  { id: 'pickup', label: 'Retirada' },
];

// Dias da semana
export const WEEKDAYS = [
  { id: 0, label: 'Domingo' },
  { id: 1, label: 'Segunda-feira' },
  { id: 2, label: 'Terça-feira' },
  { id: 3, label: 'Quarta-feira' },
  { id: 4, label: 'Quinta-feira' },
  { id: 5, label: 'Sexta-feira' },
  { id: 6, label: 'Sábado' },
]; 