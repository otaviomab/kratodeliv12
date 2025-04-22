/**
 * Script para configurar a coleção de logs no Appwrite
 * 
 * Utilize este script para criar a coleção de logs e seus atributos
 * 
 * Como executar:
 * 1. Configure as variáveis de ambiente APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID e APPWRITE_API_KEY
 * 2. Execute: node scripts/setup-logs-collection.js
 */

const sdk = require('node-appwrite');

// Configurações
const DATABASE_ID = 'kratodeliv_db';
const LOGS_COLLECTION_ID = 'system_logs';

// Inicializar o cliente Appwrite
const client = new sdk.Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new sdk.Databases(client);

async function setupLogsCollection() {
  try {
    console.log('Iniciando configuração da coleção de logs...');

    // Verificar se a coleção já existe
    let collectionExists = false;
    try {
      await databases.getCollection(DATABASE_ID, LOGS_COLLECTION_ID);
      collectionExists = true;
      console.log('Coleção de logs já existe. Pulando criação da coleção.');
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }

    // Criar coleção se não existir
    if (!collectionExists) {
      console.log('Criando coleção de logs...');
      await databases.createCollection(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'Logs do Sistema',
        // Definir permissões apenas para acesso via API (servidor)
        []
      );
      console.log('Coleção de logs criada com sucesso.');
    }

    // Criar atributos
    try {
      console.log('Criando atributos da coleção...');

      // Nível do log (enum)
      await databases.createEnumAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'level',
        ['info', 'warning', 'error', 'critical'],
        true
      );
      console.log('- Atributo "level" criado.');

      // Tipo de atividade (enum)
      await databases.createEnumAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'activityType',
        ['auth', 'payment', 'order', 'user', 'establishment', 'product', 'admin', 'system'],
        true
      );
      console.log('- Atributo "activityType" criado.');

      // Mensagem (string)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'message',
        1024,
        true
      );
      console.log('- Atributo "message" criado.');

      // ID do usuário (string, opcional)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'userId',
        36,
        false
      );
      console.log('- Atributo "userId" criado.');

      // ID do estabelecimento (string, opcional)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'establishmentId',
        36,
        false
      );
      console.log('- Atributo "establishmentId" criado.');

      // ID do recurso (string, opcional)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'resourceId',
        36,
        false
      );
      console.log('- Atributo "resourceId" criado.');

      // Metadados (JSON, opcional)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'metadata',
        16384,
        false
      );
      console.log('- Atributo "metadata" criado.');

      // IP (string, opcional)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'ip',
        45,
        false
      );
      console.log('- Atributo "ip" criado.');

      // User Agent (string, opcional)
      await databases.createStringAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'userAgent',
        1024,
        false
      );
      console.log('- Atributo "userAgent" criado.');

      // Timestamp (datetime)
      await databases.createDatetimeAttribute(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'timestamp',
        true
      );
      console.log('- Atributo "timestamp" criado.');

      // Criar índices
      console.log('Criando índices...');

      // Índice para timestamp (busca por período)
      await databases.createIndex(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'timestamp_index',
        'key',
        ['timestamp'],
        []
      );
      console.log('- Índice "timestamp_index" criado.');

      // Índice para nível e tipo (busca por tipo de log)
      await databases.createIndex(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'level_activity_index',
        'key',
        ['level', 'activityType'],
        []
      );
      console.log('- Índice "level_activity_index" criado.');

      // Índice para usuário (busca por usuário)
      await databases.createIndex(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'user_index',
        'key',
        ['userId'],
        []
      );
      console.log('- Índice "user_index" criado.');

      // Índice para estabelecimento (busca por estabelecimento)
      await databases.createIndex(
        DATABASE_ID,
        LOGS_COLLECTION_ID,
        'establishment_index',
        'key',
        ['establishmentId'],
        []
      );
      console.log('- Índice "establishment_index" criado.');

      console.log('Configuração da coleção de logs concluída com sucesso!');
    } catch (error) {
      console.error('Erro ao criar atributos/índices:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao configurar coleção de logs:', error);
  }
}

// Executar o script
setupLogsCollection(); 