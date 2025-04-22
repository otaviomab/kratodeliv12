import { NextRequest, NextResponse } from 'next/server';
import { LoggingService, ActivityType, LogLevel } from '@/lib/loggingService';

// Interface para armazenar informações de requisições
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// Configurações padrão
const DEFAULT_MAX_REQUESTS = 100; // 100 requisições
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minuto

/**
 * Implementação em memória do rate limiting
 * Adequado para ambientes com único servidor
 * Para produção com múltiplos servidores, seria necessário usar Redis ou similar
 */
export class RateLimiter {
  private static ipLimiter: Map<string, RateLimitInfo> = new Map();
  private static userLimiter: Map<string, RateLimitInfo> = new Map();
  private static endpointLimiter: Map<string, Map<string, RateLimitInfo>> = new Map();
  
  /**
   * Limpa entradas expiradas periodicamente
   */
  static startCleanupTask(): void {
    // Executar limpeza a cada 5 minutos
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }
  
  /**
   * Remove entradas expiradas das tabelas de rate limiting
   */
  private static cleanup(): void {
    const now = Date.now();
    
    // Limpar limitador por IP
    for (const [ip, info] of this.ipLimiter.entries()) {
      if (info.resetTime <= now) {
        this.ipLimiter.delete(ip);
      }
    }
    
    // Limpar limitador por usuário
    for (const [userId, info] of this.userLimiter.entries()) {
      if (info.resetTime <= now) {
        this.userLimiter.delete(userId);
      }
    }
    
    // Limpar limitador por endpoint
    for (const [endpoint, limiters] of this.endpointLimiter.entries()) {
      for (const [key, info] of limiters.entries()) {
        if (info.resetTime <= now) {
          limiters.delete(key);
        }
      }
      
      // Se não há mais entradas para este endpoint, remover o mapa
      if (limiters.size === 0) {
        this.endpointLimiter.delete(endpoint);
      }
    }
  }
  
  /**
   * Verifica se uma requisição excede o limite por IP
   */
  static ipIsRateLimited(ip: string, maxRequests: number = DEFAULT_MAX_REQUESTS, windowMs: number = DEFAULT_WINDOW_MS): boolean {
    return this.isRateLimited(this.ipLimiter, ip, maxRequests, windowMs);
  }
  
  /**
   * Verifica se uma requisição excede o limite por usuário
   */
  static userIsRateLimited(userId: string, maxRequests: number = DEFAULT_MAX_REQUESTS, windowMs: number = DEFAULT_WINDOW_MS): boolean {
    return this.isRateLimited(this.userLimiter, userId, maxRequests, windowMs);
  }
  
  /**
   * Verifica se uma requisição excede o limite por endpoint específico
   */
  static endpointIsRateLimited(
    endpoint: string,
    key: string,
    maxRequests: number = DEFAULT_MAX_REQUESTS,
    windowMs: number = DEFAULT_WINDOW_MS
  ): boolean {
    // Obter ou criar o mapa para este endpoint
    if (!this.endpointLimiter.has(endpoint)) {
      this.endpointLimiter.set(endpoint, new Map());
    }
    
    const limiters = this.endpointLimiter.get(endpoint)!;
    return this.isRateLimited(limiters, key, maxRequests, windowMs);
  }
  
  /**
   * Função genérica para verificar rate limiting
   */
  private static isRateLimited(
    limiter: Map<string, RateLimitInfo>,
    key: string,
    maxRequests: number,
    windowMs: number
  ): boolean {
    const now = Date.now();
    
    // Verificar se já existe uma entrada para esta chave
    if (limiter.has(key)) {
      const info = limiter.get(key)!;
      
      // Se o tempo de reset passou, reiniciar a contagem
      if (info.resetTime <= now) {
        limiter.set(key, {
          count: 1,
          resetTime: now + windowMs
        });
        return false;
      }
      
      // Incrementar contagem de requisições
      info.count += 1;
      
      // Verificar se excedeu o limite
      if (info.count > maxRequests) {
        return true; // Rate limited
      }
      
      return false;
    }
    
    // Se não existe, criar uma nova entrada
    limiter.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    
    return false;
  }
  
  /**
   * Obtém informações de espera para uma chave específica
   */
  static getWaitTime(limiter: Map<string, RateLimitInfo>, key: string): number {
    if (!limiter.has(key)) {
      return 0;
    }
    
    const info = limiter.get(key)!;
    const now = Date.now();
    
    if (info.resetTime <= now) {
      return 0;
    }
    
    return Math.ceil((info.resetTime - now) / 1000); // Em segundos
  }
}

// Iniciar tarefa de limpeza
if (typeof window === 'undefined') { // Verificar se está no servidor
  RateLimiter.startCleanupTask();
}

/**
 * Middleware para aplicar rate limiting em rotas
 * 
 * @param handler Função handler da requisição
 * @param options Opções de configuração
 * @returns Função que processa a requisição com rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    maxRequests?: number;
    windowMs?: number;
    type?: 'ip' | 'user' | 'endpoint';
    endpoint?: string;
    message?: string;
  } = {}
) {
  const {
    maxRequests = DEFAULT_MAX_REQUESTS,
    windowMs = DEFAULT_WINDOW_MS,
    type = 'ip',
    endpoint = 'default',
    message = 'Muitas requisições. Tente novamente mais tarde.'
  } = options;
  
  return async (req: NextRequest) => {
    // Obter IP da requisição
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
    
    // Obter ID do usuário (se disponível)
    const userId = req.cookies.get('userId')?.value || 'anonymous';
    
    // Verificar rate limiting com base no tipo
    let isLimited = false;
    let waitTime = 0;
    
    if (type === 'ip') {
      isLimited = RateLimiter.ipIsRateLimited(ip, maxRequests, windowMs);
      waitTime = RateLimiter.getWaitTime(RateLimiter['ipLimiter'], ip);
    } else if (type === 'user') {
      isLimited = RateLimiter.userIsRateLimited(userId, maxRequests, windowMs);
      waitTime = RateLimiter.getWaitTime(RateLimiter['userLimiter'], userId);
    } else if (type === 'endpoint') {
      // Para endpoints, usar combinação de IP e endpoint
      const key = `${ip}:${endpoint}`;
      isLimited = RateLimiter.endpointIsRateLimited(endpoint, key, maxRequests, windowMs);
      
      // Pegar o mapa específico do endpoint
      const endpointMap = RateLimiter['endpointLimiter'].get(endpoint);
      if (endpointMap) {
        waitTime = RateLimiter.getWaitTime(endpointMap, key);
      }
    }
    
    // Se excedeu o limite, retornar erro 429
    if (isLimited) {
      // Registrar o evento de rate limiting
      await LoggingService.warning(
        ActivityType.SYSTEM,
        `Rate limit excedido: ${type === 'ip' ? ip : (type === 'user' ? userId : endpoint)}`,
        {
          ip,
          userId: userId !== 'anonymous' ? userId : undefined,
          metadata: {
            type,
            endpoint,
            maxRequests,
            windowMs,
            waitTime
          }
        }
      );
      
      return NextResponse.json(
        {
          error: message,
          waitTime: `${waitTime} segundos`
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(waitTime),
            'X-RateLimit-Limit': String(maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(Date.now() / 1000) + waitTime)
          }
        }
      );
    }
    
    // Se não excedeu, continuar com o handler
    return handler(req);
  };
} 