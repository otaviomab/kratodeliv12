import { NextResponse } from 'next/server';

// Dados fictícios para o estabelecimento
const mockEstablishment = {
  id: "1",
  name: "Restaurante Demo",
  slug: "restaurante-demo",
  description: "Um restaurante para demonstração do sistema",
  logoUrl: "/images/logo.png",
  coverImageUrl: "/images/cover.jpg",
  type: "restaurant",
  address: {
    street: "Rua Exemplo",
    number: "123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01001-000",
  },
  businessHours: [
    {
      dayOfWeek: 1,
      openTime: "11:00",
      closeTime: "23:00",
      isOpen: true,
    },
    {
      dayOfWeek: 2,
      openTime: "11:00",
      closeTime: "23:00",
      isOpen: true,
    },
    {
      dayOfWeek: 3,
      openTime: "11:00",
      closeTime: "23:00",
      isOpen: true,
    },
    {
      dayOfWeek: 4,
      openTime: "11:00",
      closeTime: "23:00",
      isOpen: true,
    },
    {
      dayOfWeek: 5,
      openTime: "11:00",
      closeTime: "00:00",
      isOpen: true,
    },
    {
      dayOfWeek: 6,
      openTime: "11:00",
      closeTime: "00:00",
      isOpen: true,
    },
    {
      dayOfWeek: 0,
      openTime: "11:00",
      closeTime: "22:00",
      isOpen: true,
    },
  ],
  deliverySettings: {
    hasDelivery: true,
    minimumOrderValue: 20,
    deliveryFee: 5,
    estimatedDeliveryTime: 45,
    deliveryZones: [],
  },
  paymentMethods: ["credit_card", "debit_card", "cash", "pix"],
  phoneNumber: "(11) 99999-9999",
  whatsappNumber: "(11) 99999-9999",
  isOpen: true,
  ownerId: "1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  // Verificar se o slug corresponde ao estabelecimento fictício
  if (slug !== mockEstablishment.slug) {
    return NextResponse.json(
      { error: "Estabelecimento não encontrado" },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ establishment: mockEstablishment });
} 