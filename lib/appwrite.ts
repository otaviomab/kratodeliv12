import { Client, Account, Databases, Storage, Teams, ID } from 'appwrite';

// Configurações do cliente Appwrite
const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const appwriteStorageId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '';

// Cliente da Appwrite
export const client = new Client();

// Configurar cliente
client
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

// Exportar serviços
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Database IDs
export const databaseId = appwriteDatabaseId;
export const storageId = appwriteStorageId;

// Coleções
export const Collections = {
  establishments: 'establishments',
  categories: 'categories',
  products: 'products',
  additionals: 'additionals',
  orders: 'orders',
  users: 'users'
};

// Funções utilitárias
export const createDocument = async (
  collectionId: string, 
  data: Record<string, unknown>, 
  permissions: string[] = []
) => {
  try {
    return await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data,
      permissions
    );
  } catch (error) {
    console.error('Erro ao criar documento:', error);
    throw error;
  }
};

export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>
) => {
  try {
    return await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data
    );
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    throw error;
  }
};

export const deleteDocument = async (
  collectionId: string,
  documentId: string
) => {
  try {
    return await databases.deleteDocument(
      databaseId,
      collectionId,
      documentId
    );
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    throw error;
  }
};

export const getDocument = async (
  collectionId: string,
  documentId: string
) => {
  try {
    return await databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    throw error;
  }
};

export const listDocuments = async (
  collectionId: string,
  queries: string[] = []
) => {
  try {
    return await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );
  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    throw error;
  }
}; 