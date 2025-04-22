import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withValidation } from '@/middleware/withValidation';
import { withRateLimit } from '@/middleware/rateLimiter';
import { LoggingService, ActivityType } from '@/lib/loggingService';
import { Account, Client, ID } from 'appwrite';

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

// Esquema de validação para o login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

// Cliente Appwrite
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '');

const account = new Account(client);

// Handler da rota de login
async function loginHandler(request: Request, data: z.infer<typeof loginSchema>) {
  try {
    const { email, password } = data;
    
    // Tentar fazer login com Appwrite
    const session = await account.createEmailPasswordSession(email, password);
    
    // Se chegou aqui, o login foi bem-sucedido
    // Obter informações do usuário
    const user = await account.get();
    
    // Registrar evento de login bem-sucedido
    await LoggingService.info(
      ActivityType.AUTH,
      `Login bem-sucedido: ${email}`,
      {
        userId: user.$id,
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined
      }
    );
    
    // Retornar resposta com cookie de sessão
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email
      }
    });
    
    // Adicionar cookie de sessão (em produção, usar opções seguras)
    response.cookies.set({
      name: 'userId',
      value: user.$id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });
    
    return response;
  } catch (error: any) {
    // Registrar tentativa de login falha
    await LoggingService.warning(
      ActivityType.AUTH,
      `Falha no login: ${data.email}`,
      {
        ip: request.headers.get('x-forwarded-for') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        metadata: {
          error: error.message
        }
      }
    );
    
    if (error.code === 401) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}

// Aplicar middlewares à rota de login
export const POST = withRateLimit(
  withValidation(loginSchema, loginHandler),
  {
    maxRequests: 5, // Limitar a 5 tentativas de login
    windowMs: 60 * 1000, // Em um período de 1 minuto
    type: 'ip',
    endpoint: 'auth/login',
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
  }
); 