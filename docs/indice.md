# Índice da Documentação - Cardápio Digital Krato

## Visão Geral
- [Introdução ao Sistema](mdc:#introducao)
- [Arquitetura](mdc:#arquitetura)

## Appwrite Backend
- [Configuração do Banco de Dados](mdc:#configuracao-banco)
- [Coleções e Estrutura](mdc:#colecoes-estrutura)
- [Índices e Relacionamentos](mdc:#indices-relacionamentos)
- [Autenticação com Appwrite](mdc:#autenticacao-appwrite)

## Painel Administrativo
- [Gerenciamento de Cardápio](mdc:#cardapio)
  - [Categorias](mdc:#categorias)
  - [Produtos](mdc:#produtos)
  - [Gerenciamento de Adicionais](mdc:#adicionais)
- [Gerenciamento de Pedidos](mdc:#pedidos)
  - [Listagem de Pedidos](mdc:#listagem-pedidos)
  - [Detalhes de Pedido](mdc:#detalhes-pedido)
  - [Status de Pedidos](mdc:#status-pedidos)
- [Planos de Assinatura](mdc:#planos-assinatura)
  - [Funcionalidades por Plano](mdc:#funcionalidades-plano)
  - [Gerenciamento de Assinaturas](mdc:#gerenciamento-assinaturas)
  - [Limitações Baseadas no Plano](mdc:#limitacoes-plano)
- [Configurações do Estabelecimento](mdc:#configuracoes)
  - [Informações Gerais](mdc:#informacoes-gerais)
  - [Gerenciamento de Endereço](mdc:#gerenciamento-endereco)
  - [Horários de Funcionamento](mdc:#horarios-funcionamento)
  - [Configurações de Entrega](mdc:#configuracoes-entrega)
  - [Métodos de Pagamento](mdc:#metodos-pagamento)
  - [Integração com WhatsApp](mdc:#integracao-whatsapp)
- [Relatórios e Análises](docs/reports.md)
  - [Vendas](docs/reports.md#vendas)
  - [Produtos Populares](docs/reports.md#produtos-populares)
  - [Clientes Frequentes](docs/reports.md#clientes)

## API e Backend
- [Rotas de API](mdc:#rotas-api)
- [Modelos de Dados](mdc:#modelos)
- [APIs do Módulo de Cardápio](documentacao.md#api-cardapio)
  - [API de Categorias](documentacao.md#api-categorias)
  - [Reordenação de Categorias](documentacao.md#reordenacao-categorias)  
  - [API de Produtos](documentacao.md#api-produtos)
  - [Upload de Imagens de Produtos](documentacao.md#upload-imagens-produtos)
  - [Gerenciamento de Adicionais](documentacao.md#gerenciamento-adicionais)
- [Endpoints de Estabelecimento](documentacao.md#api-estabelecimento)
  - [GET /api/establishment/:slug](documentacao.md#api-estabelecimento)
  - [POST /api/establishment](documentacao.md#api-estabelecimento)
  - [PUT /api/establishment/:id](documentacao.md#api-estabelecimento)
  - [DELETE /api/establishment/:id](documentacao.md#api-estabelecimento)
  - [Validação Automática de Horário](documentacao.md#estabelecimento-validacao-automatica)
- [API do Módulo de Configurações](documentacao.md#api-configuracoes)
  - [API de Informações Gerais](documentacao.md#api-informacoes-gerais)
  - [API de Endereço](documentacao.md#api-endereco)
  - [API de Horários de Funcionamento](documentacao.md#api-horarios)
  - [API de Configurações de Entrega](documentacao.md#api-entrega)
  - [API de Métodos de Pagamento](documentacao.md#api-pagamentos)
  - [API de Integração com WhatsApp](documentacao.md#api-whatsapp)
- [API do Módulo de Planos de Assinatura](documentacao.md#api-planos)
  - [Listar Planos Disponíveis](documentacao.md#api-listar-planos)
  - [Obter Detalhes de um Plano](documentacao.md#api-detalhes-plano)
  - [Obter Assinatura de Estabelecimento](documentacao.md#api-assinatura-estabelecimento)
  - [Atualizar Assinatura](documentacao.md#api-atualizar-assinatura)
  - [Cancelar Assinatura](documentacao.md#api-cancelar-assinatura)
  - [Verificar Acesso a Recursos](documentacao.md#api-verificar-acesso)
  - [Verificar Limites de Produtos](documentacao.md#api-verificar-limites)
- [Endpoints de Carrinho](documentacao.md#api-carrinho)
- [Módulo de Pedidos](documentacao.md#modulo-pedidos)
  - [Serviço de Pedidos (OrderService)](documentacao.md#ordem-service)
  - [Rotas de API para Pedidos](documentacao.md#api-orders)
  - [Notificações em Tempo Real](documentacao.md#notificacoes-tempo-real)
  - [Estatísticas de Pedidos](documentacao.md#estatisticas-pedidos)

## Frontend Cliente
- [Página de Cardápio](mdc:#pagina-cardapio)
- [Carrinho de Compras](mdc:#carrinho)
- [Finalização de Pedido](mdc:#finalizacao)

## Estrutura do Projeto
- [Arquitetura](documentacao.md#arquitetura)
- [Tecnologias Utilizadas](documentacao.md#tecnologias)
- [Componentes Principais](documentacao.md#componentes)
- [Páginas](documentacao.md#paginas)

## Configuração
- [Configuração Inicial](documentacao.md#configuracao-inicial)
- [Variáveis de Ambiente](documentacao.md#variaveis-ambiente)

## UI/UX
- [Layouts](documentacao.md#layouts)
- [Estilização](documentacao.md#estilizacao)
- [Componentes UI](documentacao.md#componentes-ui)

## Funcionalidades
- [Dashboard](mdc:#dashboard)
- [Cardápio](mdc:#cardapio)
- [Pedidos](mdc:#pedidos)
- [Clientes](mdc:#clientes)
  - [Listagem de Clientes](mdc:#listagem-clientes)
  - [Detalhes de Cliente](mdc:#detalhes-cliente)
  - [Pedidos de Cliente](mdc:#pedidos-cliente)
  - [Tratamento de Erros](mdc:#clientes-tratamento-erros)
- [Configurações](mdc:#configuracoes)
- [Painel Administrativo](documentacao.md#painel-administrativo)
- [Dashboard Administrativo](documentacao.md#dashboard-administrativo)
- [Sistema de Gerenciamento de Pedidos](documentacao.md#sistema-gerenciamento-pedidos)
- [Sistema de Autenticação](documentacao.md#sistema-autenticacao)

## Utilitários
- [Formatadores](documentacao.md#formatadores)
- [Tipos e Interfaces](documentacao.md#tipos-interfaces)

## Navegação
- [Estrutura de Rotas](documentacao.md#estrutura-rotas)
- [Navegação Dinâmica](documentacao.md#navegacao-dinamica)

## Atualizações e Mudanças
- [Atualização para Tailwind CSS v4 (Janeiro/2024)](./atualizacoes/2024-01-tailwind-v4.md)
- [Implementação de APIs do Módulo de Cardápio (Maio/2024)](./atualizacoes/2024-05-api-cardapio.md)
- [Implementação do Módulo de Pedidos (Junho/2024)](./atualizacoes/2024-06-modulo-pedidos.md)
- [Implementação do Módulo de Planos de Assinatura (Julho/2024)](./atualizacoes/2024-07-modulo-planos.md)
- [Tratamento de Erros com Appwrite (Julho/2024)](./atualizacoes/tratamento-erros-appwrite.md)

## Autenticação
- [Visão Geral da Autenticação](mdc:#autenticacao)
- [Página de Login](mdc:#login)
- [Página de Cadastro](mdc:#cadastro)
- [Página de Recuperação de Senha](mdc:#recuperacao-senha)
- [Componentes Compartilhados](mdc:#componentes-auth)
- [Temas](mdc:#temas-auth)
- [Responsividade](mdc:#responsividade-auth)

## Cardápio
- [Visão Geral do Cardápio](mdc:#cardapio)
- [Listagem de Categorias](mdc:#listagem-categorias)
- [Ações por Categoria](mdc:#acoes-categoria)
- [Busca e Filtragem](mdc:#busca-filtragem)
- [Gerenciamento de Categorias](mdc:#gerenciamento-categorias)
- [Temas](mdc:#temas-cardapio)
- [Responsividade](mdc:#responsividade-cardapio)
- [Estados de Loading](mdc:#loading-cardapio)
- [Produtos](mdc:#cardapio-produtos)
- [Upload de Imagens](mdc:#cardapio-upload-imagens)

## Estrutura do Projeto
- [Organização de Diretórios](mdc:#estrutura-diretorios)
- [Grupos de Rotas](mdc:#estrutura-grupos-rotas)
- [Componentes](mdc:#estrutura-componentes)
- [Utilitários](mdc:#estrutura-utils)
- [Tipos](mdc:#estrutura-tipos)

## Temas e Estilos
- [Cores](mdc:#cores)
- [Tipografia](mdc:#tipografia)
- [Componentes UI](mdc:#componentes-ui)
- [Responsividade](mdc:#responsividade)

## APIs e Integrações
- [Appwrite](mdc:#appwrite)
  - [Autenticação com Appwrite v17](mdc:#autenticacao-appwrite)
- [Serviços Externos](mdc:#servicos-externos)

## Deployment
- [Ambiente de Desenvolvimento](mdc:#ambiente-dev)
- [Ambiente de Produção](mdc:#ambiente-prod)
- [CI/CD](mdc:#ci-cd)

## Interface do Usuário
- [Padrões de UI](mdc:#padroes-de-ui)

## Páginas do Admin
- [Página de Clientes](mdc:#pagina-de-clientes)
- [Página de Relatórios](mdc:#pagina-de-relatorios)
- [Página de Planos](mdc:#pagina-planos)

## Dashboard Admin
- [Estilização do Dashboard](mdc:#estilizacao-dashboard)
  - [Página de Clientes](mdc:#pagina-clientes)
  - [Página de Relatórios](mdc:#pagina-relatorios)
  - [Página de Planos](mdc:#pagina-planos)
  - [Página de Configurações](mdc:#pagina-configuracoes)

## Componentes
- [Header](mdc:#header)
  - [Remoção do Theme Toggle](mdc:#remocao-theme-toggle)

## Problemas Conhecidos
- [Erros de Acesso Síncrono](mdc:#erros-acesso-sincrono)
- [Erros de Stack Trace](mdc:#erros-stack-trace)

## Configurações
- [Layout e Navegação](mdc:#configuracoes-layout)
- [Informações Gerais](mdc:#configuracoes-gerais)
- [Métodos de Pagamento](mdc:#configuracoes-pagamentos)
- [Configurações de Entrega](mdc:#configuracoes-entrega)

## Interface Administrativa
- [Dashboard](mdc:#dashboard)
- [Configurações](mdc:#configuracoes)
- [Header e Navegação](mdc:#header-e-navegacao)
  - [Menu de Notificações](mdc:#menu-de-notificacoes)
  - [Menu de Perfil](mdc:#menu-de-perfil)
  - [Sidebar](mdc:#sidebar)

## Documentação

- [Regras de Negócio](./regras.md)
- [Todo (Tarefas)](./todo.md)
- [Estrutura do Banco de Dados](./database.md)
- [Testes Automatizados](./testes.md)

## API Endpoints

### Índice

- [Autenticação](documentacao.md#autenticacao)

## Módulo de Relatórios
- [Visão Geral do Módulo de Relatórios](documentacao.md#modulo-relatorios)
- [Relatório de Vendas por Período](documentacao.md#relatorio-vendas)
- [Produtos Mais Vendidos](documentacao.md#produtos-mais-vendidos)
- [Faturamento por Período](documentacao.md#faturamento-periodo)
- [Cálculo de Ticket Médio](documentacao.md#calculo-ticket-medio)
- [Estatísticas de Desempenho](documentacao.md#estatisticas-desempenho)
- [Interfaces e Tipos](documentacao.md#relatorios-interfaces)
- [Considerações de Desempenho](documentacao.md#relatorios-desempenho)
- [Tratamento de Erros](documentacao.md#relatorios-tratamento-erros)

## Módulo de Planos de Assinatura
- [Visão Geral do Módulo de Planos](documentacao.md#modulo-planos)
- [Planos Disponíveis](documentacao.md#planos-disponiveis)
- [Recursos por Plano](documentacao.md#recursos-plano)
- [Serviço de Assinaturas](documentacao.md#servico-assinaturas)
- [Middleware de Proteção](documentacao.md#middleware-protecao)
- [Hook React de Assinaturas](documentacao.md#hook-assinaturas)
- [Interfaces e Tipos](documentacao.md#planos-interfaces)
- [Tratamento de Erros](documentacao.md#planos-tratamento-erros)

## Segurança e Otimização
- [Validação de Dados](mdc:#validacao-dados)
- [Permissões Multi-tenant](mdc:#permissoes-multi-tenant)
- [Cache](mdc:#cache)
- [Sistema de Logs](mdc:#sistema-logs)
- [Rate Limiting](mdc:#rate-limiting)

## Integrações
- [Serviços Externos](mdc:#servicos-externos)

## Ferramentas de Desenvolvimento
- [Serviços Externos](mdc:#servicos-externos)