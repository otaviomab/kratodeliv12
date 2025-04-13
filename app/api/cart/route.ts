import { NextResponse } from 'next/server';

// Interface para os itens do carrinho
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  observations: string;
  imageUrl: string;
}

// Simulação de estado do carrinho (em um backend real, isso estaria em um banco de dados)
let cartItems: CartItem[] = [];

export async function GET() {
  return NextResponse.json({ items: cartItems, total: calculateTotal() });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  // Validar dados recebidos
  if (!data.productId || !data.quantity) {
    return NextResponse.json(
      { error: "Dados de produto incompletos" },
      { status: 400 }
    );
  }
  
  // Verificar se o produto já está no carrinho
  const existingItemIndex = cartItems.findIndex(
    item => item.productId === data.productId
  );
  
  if (existingItemIndex >= 0) {
    // Atualizar quantidade se o produto já existe
    cartItems[existingItemIndex].quantity += data.quantity;
  } else {
    // Adicionar novo item
    cartItems.push({
      id: Date.now().toString(),
      productId: data.productId,
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      observations: data.observations || "",
      imageUrl: data.imageUrl || ""
    });
  }
  
  return NextResponse.json({ 
    items: cartItems, 
    total: calculateTotal(),
    message: "Item adicionado ao carrinho"
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get('id');
  
  // Remover um item específico
  if (itemId) {
    const initialLength = cartItems.length;
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    if (cartItems.length === initialLength) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }
  } else {
    // Limpar todo o carrinho se nenhum ID for fornecido
    cartItems = [];
  }
  
  return NextResponse.json({ 
    items: cartItems, 
    total: calculateTotal(),
    message: itemId ? "Item removido do carrinho" : "Carrinho limpo" 
  });
}

export async function PUT(request: Request) {
  const data = await request.json();
  
  if (!data.id || !data.quantity) {
    return NextResponse.json(
      { error: "Dados incompletos" },
      { status: 400 }
    );
  }
  
  const itemIndex = cartItems.findIndex(item => item.id === data.id);
  
  if (itemIndex < 0) {
    return NextResponse.json(
      { error: "Item não encontrado" },
      { status: 404 }
    );
  }
  
  // Atualizar a quantidade
  cartItems[itemIndex].quantity = data.quantity;
  
  // Atualizar observações, se fornecidas
  if (data.observations !== undefined) {
    cartItems[itemIndex].observations = data.observations;
  }
  
  return NextResponse.json({ 
    items: cartItems, 
    total: calculateTotal(),
    message: "Carrinho atualizado" 
  });
}

function calculateTotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
} 