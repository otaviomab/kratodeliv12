/**
 * Implementação de serviço de cache para otimizar consultas frequentes
 */

// Tipo para itens armazenados no cache
interface CacheItem<T> {
  data: T;
  expiry: number;
}

// Classe de serviço de cache
export class CacheService {
  private static cache: Map<string, CacheItem<any>> = new Map();
  
  /**
   * Obtém um item do cache
   * 
   * @param key Chave do item
   * @returns Dados armazenados ou null se não encontrado ou expirado
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    // Verificar se o item existe e não expirou
    if (item && item.expiry > Date.now()) {
      return item.data as T;
    }
    
    // Se não existe ou expirou, remover do cache
    if (item) {
      this.cache.delete(key);
    }
    
    return null;
  }
  
  /**
   * Armazena um item no cache
   * 
   * @param key Chave do item
   * @param data Dados a serem armazenados
   * @param ttlSeconds Tempo de vida em segundos (padrão: 5 minutos)
   */
  static set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expiry });
  }
  
  /**
   * Remove um item do cache
   * 
   * @param key Chave do item
   */
  static delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * Remove todos os itens do cache que começam com um determinado prefixo
   * Útil para invalidar caches relacionados
   * 
   * @param keyPrefix Prefixo da chave
   */
  static invalidateByPrefix(keyPrefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Obtém um item do cache, ou executa uma função para obter os dados
   * e armazena o resultado no cache
   * 
   * @param key Chave do item
   * @param fetchFn Função para obter os dados caso não estejam no cache
   * @param ttlSeconds Tempo de vida em segundos
   * @returns Dados do cache ou resultado da função
   */
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = 300
  ): Promise<T> {
    // Verificar se o item está no cache
    const cachedItem = this.get<T>(key);
    if (cachedItem !== null) {
      return cachedItem;
    }
    
    // Se não está no cache, buscar os dados
    const data = await fetchFn();
    
    // Armazenar no cache
    this.set(key, data, ttlSeconds);
    
    return data;
  }
  
  /**
   * Limpa todos os itens expirados do cache
   */
  static clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry <= now) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Limpa todo o cache
   */
  static clearAll(): void {
    this.cache.clear();
  }
  
  /**
   * Retorna estatísticas sobre o cache
   */
  static getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
} 