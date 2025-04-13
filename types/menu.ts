export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  establishmentId: string;
  products: Product[];
}

export interface ProductAdditional {
  id: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  isCustomizable: boolean;
  categoryId: string;
  establishmentId: string;
  additionals: ProductAdditional[];
  createdAt: string;
  updatedAt: string;
}

export interface Establishment {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  type: string;
  address?: Address;
  businessHours: BusinessHours[];
  deliverySettings: DeliverySettings;
  paymentMethods: string[];
  phoneNumber: string;
  whatsappNumber?: string;
  isOpen: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface DeliverySettings {
  hasDelivery: boolean;
  minimumOrderValue: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  deliveryZones: DeliveryZone[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: number;
  zipCodes: string[];
} 