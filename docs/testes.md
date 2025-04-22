# Testes Automatizados - Cardápio Digital Krato

## Introdução

Este documento descreve os testes automatizados implementados para o projeto Cardápio Digital Krato, especialmente focados no módulo de validação automática de horário de estabelecimentos.

## Estrutura dos Testes

Os testes estão organizados na pasta `__tests__` seguindo a mesma estrutura da aplicação:

```
__tests__/
  ├── api/
  │   ├── functions/
  │   │   └── check-establishment-status.test.ts
  │   ├── cron/
  │   │   └── establishment-status.test.ts
  │   └── establishment/
  │       └── manual-status.test.ts
```

## Tecnologias Utilizadas

- **Jest**: Framework de testes
- **Testing Library**: Utilidades para testar componentes React
- **Mocks**: Simulações de dependências externas como o Appwrite

## Como Executar os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
yarn test

# Executar testes em modo de observação (durante desenvolvimento)
yarn test:watch

# Executar testes com relatório de cobertura
yarn test:coverage
```

### Interpretando os Resultados

Ao executar os testes, você verá um resultado similar a este:

```
PASS  __tests__/api/establishment/manual-status.test.ts
PASS  __tests__/api/cron/establishment-status.test.ts
PASS  __tests__/api/functions/check-establishment-status.test.ts

Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.043 s
```

- **PASS/FAIL**: Indica se todos os testes no arquivo passaram ou se algum falhou
- **Test Suites**: Número de arquivos de teste
- **Tests**: Número total de casos de teste individuais
- **Snapshots**: Testes de snapshot (não utilizados neste projeto)
- **Time**: Tempo total de execução

## Casos de Teste Implementados

### 1. Função `checkEstablishmentStatus`

Arquivo: `__tests__/api/functions/check-establishment-status.test.ts`

Testa a função principal que verifica e atualiza o status dos estabelecimentos:

- Atualizar para "aberto" quando dentro do horário de funcionamento
- Atualizar para "fechado" quando fora do horário
- Respeitar o override manual (não atualizar quando manualmente configurado)
- Ignorar estabelecimentos sem horários configurados
- Tratamento de erros da API

### 2. Endpoint de Cron Job

Arquivo: `__tests__/api/cron/establishment-status.test.ts`

Testa o endpoint que será chamado pelo cron job:

- Retornar sucesso quando o processamento for bem-sucedido
- Retornar erro quando o processamento falhar
- Verificar token de autorização (CRON_SECRET_TOKEN)
- Capturar e tratar exceções internas

### 3. Endpoint de Status Manual

Arquivo: `__tests__/api/establishment/manual-status.test.ts`

Testa o endpoint para atualização manual do status:

- Atualizar o status corretamente
- Permitir desativar o override
- Validar parâmetros (ID, isOpen)
- Verificar existência do estabelecimento
- Tratamento de erros internos

## Como Adicionar Novos Testes

### Convenções

1. Crie arquivos com o sufixo `.test.ts` ou `.test.tsx`
2. Organize os testes em pastas seguindo a estrutura da aplicação
3. Use a função `describe` para agrupar testes relacionados
4. Use a função `it` para casos de teste individuais
5. Use `beforeEach` e `afterEach` para configuração e limpeza

### Exemplo

```typescript
import { minhaFuncao } from '@/caminho/para/funcao';

describe('Nome do grupo de testes', () => {
  beforeEach(() => {
    // Configuração antes de cada teste
  });
  
  it('deve fazer algo específico', () => {
    // Arrange (preparar)
    const entrada = 'valor';
    
    // Act (agir)
    const resultado = minhaFuncao(entrada);
    
    // Assert (verificar)
    expect(resultado).toBe('valor esperado');
  });
});
```

## Mocks Implementados

Para evitar chamadas reais ao banco de dados e APIs externas, os seguintes mocks foram configurados:

1. **Appwrite Database**: `@/lib/appwrite`
2. **NextResponse**: `next/server`
3. **Request**: Polyfill global para testes no Node.js
4. **Date**: Mock para controlar datas/horas nos testes

### Exemplo de Mock do Appwrite

```typescript
jest.mock('@/lib/appwrite', () => ({
  databases: {
    listDocuments: jest.fn(),
    updateDocument: jest.fn(),
    getDocument: jest.fn()
  }
}));
```

## Dicas e Boas Práticas

1. **Isolar os testes**: Cada teste deve ser independente dos outros
2. **Mock de dependências externas**: Evite chamadas reais a APIs
3. **Limpar mocks**: Use `jest.clearAllMocks()` no `beforeEach`
4. **Testar casos de erro**: Não teste apenas o caminho feliz
5. **Verificar chamadas de funções**: Use `expect(fn).toHaveBeenCalledWith(...)`

## Solução de Problemas Comuns

### Erros com Mocks:

Se você encontrar erros como `Maximum call stack size exceeded`, pode ser um problema de recursão no mock. Solução:

```typescript
// Problema (recursão infinita):
jest.spyOn(global, 'Date').mockImplementation(() => new Date('2023-08-12T19:30:00Z'));

// Solução:
const mockDate = { /* mock manual sem recursão */ } as any;
jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
```

### Erros de Tipo TypeScript:

Adicione tipagens explícitas nos mocks:

```typescript
(minhaFuncao as jest.Mock).mockResolvedValue({ /* valor mockado */ });
```

## Integração com CI/CD

Os testes são executados automaticamente em ambientes de CI/CD quando configurados. Exemplo de configuração para GitHub Actions:

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'
  - name: Install dependencies
    run: yarn install
  - name: Run tests
    run: yarn test
```

## Recursos Adicionais

- [Documentação do Jest](https://jestjs.io/docs/getting-started)
- [Documentação do Testing Library](https://testing-library.com/docs/)
- [Guia de Mocks do Jest](https://jestjs.io/docs/mock-functions) 