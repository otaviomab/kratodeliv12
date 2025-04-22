# Documentação: Segurança e Otimização

Este documento fornece detalhes sobre as implementações de segurança e otimização no backend do Cardápio Digital.

## Índice

1. [Validação de Dados](#validacao)
2. [Permissões Multi-tenant](#multi-tenant)
3. [Cache](#cache)
4. [Sistema de Logs](#logs)
5. [Proteção contra Abusos (Rate Limiting)](#rate-limiting)
6. [Scripts de Configuração](#scripts)

## 1. Validação de Dados {#validacao}

### Descrição
Middleware para validar dados de entrada usando Zod antes do processamento das requisições.

### Implementação
- Localizado em `middleware/withValidation.ts`
- Utiliza a biblioteca Zod para esquemas de validação
- Retorna erros detalhados para o cliente em caso de dados inválidos

### Como Usar

```typescript
import { z } from 'zod';
import { withValidation } from '@/middleware/withValidation';

// Definir esquema de validação
const meuEsquema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  idade: z.number().min(18, 'Deve ser maior de idade')
});

// Handler da rota
async function minhaRota(req: NextRequest, data: z.infer<typeof meuEsquema>) {
  // Os dados já foram validados aqui
  // Implementação da rota...
}

// Aplicar middleware à rota
export const POST = withValidation(meuEsquema, minhaRota);
```

## 2. Permissões Multi-tenant {#multi-tenant}

### Descrição
Middleware para verificar se o usuário tem permissão para acessar recursos específicos, garantindo que cada usuário acesse apenas seus próprios dados.

### Implementação
- Localizado em `middleware/withMultiTenantAuth.ts`
- Verifica se o usuário atual tem permissão para acessar o recurso solicitado
- Suporta diferentes tipos de recursos (estabelecimento, menu, pedido, cliente)

### Como Usar

```typescript
import { withMultiTenantAuth } from '@/middleware/withMultiTenantAuth';

// Handler da rota
async function buscarPedido(req: NextRequest) {
  // A verificação de permissão já foi realizada
  // Implementação da rota...
}

// Aplicar middleware à rota
export const GET = withMultiTenantAuth(
  'order', // Tipo de recurso
  'id',    // Nome do parâmetro que contém o ID do recurso
  buscarPedido // Handler
);
```

## 3. Cache {#cache}

### Descrição
Serviço para armazenar em cache resultados de consultas frequentes, reduzindo a carga no banco de dados.

### Implementação
- Localizado em `lib/cacheService.ts`
- Cache em memória com TTL (Time To Live) configurável
- Suporte para invalidação de cache por prefixo de chave

### Como Usar

```typescript
import { CacheService } from '@/lib/cacheService';

// Exemplo 1: Armazenar dados no cache
CacheService.set('produto:123', produtoData, 300); // TTL de 5 minutos

// Exemplo 2: Obter dados do cache
const produtoEmCache = CacheService.get<ProdutoType>('produto:123');

// Exemplo 3: getOrSet (padrão mais comum)
const produtos = await CacheService.getOrSet(
  `estabelecimento:${estabelecimentoId}:produtos`,
  async () => {
    // Esta função só é executada se os dados não estiverem no cache
    return await databases.listDocuments(
      'kratodeliv_db',
      'products',
      [Query.equal('establishmentId', estabelecimentoId)]
    );
  },
  600 // TTL de 10 minutos
);

// Exemplo 4: Invalidar cache após atualização
await databases.updateDocument(
  'kratodeliv_db',
  'products',
  produtoId,
  produtoAtualizado
);

// Invalidar cache relacionado ao produto
CacheService.delete(`produto:${produtoId}`);
// Invalidar todos os caches relacionados aos produtos deste estabelecimento
CacheService.invalidateByPrefix(`estabelecimento:${estabelecimentoId}:produtos`);
```

## 4. Sistema de Logs {#logs}

### Descrição
Sistema para registrar operações críticas, erros e atividades importantes do sistema.

### Implementação
- Localizado em `lib/loggingService.ts`
- Suporta diferentes níveis de log (INFO, WARNING, ERROR, CRITICAL)
- Registra logs no console e persiste no Appwrite Database
- Configurável por ambiente (produção, desenvolvimento, teste)

### Como Usar

```typescript
import { LoggingService, ActivityType } from '@/lib/loggingService';

// Registrar informação
await LoggingService.info(
  ActivityType.ORDER,
  'Pedido criado com sucesso',
  {
    userId: user.id,
    establishmentId: estabelecimento.id,
    resourceId: pedido.id,
    metadata: { valor: pedido.total, itens: pedido.items.length }
  }
);

// Registrar aviso
await LoggingService.warning(
  ActivityType.PAYMENT,
  'Tentativa de pagamento recusada',
  {
    userId: user.id,
    establishmentId: estabelecimento.id,
    metadata: { motivo: 'Cartão recusado', valor: pagamento.valor }
  }
);

// Registrar erro
await LoggingService.error(
  ActivityType.SYSTEM,
  'Erro ao processar pedido',
  {
    resourceId: pedido.id,
    metadata: { error: error.message, stack: error.stack }
  }
);

// Registrar evento crítico
await LoggingService.critical(
  ActivityType.SYSTEM,
  'Falha crítica no sistema de pagamentos',
  {
    metadata: { error: error.message, impacto: 'Todos os estabelecimentos' }
  }
);
```

## 5. Proteção contra Abusos (Rate Limiting) {#rate-limiting}

### Descrição
Middleware para limitar o número de requisições por IP, usuário ou endpoint específico em um determinado período de tempo.

### Implementação
- Localizado em `middleware/rateLimiter.ts`
- Implementação em memória (para ambiente com servidor único)
- Suporta diferentes tipos de limitação (por IP, por usuário, por endpoint)
- Integrado com o sistema de logs para registrar abusos

### Como Usar

```typescript
import { withRateLimit } from '@/middleware/rateLimiter';

// Handler da rota
async function loginHandler(req: NextRequest) {
  // Implementação da rota...
}

// Aplicar rate limiting à rota de login (5 tentativas por minuto por IP)
export const POST = withRateLimit(
  loginHandler,
  {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minuto
    type: 'ip',
    endpoint: 'auth/login',
    message: 'Muitas tentativas de login. Tente novamente em alguns minutos.'
  }
);

// Exemplo para API pública de consulta (100 requisições por minuto por IP)
export const GET = withRateLimit(
  consultarCardapioHandler,
  {
    maxRequests: 100,
    windowMs: 60 * 1000,
    type: 'ip'
  }
);

// Exemplo para API de relatórios (usuário específico)
export const GET = withRateLimit(
  gerarRelatorioHandler,
  {
    maxRequests: 10,
    windowMs: 5 * 60 * 1000, // 5 minutos
    type: 'user',
    message: 'Limite de relatórios atingido. Aguarde alguns minutos.'
  }
);
```

## 6. Scripts de Configuração {#scripts}

### Setup da Coleção de Logs

O projeto inclui um script para configurar a coleção de logs no banco de dados Appwrite:

```bash
# Configurar variáveis de ambiente
export APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
export APPWRITE_PROJECT_ID=seu-project-id
export APPWRITE_API_KEY=sua-api-key

# Executar script
node scripts/setup-logs-collection.js
```

O script cria:
- Coleção `system_logs` no banco `kratodeliv_db`
- Atributos necessários (level, message, timestamp, etc.)
- Índices para consultas otimizadas

## Melhores Práticas

1. **Validação de Dados**
   - Sempre valide dados de entrada em todas as rotas de API
   - Defina esquemas Zod claros e com mensagens de erro úteis

2. **Permissões**
   - Sempre verifique permissões antes de acessar recursos
   - Aplique o princípio do menor privilégio (acesso apenas ao necessário)

3. **Cache**
   - Use cache para consultas frequentes e que não mudam com frequência
   - Lembre-se de invalidar o cache quando os dados são alterados
   - Defina TTLs apropriados para cada tipo de dado

4. **Logs**
   - Registre operações críticas, erros e atividades importantes
   - Inclua contexto suficiente nos logs para depuração
   - Não registre informações sensíveis (senhas, tokens)

5. **Rate Limiting**
   - Aplique limites mais restritos para operações sensíveis (login, pagamento)
   - Configure limites diferentes para usuários autenticados e anônimos
   - Monitore abusos para ajustar limites conforme necessário 