export interface DeliverySettings {
  radius: number;
  fee: number;
  minimumOrderValue: number;
  estimatedTime: string;
  isActive: boolean;
}

export interface BusinessHours {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
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

export interface Establishment {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  type: string;
  address: Address;
  businessHours: BusinessHours[];
  deliverySettings: DeliverySettings;
  paymentMethods: string[];
  phoneNumber: string;
  whatsappNumber: string;
  isOpen: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
} 