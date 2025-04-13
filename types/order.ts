export interface Order {
  id: string;
  number: number;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: Address;
  establishmentId: string;
  items: OrderItem[];
  status: string;
  deliveryType: 'delivery' | 'pickup';
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  change?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  additionals: OrderItemAdditional[];
}

export interface OrderItemAdditional {
  name: string;
  options: OrderItemAdditionalOption[];
}

export interface OrderItemAdditionalOption {
  name: string;
  price: number;
}

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  note?: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  additionals: CartItemAdditional[];
}

export interface CartItemAdditional {
  name: string;
  options: CartItemAdditionalOption[];
}

export interface CartItemAdditionalOption {
  name: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  customerName: string;
  customerPhone: string;
  customerAddress?: Address;
  paymentMethod: string;
  change?: number;
  notes?: string;
  establishmentId: string;
} 