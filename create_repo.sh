#!/bin/bash

echo "=== Script para criar repositório no GitHub e fazer push do código ==="
echo "Este script irá criar um novo repositório no GitHub usando seu token de acesso pessoal."
echo ""

# Solicitar nome de usuário e token
read -p "Digite seu token de acesso pessoal do GitHub: " TOKEN
REPO_NAME="krato-cardapio-digital"
REPO_DESC="Cardápio digital para restaurantes e estabelecimentos de alimentação"
USERNAME="otaviomab"

echo "Criando repositório '$REPO_NAME'..."

# Criar repositório usando a API do GitHub
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESC\",\"private\":false}")

# Verificar se a criação foi bem-sucedida
if echo "$RESPONSE" | grep -q "html_url"; then
  REPO_URL=$(echo "$RESPONSE" | grep -o '"html_url": "[^"]*' | cut -d'"' -f4)
  
  echo "Repositório criado com sucesso: $REPO_URL"
  
  # Configurar o remote
  echo "Configurando o remote..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO_NAME.git"
  
  # Fazer push
  echo "Fazendo push do código..."
  git push -u origin main
  
  echo "Processo concluído! Seu código está disponível em: $REPO_URL"
else
  echo "Erro ao criar o repositório:"
  echo "$RESPONSE" | grep -o '"message": "[^"]*' | cut -d'"' -f4
  exit 1
fi 