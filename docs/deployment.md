# Guia de Deployment do Cardápio Digital Krato

Este documento descreve o processo de deployment da aplicação Cardápio Digital Krato, abordando tanto o ambiente de desenvolvimento quanto produção.

## Pré-requisitos <a id="prerequisites"></a>

Antes de iniciar o processo de deployment, certifique-se de ter:

- Node.js 18.x ou superior
- Yarn instalado
- Uma conta no Vercel (para deployment em produção)
- Base de dados PostgreSQL
- Conta no Cloudinary (para armazenamento de imagens)
- Conta no provedor de pagamentos escolhido

## Variáveis de Ambiente <a id="env-vars"></a>

Crie um arquivo `.env.local` para desenvolvimento e configure as variáveis de ambiente necessárias no painel do Vercel para produção:

```
# Base de dados
DATABASE_URL=postgresql://usuario:senha@host:porta/banco

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=seu-secret-seguro

# JWT
JWT_SECRET=seu-jwt-secret
JWT_EXPIRY=1d

# Cloudinary (imagens)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=seu-api-secret

# Pagamentos
PAYMENT_GATEWAY_API_KEY=sua-api-key
PAYMENT_WEBHOOK_SECRET=seu-webhook-secret
NEXT_PUBLIC_PAYMENT_PUBLIC_KEY=sua-public-key
```

## Ambiente de Desenvolvimento <a id="development"></a>

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/cardapio-digital-krato.git
cd cardapio-digital-krato
```

2. Instale as dependências:
```bash
yarn install
```

3. Configure o banco de dados:
```bash
npx prisma migrate dev --name init
```

4. Execute a aplicação:
```bash
yarn dev
```

### Scripts de Desenvolvimento

- `yarn dev`: Inicia o servidor de desenvolvimento
- `yarn build`: Cria a build de produção
- `yarn start`: Inicia a aplicação a partir da build
- `yarn lint`: Executa o linter
- `yarn test`: Executa os testes
- `yarn prisma:migrate`: Executa as migrações do banco de dados
- `yarn prisma:studio`: Abre o Prisma Studio para gerenciamento do banco de dados

## Deployment em Produção <a id="production"></a>

### Vercel (Recomendado)

O método mais simples para deployment é usando a plataforma Vercel, que é otimizada para aplicações Next.js.

1. Crie uma conta no [Vercel](https://vercel.com)
2. Importe o projeto do GitHub, GitLab ou Bitbucket
3. Configure as variáveis de ambiente listadas acima
4. Configure o domínio personalizado (opcional)
5. Ative a integração contínua para deploys automáticos a partir de commits na branch principal

### Docker (Alternativa)

Para deployment usando Docker:

1. Construa a imagem Docker:
```bash
docker build -t cardapio-digital-krato .
```

2. Execute o container:
```bash
docker run -p 3000:3000 --env-file .env.production cardapio-digital-krato
```

O `Dockerfile` já está configurado no projeto:

```Dockerfile
FROM node:18-alpine AS base

# Instala dependências apenas
FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Etapa de build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Etapa de produção
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## Configuração do Banco de Dados <a id="database-setup"></a>

### Provedor de Banco de Dados

Recomendamos utilizar um dos seguintes provedores de PostgreSQL:

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Neon](https://neon.tech/)

### Migrações em Produção

Após o primeiro deployment, execute as migrações do banco de dados:

```bash
# Via CLI da Vercel
vercel env pull
npx prisma migrate deploy
```

Ou configure um script de deployment na Vercel:

```json
{
  "build": {
    "env": {
      "DATABASE_URL": "@database_url"
    },
    "command": "prisma migrate deploy && next build"
  }
}
```

## Configuração do Cloudinary <a id="cloudinary"></a>

1. Crie uma conta no [Cloudinary](https://cloudinary.com/)
2. Crie um novo preset de upload não autenticado
3. Configure as variáveis de ambiente com suas credenciais
4. Ajuste as políticas de upload para permitir apenas imagens

## Monitoramento e Logs <a id="monitoring"></a>

### Vercel Analytics

Ative o Vercel Analytics no painel de controle para monitorar:
- Performance da aplicação
- Comportamento do usuário
- Erros e exceções

### Logging

Configure um sistema de logging:

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
    // Adicionar integração com serviço de logs como Sentry ou LogRocket
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Adicionar integração com serviço de logs
  }
};
```

### Monitoramento de Erros

Integre o [Sentry](https://sentry.io) para monitoramento de erros em produção.

## CI/CD <a id="cicd"></a>

### GitHub Actions

Configuração básica para CI/CD com GitHub Actions:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      - name: Lint
        run: yarn lint
      - name: Test
        run: yarn test

  deploy:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Backups <a id="backups"></a>

Configure backups regulares do banco de dados:

```bash
# Script de backup (exemplo para PostgreSQL)
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -b -v -f "backup_$TIMESTAMP.dump"
```

Automatize com um scheduler ou use recursos do provedor de banco de dados.

## Escalabilidade <a id="scalability"></a>

A aplicação está configurada para escalar automaticamente na Vercel:

- Cache estático para assets
- Edge Functions para melhor performance global
- Image Optimization para otimização de imagens

Para volumes maiores, considere:

- Implementar cache Redis para dados frequentemente acessados
- Utilizar CDN para arquivos estáticos
- Implementar padrões de design para alta disponibilidade

## Troubleshooting <a id="troubleshooting"></a>

### Problemas Comuns

1. **Falha nas Migrações**:
   - Verifique se DATABASE_URL está corretamente configurado
   - Execute `npx prisma migrate resolve` para resolver migrações com problemas

2. **Erro 500 em Produção**:
   - Verifique os logs no painel da Vercel
   - Confirme se todas as variáveis de ambiente estão configuradas

3. **Uploads de Imagem Falham**:
   - Verifique as credenciais do Cloudinary
   - Confirme se o preset de upload está configurado corretamente

4. **Problemas de Autenticação**:
   - Verifique se NEXTAUTH_URL e NEXTAUTH_SECRET estão configurados
   - Confirme se JWT_SECRET está definido

## Checklist de Deployment <a id="checklist"></a>

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Migrações do banco de dados executadas
- [ ] Testes automatizados passando
- [ ] Build completada sem erros
- [ ] Uploads de imagem funcionando
- [ ] Integração de pagamentos testada
- [ ] Rotas protegidas funcionando
- [ ] Monitoramento e logs configurados
- [ ] Backups automáticos configurados
- [ ] Domínio personalizado configurado (opcional)
- [ ] SSL/TLS ativado 