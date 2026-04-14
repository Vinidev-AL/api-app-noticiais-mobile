# API App Notícias + Mobile

Este README resume o que já está funcionando no app mobile (Expo + React Native).

## Mobile: funcionalidades funcionando

### 1) Estrutura base e navegação

- App mobile com layout responsivo para Web (localhost) e dispositivos.
- Navegação por barra inferior com abas dinâmicas.
- Abas padrão:
  - Início
  - Buscar
  - Perfil
- Abas para SuperAdmin:
  - Início
  - Buscar
  - Criar
  - Admin
  - Perfil

### 2) Autenticação e sessão

- Login real consumindo API:
  - POST /api/auth/login
- Cadastro real consumindo API:
  - POST /api/auth/cadastro
- Persistência de sessão com AsyncStorage/localStorage.
- Restauração automática da sessão ao abrir o app.
- Logout funcional com limpeza de sessão.

### 3) Regras de acesso por perfil

- Usuário deslogado:
  - ao tocar em Buscar, Criar ou Admin, redireciona para Perfil (login).
- Usuário logado sem papel SUPERADMIN:
  - não acessa abas Criar e Admin (retorno para Início).
- Usuário SUPERADMIN:
  - acesso completo às abas Criar e Admin.

### 4) Tela Início

- Header e busca visual implementados.
- Seções de categorias e últimas notícias com dados locais.
- Rolagem e comportamento de layout ajustados para Web.

### 5) Tela Buscar

- Busca visual implementada com placeholder:
  - "Buscar por título, tag ou autor..."
- Chips de categorias implementados.
- Empty state implementado:
  - "Explore as notícias"

### 6) Tela Perfil

- Formulário de login e cadastro funcional.
- Estado de sessão ativa mostrando:
  - nome
  - username
  - perfil
- Botões funcionais:
  - Ir para Início
  - Sair
- Toasts de feedback:
  - sucesso de login
  - sucesso de cadastro
  - erros de validação/requisição

### 7) Área SuperAdmin - Dashboard (aba Admin)

- Carregamento de métricas reais da API:
  - total de usuários
  - total de notícias
  - total de publicadas
  - total de rascunhos
  - total de tags
- Estados de loading e erro implementados.
- Seção de gerenciamento visual pronta (Usuários, Notícias, Tags, Perfis, UFs, Cidades, Comentários).

### 8) Área SuperAdmin - CRUD de Notícias (aba Criar)

- Listagem de notícias (GET /api/noticias/todas).
- Filtros funcionando:
  - Todas
  - Publicadas
  - Rascunhos
- Criação de notícia (POST /api/noticias).
- Edição de notícia (PUT /api/noticias/:id).
- Publicar notícia (PATCH /api/noticias/:id/publicar).
- Despublicar notícia (PATCH /api/noticias/:id/despublicar).
- Excluir notícia (DELETE /api/noticias/:id).
- Formulário com validação mínima de campos obrigatórios.
- Feedback de erro com mensagens da API.

### 9) Camada de API no mobile

- Base URL automática por plataforma:
  - Web: http://localhost:3000/api (ou host atual na porta 3000)
  - Android emulador: http://10.0.2.2:3000/api
  - Fallback local: http://localhost:3000/api
- Suporte a EXPO_PUBLIC_API_URL para sobrescrever endpoint.
- Envio automático de Authorization Bearer token quando sessão existe.
- Tratamento padronizado de erros de rede e resposta da API.

## Pré-requisitos para o mobile funcionar

### Backend

- API Nest precisa estar rodando na porta 3000.
- CORS habilitado para chamadas do frontend.

### Frontend mobile

- Rodar o app com Expo Web em localhost:8081 (ou porta definida pelo Expo).

## Comandos úteis

### Subir backend

Use na raiz do projeto:

```bash
npm --prefix api run start:dev
```

### Subir mobile (web)

Use na raiz do projeto:

```bash
npm --prefix mobile run web
```

## Contas demo para teste

- admin / 123456 (SUPERADMIN)
- editor / 123456 (EDITOR)
- autor / 123456 (AUTOR)
- leitor / 123456 (LEITOR)
