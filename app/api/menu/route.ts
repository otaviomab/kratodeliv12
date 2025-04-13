import { NextResponse } from 'next/server';

// Dados fictícios para o cardápio
const mockCategories = [
  {
    id: "1",
    name: "Entradas",
    products: [
      {
        id: "1",
        name: "Bruschetta",
        description: "Fatias de pão italiano com tomate, alho e manjericão",
        price: 18.9,
        imageUrl: "/images/bruschetta.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "1",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Bolinho de Bacalhau",
        description: "Porção com 8 unidades",
        price: 32.9,
        imageUrl: "/images/bolinho-bacalhau.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "1",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Pratos Principais",
    products: [
      {
        id: "3",
        name: "Picanha ao Ponto",
        description: "Picanha grelhada acompanhada de arroz, feijão e batata frita",
        price: 72.9,
        imageUrl: "/images/picanha.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "2",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Filé de Peixe",
        description: "Filé de tilápia grelhado com legumes e purê de batata",
        price: 45.9,
        imageUrl: "/images/file-peixe.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "2",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "3",
    name: "Sobremesas",
    products: [
      {
        id: "5",
        name: "Pudim de Leite",
        description: "Pudim caseiro com calda de caramelo",
        price: 12.9,
        imageUrl: "/images/pudim.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "3",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "6",
        name: "Petit Gateau",
        description: "Bolo de chocolate quente com sorvete de baunilha",
        price: 18.9,
        imageUrl: "/images/petit-gateau.jpg",
        isActive: true,
        isCustomizable: false,
        categoryId: "3",
        establishmentId: "1",
        additionals: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const available = searchParams.get('available');
  const search = searchParams.get('search');
  
  let filteredCategories = [...mockCategories];
  
  // Filtrar por categoria
  if (category) {
    filteredCategories = filteredCategories.filter(c => c.id === category);
  }
  
  // Filtrar por disponibilidade
  if (available !== null) {
    const isAvailable = available === 'true';
    filteredCategories = filteredCategories.map(category => ({
      ...category,
      products: category.products.filter(product => product.isActive === isAvailable)
    }));
  }
  
  // Filtrar por termo de busca
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCategories = filteredCategories.map(category => ({
      ...category,
      products: category.products.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      )
    }));
  }
  
  // Remover categorias vazias após a filtragem
  filteredCategories = filteredCategories.filter(category => category.products.length > 0);
  
  return NextResponse.json({ categories: filteredCategories });
} 