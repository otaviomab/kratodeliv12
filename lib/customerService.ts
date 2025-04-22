import { databases } from './appwrite';
import { ID, Query } from 'appwrite';
import { Databases } from 'appwrite';
import { AppwriteException } from 'appwrite';

// Constantes
const DATABASE_ID = 'kratodeliv_db';
const CUSTOMERS_COLLECTION_ID = 'customers';
const ORDERS_COLLECTION_ID = 'orders';

// Interface para pedidos
interface Order {
  $id: string;
  total: number;
  createdAt: string;
  status: string;
  items?: {
    quantity: number;
    name: string;
  }[];
}

// Interface do Cliente
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  establishmentId: string;
  createdAt: string;
  updatedAt: string;
}

// Interface estendida com estatísticas
export interface CustomerWithStats extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'ativo' | 'inativo';
}

/**
 * Busca a lista de clientes por estabelecimento com filtros e ordenação
 */
export async function listCustomers(
  establishmentId: string,
  options: {
    search?: string;
    status?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ customers: CustomerWithStats[]; total: number }> {
  try {
    // Preparar queries de filtragem
    const queries = [
      Query.equal('establishmentId', establishmentId)
    ];
    
    // Adicionar busca por nome ou email
    if (options.search) {
      // Appwrite não suporta "OR" diretamente, então precisamos fazer isso no código
      // Buscamos por nome ou email com expressões regulares
      queries.push(Query.search('name', options.search));
    }
    
    // Filtrar por status (a ser implementado através de análise de pedidos recentes)
    
    try {
      // Recuperar total de documentos para paginação
      const totalDocuments = await databases.listDocuments(
        DATABASE_ID,
        CUSTOMERS_COLLECTION_ID,
        queries
      );
      
      // Adicionar paginação e ordenação
      if (options.limit) {
        queries.push(Query.limit(options.limit));
      }
      
      if (options.offset) {
        queries.push(Query.offset(options.offset));
      }
      
      // Buscar clientes
      const result = await databases.listDocuments(
        DATABASE_ID,
        CUSTOMERS_COLLECTION_ID,
        queries
      );
      
      // Agora precisamos enriquecer os dados com estatísticas de pedidos
      const customersWithStats = await Promise.all(
        result.documents.map(async doc => {
          const customer = doc as unknown as Customer;
          
          // Buscar pedidos do cliente para calcular estatísticas
          let orders = { documents: [], total: 0 };
          
          try {
            orders = await databases.listDocuments(
              DATABASE_ID,
              ORDERS_COLLECTION_ID,
              [
                Query.equal('customerId', customer.id),
                Query.equal('establishmentId', establishmentId)
              ]
            );
          } catch (_) {
            // Se não encontrar a coleção de pedidos, trata silenciosamente
            console.log('Aviso: Coleção de pedidos não encontrada ou vazia');
          }
          
          // Calcular totais
          const totalOrders = orders.documents.length;
          const totalSpent = orders.documents.reduce((acc, order) => 
            acc + ((order as unknown as Order).total || 0), 0);
          
          // Encontrar data do último pedido
          const lastOrder = orders.documents.length > 0 
            ? orders.documents.sort((a, b) => 
                new Date((b as unknown as Order).createdAt).getTime() - 
                new Date((a as unknown as Order).createdAt).getTime())[0]
            : null;
            
          const lastOrderDate = lastOrder ? (lastOrder as unknown as Order).createdAt : '';
          
          // Determinar status com base nos pedidos recentes (últimos 60 dias)
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
          
          const hasRecentOrders = lastOrder && new Date((lastOrder as unknown as Order).createdAt) > sixtyDaysAgo;
          const status = hasRecentOrders ? 'ativo' as const : 'inativo' as const;
          
          return {
            ...customer,
            totalOrders,
            totalSpent,
            lastOrderDate,
            status
          };
        })
      );
      
      // Realizar ordenação manual após enriquecimento dos dados
      if (options.sortField) {
        customersWithStats.sort((a, b) => {
          let comparison = 0;
          
          switch (options.sortField) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'email':
              comparison = a.email.localeCompare(b.email);
              break;
            case 'totalOrders':
              comparison = a.totalOrders - b.totalOrders;
              break;
            case 'totalSpent':
              comparison = a.totalSpent - b.totalSpent;
              break;
            case 'lastOrderDate':
              comparison = 
                new Date(a.lastOrderDate).getTime() - 
                new Date(b.lastOrderDate).getTime();
              break;
            case 'status':
              comparison = a.status.localeCompare(b.status);
              break;
            default:
              comparison = 0;
          }
          
          return options.sortDirection === 'desc' ? -comparison : comparison;
        });
      }
      
      // Filtrar por status após o cálculo
      if (options.status && options.status !== 'all') {
        return {
          customers: customersWithStats.filter(c => c.status === options.status as 'ativo' | 'inativo'),
          total: totalDocuments.total
        };
      }
      
      return {
        customers: customersWithStats,
        total: totalDocuments.total
      };
    } catch (innerError: unknown) {
      // Verificar se o erro é porque a coleção não existe
      if (innerError instanceof AppwriteException && innerError.message.includes('Collection with the requested ID could not be found')) {
        console.log('Aviso: Coleção de clientes não encontrada');
        // Retornar lista vazia se a coleção não existir
        return {
          customers: [],
          total: 0
        };
      } else {
        // Repassar outros erros
        throw innerError;
      }
    }
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    
    // Verificar se o erro é devido à coleção não existir
    if (error instanceof AppwriteException && error.message.includes('Collection with the requested ID could not be found')) {
      return {
        customers: [],
        total: 0
      };
    }
    
    throw new Error('Não foi possível listar os clientes.');
  }
}

/**
 * Busca detalhes de um cliente específico com estatísticas
 */
export async function getCustomer(customerId: string, establishmentId: string): Promise<CustomerWithStats | null> {
  try {
    // Buscar o cliente
    const customer = await databases.getDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      customerId
    ) as unknown as Customer;
    
    // Verificar se o cliente pertence ao estabelecimento
    if (customer.establishmentId !== establishmentId) {
      throw new Error('Cliente não pertence a este estabelecimento');
    }
    
    // Buscar pedidos do cliente para estatísticas
    let orders = { documents: [], total: 0 };
    
    try {
      orders = await databases.listDocuments(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        [
          Query.equal('customerId', customerId),
          Query.equal('establishmentId', establishmentId)
        ]
      );
    } catch (_) {
      // Se não encontrar a coleção de pedidos, trata silenciosamente
      console.log('Aviso: Coleção de pedidos não encontrada ou vazia');
    }
    
    // Calcular totais
    const totalOrders = orders.documents.length;
    const totalSpent = orders.documents.reduce((acc, order) => 
      acc + ((order as unknown as Order).total || 0), 0);
    
    // Encontrar data do último pedido
    const lastOrder = orders.documents.length > 0 
      ? orders.documents.sort((a, b) => 
          new Date((b as unknown as Order).createdAt).getTime() - 
          new Date((a as unknown as Order).createdAt).getTime())[0]
      : null;
      
    const lastOrderDate = lastOrder ? (lastOrder as unknown as Order).createdAt : '';
    
    // Determinar status com base nos pedidos recentes (últimos 60 dias)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const hasRecentOrders = lastOrder && new Date((lastOrder as unknown as Order).createdAt) > sixtyDaysAgo;
    const status = hasRecentOrders ? 'ativo' as const : 'inativo' as const;
    
    return {
      ...customer,
      totalOrders,
      totalSpent,
      lastOrderDate,
      status
    };
  } catch (error: unknown) {
    // Verificar se o erro é porque a coleção ou documento não existe
    if (error instanceof AppwriteException) {
      if (error.code === 404 || error.message.includes('could not be found')) {
        console.log('Aviso: Cliente não encontrado ou coleção não existente');
        return null;
      }
    }
    
    console.error('Erro ao buscar detalhes do cliente:', error);
    return null;
  }
}

/**
 * Busca o histórico de pedidos de um cliente
 */
export async function getCustomerOrders(
  id: string, 
  establishmentId: string,
  options: { page?: number; limit?: number } = {}
): Promise<{ orders: Order[], total: number }> {
  try {
    const page = options.page || 1;
    const limit = options.limit || 25;
    
    const queries = [
      Query.equal('customerId', id),
      Query.equal('establishmentId', establishmentId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset((page - 1) * limit)
    ];
    
    const orders = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      queries
    );

    return {
      orders: orders.documents as unknown as Order[],
      total: orders.total
    };
  } catch (error) {
    console.error('Erro ao buscar pedidos do cliente:', error);
    
    // Verificar se o erro é devido à coleção não existir
    if (error instanceof AppwriteException && error.message.includes('Collection with the requested ID could not be found')) {
      return {
        orders: [],
        total: 0
      };
    }
    
    throw new Error('Não foi possível buscar os pedidos do cliente.');
  }
}

/**
 * Cria um novo cliente (normalmente chamado durante a criação de um pedido)
 */
export async function createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
  try {
    const now = new Date();
    
    const result = await databases.createDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      ID.unique(),
      {
        ...customerData,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    );
    
    return result as unknown as Customer;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error('Não foi possível criar o cliente.');
  }
}

/**
 * Atualiza os dados de um cliente existente
 */
export async function updateCustomer(
  customerId: string,
  establishmentId: string,
  customerData: Partial<Omit<Customer, 'id' | 'establishmentId' | 'createdAt' | 'updatedAt'>>
): Promise<Customer> {
  try {
    // Verificar se o cliente existe e pertence ao estabelecimento
    const customer = await databases.getDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      customerId
    ) as unknown as Customer;
    
    if (customer.establishmentId !== establishmentId) {
      throw new Error('Cliente não pertence a este estabelecimento');
    }
    
    // Atualizar o cliente
    const now = new Date();
    
    const result = await databases.updateDocument(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      customerId,
      {
        ...customerData,
        updatedAt: now.toISOString()
      }
    );
    
    return result as unknown as Customer;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw new Error('Não foi possível atualizar os dados do cliente.');
  }
}

/**
 * Busca cliente por email ou telefone
 * Útil para verificar se um cliente já existe antes de criar um novo
 */
export async function findCustomerByEmailOrPhone(
  establishmentId: string,
  email?: string,
  phone?: string
): Promise<Customer | null> {
  if (!email && !phone) {
    throw new Error('É necessário fornecer um email ou telefone para a busca');
  }
  
  try {
    const queries = [Query.equal('establishmentId', establishmentId)];
    
    if (email) {
      queries.push(Query.equal('email', email));
    } else if (phone) {
      queries.push(Query.equal('phone', phone));
    }
    
    const result = await databases.listDocuments(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      queries
    );
    
    if (result.documents.length > 0) {
      return result.documents[0] as unknown as Customer;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar cliente por email ou telefone:', error);
    throw new Error('Não foi possível buscar o cliente.');
  }
} 