import { NextResponse } from 'next/server';

// Enum para roles de usuário
enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

// Interface para usuários
interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção, seria um hash
  role: Role;
}

// Usuários mockados para testes
const mockUsers: User[] = [
  {
    id: "user1",
    name: "Admin",
    email: "admin@example.com",
    password: "admin123", // Em produção, seria um hash
    role: Role.ADMIN
  },
  {
    id: "user2",
    name: "Cliente",
    email: "cliente@example.com",
    password: "cliente123", // Em produção, seria um hash
    role: Role.USER
  }
];

export async function POST(request: Request) {
  const data = await request.json();
  
  // Validar dados recebidos
  if (!data.email || !data.password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 }
    );
  }
  
  // Buscar usuário pelo email
  const user = mockUsers.find(user => user.email === data.email);
  
  // Verificar se o usuário existe
  if (!user) {
    return NextResponse.json(
      { error: "Email ou senha inválidos" },
      { status: 401 }
    );
  }
  
  // Verificar a senha (em produção, usaria bcrypt.compare ou similar)
  if (user.password !== data.password) {
    return NextResponse.json(
      { error: "Email ou senha inválidos" },
      { status: 401 }
    );
  }
  
  // Gerar token JWT simulado
  const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600
    })
  ).toString('base64')}.MOCK_SIGNATURE`;

  // Gerar refresh token
  const refreshToken = `refresh_${Date.now()}`;
  
  // Retornar dados do usuário e tokens
  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token,
    refreshToken
  });
} 