import { databases } from '@/lib/appwrite';
import { ID } from 'appwrite';

// Enum para níveis de log
export enum LogLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Enum para tipos de atividade
export enum ActivityType {
  AUTH = 'auth',
  PAYMENT = 'payment',
  ORDER = 'order',
  USER = 'user',
  ESTABLISHMENT = 'establishment',
  PRODUCT = 'product',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

// Interface para um evento de log
export interface LogEvent {
  level: LogLevel;
  activityType: ActivityType;
  message: string;
  userId?: string;
  establishmentId?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

// Configurações
const DATABASE_ID = 'kratodeliv_db';
const LOGS_COLLECTION_ID = 'system_logs';

/**
 * Serviço para registro de logs de operações críticas
 */
export class LoggingService {
  /**
   * Determina se um determinado nível de log deve ser registrado
   * baseado no ambiente atual
   */
  private static shouldLog(level: LogLevel): boolean {
    const env = process.env.NODE_ENV || 'development';
    
    // Em produção, registrar todos os logs
    if (env === 'production') {
      return true;
    }
    
    // Em desenvolvimento, registrar apenas warnings, erros e críticos
    if (env === 'development') {
      return level !== LogLevel.INFO;
    }
    
    // Em testes, registrar apenas erros e críticos
    if (env === 'test') {
      return level === LogLevel.ERROR || level === LogLevel.CRITICAL;
    }
    
    return true;
  }
  
  /**
   * Registra um evento no log do sistema
   */
  static async log(event: Omit<LogEvent, 'timestamp'>): Promise<void> {
    try {
      // Verificar se o log deve ser registrado
      if (!this.shouldLog(event.level)) {
        return;
      }
      
      // Adicionar timestamp atual
      const timestamp = new Date().toISOString();
      
      // Criar objeto completo do log
      const logEntry: LogEvent = {
        ...event,
        timestamp
      };
      
      // Registrar no console para facilitar depuração local
      this.logToConsole(logEntry);
      
      // Registrar no banco de dados (Appwrite)
      await this.persistLog(logEntry);
    } catch (error) {
      // Em caso de erro ao registrar log, pelo menos imprimir no console
      console.error('Erro ao registrar log:', error);
      console.error('Evento original:', event);
    }
  }
  
  /**
   * Registra um log no console
   */
  private static logToConsole(event: LogEvent): void {
    const timestamp = new Date(event.timestamp).toLocaleString();
    const prefix = `[${timestamp}] [${event.level.toUpperCase()}] [${event.activityType}]`;
    
    switch (event.level) {
      case LogLevel.INFO:
        console.info(`${prefix} ${event.message}`);
        break;
      case LogLevel.WARNING:
        console.warn(`${prefix} ${event.message}`);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(`${prefix} ${event.message}`);
        if (event.metadata) {
          console.error('Detalhes:', event.metadata);
        }
        break;
    }
  }
  
  /**
   * Persiste um log no banco de dados
   */
  private static async persistLog(event: LogEvent): Promise<void> {
    try {
      await databases.createDocument(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        ID.unique(),
        event
      );
    } catch (error) {
      // Se falhar ao persistir no banco, pelo menos já foi registrado no console
      console.error('Erro ao persistir log no banco de dados:', error);
    }
  }
  
  /**
   * Registra um evento de informação
   */
  static async info(
    activityType: ActivityType,
    message: string,
    details?: Omit<LogEvent, 'level' | 'activityType' | 'message' | 'timestamp'>
  ): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      activityType,
      message,
      ...details
    });
  }
  
  /**
   * Registra um evento de aviso
   */
  static async warning(
    activityType: ActivityType,
    message: string,
    details?: Omit<LogEvent, 'level' | 'activityType' | 'message' | 'timestamp'>
  ): Promise<void> {
    await this.log({
      level: LogLevel.WARNING,
      activityType,
      message,
      ...details
    });
  }
  
  /**
   * Registra um evento de erro
   */
  static async error(
    activityType: ActivityType,
    message: string,
    details?: Omit<LogEvent, 'level' | 'activityType' | 'message' | 'timestamp'>
  ): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      activityType,
      message,
      ...details
    });
  }
  
  /**
   * Registra um evento crítico
   */
  static async critical(
    activityType: ActivityType,
    message: string,
    details?: Omit<LogEvent, 'level' | 'activityType' | 'message' | 'timestamp'>
  ): Promise<void> {
    await this.log({
      level: LogLevel.CRITICAL,
      activityType,
      message,
      ...details
    });
  }
} 