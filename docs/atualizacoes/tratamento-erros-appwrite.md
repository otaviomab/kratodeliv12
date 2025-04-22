# Tratamento de Erros com Appwrite

## Problemas Identificados e Soluções

### Erro: Cliente Appwrite não Disponível em Algumas Funções

**Problema**: Na função `getCustomerOrders` do arquivo `lib/customerService.ts`, foi identificado um erro onde a variável `appwriteClient` não está definida, resultando no erro de lint:

```
Err | Cannot find name 'appwriteClient'.
```

**Solução**: 

Ao invés de criar uma nova instância do cliente Databases, a função deve utilizar o cliente pré-configurado que é importado no topo do arquivo. Modifique a função conforme abaixo:

```typescript
export async function getCustomerOrders(
  id: string, 
  establishmentId: string,
  options: { page?: number; limit?: number } = {}
): Promise<{ orders: Order[], total: number }> {
  try {
    // Use o cliente databases já importado no topo do arquivo
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
    if (error instanceof AppwriteException && 
        error.message.includes('Collection with the requested ID could not be found')) {
      return {
        orders: [],
        total: 0
      };
    }
    
    throw new Error('Não foi possível buscar os pedidos do cliente.');
  }
}
```

### Tratamento de Variáveis Não Utilizadas

**Problema**: O linter está indicando que a variável `orderError` é definida mas nunca utilizada em dois blocos de código diferentes:

```
'orderError' is defined but never used.
```

**Solução**:

Uma vez que não precisamos da variável para nenhuma lógica, podemos usar o padrão de underscore (`_`) para indicar que estamos deliberadamente ignorando essa variável:

```typescript
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
```

### Uso de `any` em Tratamento de Erros

**Problema**: O linter está alertando sobre o uso de `any` em declarações de erros:

```
Unexpected any. Specify a different type.
```

**Solução**:

Utilize o tipo `unknown` e faça verificações de tipo antes de acessar propriedades, ou crie uma interface específica para o tipo de erro que você espera:

```typescript
// Opção 1: Usar unknown com verificação de tipo
try {
  // código que pode lançar erro
} catch (error: unknown) {
  if (error instanceof AppwriteException) {
    // agora podemos acessar error.message com segurança
    if (error.message.includes('Collection with the requested ID could not be found')) {
      // tratamento específico
    }
  }
  // tratamento genérico
}

// Opção 2: Criar interface para o erro
interface AppwriteError {
  code?: number;
  message?: string;
  response?: {
    message?: string;
  };
}

try {
  // código que pode lançar erro
} catch (error) {
  const appwriteError = error as AppwriteError;
  if (appwriteError.code === 404 || 
      appwriteError.message?.includes('could not be found') || 
      appwriteError.response?.message?.includes('could not be found')) {
    // tratamento específico
  }
}
```

## Boas Práticas para Tratamento de Erros do Appwrite

1. **Sempre verifique o tipo de erro antes de acessar propriedades**
2. **Use mensagens de erro específicas e informativas nos logs**
3. **Retorne valores padrão adequados quando uma coleção não existir**
4. **Trace um plano para criação das coleções necessárias no início da aplicação**
5. **Documente os tratamentos de erro para facilitar a manutenção** 