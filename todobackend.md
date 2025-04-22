# ToDo List - Backend do Cardápio Digital (Appwrite)

## Configuração Inicial e Banco de Dados
- [x] Criar coleções no Appwrite Database para todas as entidades (já definido ID do banco como `kratodeliv_db`):
  - [x] Collection `establishments` - Dados dos estabelecimentos
  - [x] Collection `categories` - Categorias do cardápio
  - [x] Collection `products` - Produtos do cardápio
  - [x] Collection `orders` - Pedidos realizados
  - [x] Collection `customers` - Clientes dos estabelecimentos
  - [ ] Collection `users` - Usuários administradores
- [x] Definir índices e relacionamentos entre as collections
- [ ] Configurar permissões adequadas para multi-tenant (cada usuário vê apenas seus dados)
- [x] Criar bucket no Storage para imagens de produtos, logos e banners
- [x] Configurar Appwrite Realtime para notificações de pedidos em tempo real

## Módulo de Estabelecimentos
- [x] Implementar API para criar estabelecimento (ao cadastrar usuário)
- [x] Desenvolver função para buscar dados do estabelecimento pelo ID
- [x] Criar função para buscar estabelecimento pelo slug (cardápio público)
- [x] Implementar função para atualizar dados básicos do estabelecimento
- [x] Desenvolver função para atualizar logo e imagem de capa
- [x] Criar função para verificar status do estabelecimento (aberto/fechado)
- [x] Implementar validação automática de horário de funcionamento

## Módulo de Cardápio
- [x] Implementar CRUD completo para categorias
  - [x] Criar categoria
  - [x] Listar categorias por estabelecimento
  - [x] Atualizar categoria
  - [x] Excluir categoria
  - [x] Reordenar categorias
- [x] Implementar CRUD completo para produtos
  - [x] Criar produto
  - [x] Listar produtos por categoria
  - [x] Atualizar produto
  - [x] Excluir produto
  - [x] Upload de imagem de produto
  - [x] Gerenciar produtos personalizáveis
  - [x] Gerenciar adicionais de produtos

## Módulo de Pedidos
- [x] Implementar criação de novo pedido
- [x] Desenvolver função para listar pedidos por estabelecimento
- [x] Criar função para buscar detalhes de um pedido específico
- [x] Implementar atualização de status do pedido com histórico
- [x] Desenvolver filtros de pedidos (status, data, método de pagamento)
- [x] Implementar notificações em tempo real para novos pedidos
- [x] Criar função para calcular estatísticas de pedidos (para o dashboard)

## Módulo de Clientes
- [x] Desenvolver função para listar clientes por estabelecimento
- [x] Criar função para buscar detalhes de um cliente
- [x] Implementar filtro de busca de clientes
- [x] Desenvolver função para visualizar histórico de pedidos por cliente

## Módulo de Configurações
- [x] Implementar atualização de informações gerais do estabelecimento
- [x] Desenvolver gerenciamento de endereço
- [x] Criar funções para gerenciar horários de funcionamento
- [x] Implementar configurações de entrega e zonas
- [x] Desenvolver gerenciamento de métodos de pagamento
- [x] Criar função para configurar integração com WhatsApp

## Módulo de Relatórios
- [x] Implementar função para gerar relatório de vendas por período
- [x] Desenvolver função para listar produtos mais vendidos
- [x] Criar função para calcular faturamento por período
- [x] Implementar cálculo de ticket médio
- [x] Desenvolver estatísticas de desempenho (crescimento, comparativos)

## Módulo de Planos de Assinatura
- [x] Implementar estrutura para diferentes planos
- [x] Desenvolver sistema de verificação de recursos disponíveis por plano
- [x] Criar função para atualizar plano do estabelecimento
- [x] Implementar limitações baseadas no tipo de plano

## Segurança e Otimização
- [x] Implementar validação de dados em todas as rotas de API
- [x] Desenvolver middleware para verificação de permissões multi-tenant
- [x] Implementar cache para consultas frequentes
- [x] Criar sistema de logs para operações críticas
- [x] Desenvolver proteção contra abusos (rate limiting)

## Integrações
- [ ] Implementar integração com serviço de CEP para validação de endereços
- [ ] Criar função para geração de QR Code do cardápio

## Funcionalidades Extras
- [ ] Implementar sistema de cupons de desconto
- [ ] Desenvolver funcionalidade de avaliação de pedidos
- [ ] Criar sistema de fidelidade para clientes recorrentes
- [ ] Implementar autenticação e área do cliente para acompanhamento de pedidos 