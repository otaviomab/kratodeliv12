# Krato Cardápio Digital

Sistema de cardápio digital para restaurantes e estabelecimentos de alimentação, com painel administrativo e aplicação para clientes.

## Funcionalidades

### Painel Administrativo
- Gerenciamento de cardápio (categorias, produtos, adicionais)
- Configurações do estabelecimento
- Controle de pedidos
- Relatórios de vendas

### Aplicação Cliente
- Visualização do cardápio
- Realização de pedidos
- Acompanhamento de status

## Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Appwrite (BaaS)
- **Autenticação**: JWT com Appwrite Auth
- **Banco de Dados**: Appwrite Database
- **Armazenamento**: Appwrite Storage

## Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- Yarn
- Conta no Appwrite

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_STORAGE_ID=
```

### Instalação

```bash
# Instalar dependências
yarn install

# Executar o servidor de desenvolvimento
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do Projeto

- `/app` - Componentes de página (Next.js App Router)
- `/components` - Componentes reutilizáveis
- `/lib` - Utilitários e configurações
- `/types` - Definições de tipos TypeScript
- `/docs` - Documentação

## Contribuição

1. Faça um fork do projeto
2. Crie sua branch de recurso (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
