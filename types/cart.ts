export interface CartItemAdditional {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  additionals: CartItemAdditional[];
  observations?: string;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface CartAddItemRequest {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  additionals: CartItemAdditional[];
  observations?: string;
  imageUrl?: string;
}

export interface CartUpdateItemRequest {
  id: string;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalPrice: number;
} 