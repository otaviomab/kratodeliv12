import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MenuCategoryList from "@/components/MenuCategoryList";
import { type Product } from "@/types/menu";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Dados simulados
const mockEstablishment = {
  id: "1",
  name: "Restaurante Demo",
  slug: "restaurante-demo",
  description: "O melhor restaurante da cidade com uma variedade incrível de pratos.",
  logoUrl: "/demo-logo.png",
  coverImageUrl: "/demo-cover.jpg",
  type: "restaurant",
  address: {
    street: "Rua das Flores",
    number: "123",
    complement: "Sala 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
  },
  businessHours: [
    {
      day: 1, // Segunda
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
    {
      day: 2, // Terça
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
    {
      day: 3, // Quarta
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
    {
      day: 4, // Quinta
      openTime: "11:00",
      closeTime: "23:00",
      isClosed: false,
    },
    {
      day: 5, // Sexta
      openTime: "11:00",
      closeTime: "00:00",
      isClosed: false,
    },
    {
      day: 6, // Sábado
      openTime: "11:00",
      closeTime: "00:00",
      isClosed: false,
    },
    {
      day: 0, // Domingo
      openTime: "11:00",
      closeTime: "22:00",
      isClosed: false,
    },
  ],
  deliverySettings: {
    minimumOrderValue: 20,
    deliveryFee: 5,
    averageDeliveryTime: "30-45",
    maxDeliveryRadius: 5,
  },
  paymentMethods: ["credit_card", "debit_card", "cash", "pix"],
  phoneNumber: "(11) 98765-4321",
  whatsappNumber: "(11) 91234-5678",
  isOpen: true,
  ownerId: "user-123",
  createdAt: new Date("2023-01-15").toISOString(),
  updatedAt: new Date("2023-04-20").toISOString(),
};

const mockCategories = [
  {
    id: "1",
    name: "Entradas",
    products: [
      {
        id: "101",
        name: "Bruschetta",
        description: "Torradas com tomate, manjericão e azeite de oliva",
        price: 18.9,
        imageUrl: "/bruschetta.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "1",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date("2023-02-10").toISOString(),
        updatedAt: new Date("2023-02-10").toISOString(),
      },
      {
        id: "102",
        name: "Carpaccio",
        description: "Finas fatias de filé mignon com molho especial e parmesão",
        price: 32.5,
        imageUrl: "/carpaccio.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "1",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date("2023-02-10").toISOString(),
        updatedAt: new Date("2023-02-10").toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Pratos Principais",
    products: [
      {
        id: "201",
        name: "Filé ao Molho Madeira",
        description: "Filé mignon ao molho madeira com batatas rústicas e legumes",
        price: 59.9,
        imageUrl: "/file-madeira.jpg",
        isActive: true,
        isCustomizable: true,
        categoryId: "2",
        establishmentId: "1",
        additionals: [
          {
            id: "301",
            name: "Batata frita extra",
            price: 8.0,
          },
          {
            id: "302",
            name: "Purê de batata",
            price: 6.0,
          },
        ],
        createdAt: new Date("2023-02-10").toISOString(),
        updatedAt: new Date("2023-03-15").toISOString(),
      },
      {
        id: "202",
        name: "Salmão Grelhado",
        description: "Salmão grelhado com molho de ervas e risoto de limão",
        price: 68.5,
        imageUrl: "/salmao.jpg",
        isActive: true,
        isCustomizable: true,
        categoryId: "2",
        establishmentId: "1",
        additionals: [
          {
            id: "303",
            name: "Risoto extra",
            price: 12.0,
          },
        ],
        createdAt: new Date("2023-02-10").toISOString(),
        updatedAt: new Date("2023-03-15").toISOString(),
      },
    ],
  },
  {
    id: "3",
    name: "Sobremesas",
    products: [
      {
        id: "301",
        name: "Tiramisu",
        description: "Clássico doce italiano com café e mascarpone",
        price: 22.9,
        imageUrl: "/tiramisu.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "3",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date("2023-02-10").toISOString(),
        updatedAt: new Date("2023-02-10").toISOString(),
      },
      {
        id: "302",
        name: "Cheesecake de Frutas Vermelhas",
        description: "Cheesecake cremoso com calda de frutas vermelhas",
        price: 24.5,
        imageUrl: "/cheesecake.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "3",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date("2023-02-10").toISOString(),
        updatedAt: new Date("2023-02-10").toISOString(),
      },
    ],
  },
];

// Simula uma função que verifica se o slug é válido (simulando uma consulta ao banco de dados)
async function isValidSlug(slug: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simula uma operação assíncrona
  return slug === "restaurante-demo";
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Verifica se o slug é válido de forma assíncrona
  const isValid = await isValidSlug(params.slug);
  
  if (!isValid) {
    notFound();
  }
  
  return {
    title: mockEstablishment.name,
    description: mockEstablishment.description,
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: { slug: string };
}) {
  // Verifica se o slug é válido de forma assíncrona
  const isValid = await isValidSlug(params.slug);
  
  if (!isValid) {
    notFound();
  }

  // Simulação de fetch de dados
  await new Promise(resolve => setTimeout(resolve, 100));

  return (
    <>
      <Header establishment={mockEstablishment} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{mockEstablishment.name}</h1>
        <p className="text-gray-600 mb-8">{mockEstablishment.description}</p>
        
        <MenuCategoryList categories={mockCategories} />
      </main>
      <Footer />
    </>
  );
} 