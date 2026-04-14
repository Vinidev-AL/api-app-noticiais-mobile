# API REST - Sistema de Gestao de Noticias (Mobile II)

API REST completa em NestJS + TypeScript com Drizzle ORM e SQLite.

## Configuracao

Crie um arquivo `.env` (veja `.env.example`) e instale as dependencias:

```bash
npm install
```

Scripts de banco:

```bash
npm run db:generate
npm run db:migrate
```

## Execucao

```bash
npm run start:dev
```

Base URL: `http://localhost:3000/api`

## Endpoints principais

- `POST /api/auth/login`
- `POST /api/auth/cadastro`
- `GET /api/noticias`
- `POST /api/noticias`
- `PATCH /api/noticias/:id/publicar`
- `GET /api/noticias/minhas`
- `GET /api/noticias/:id/comentarios`
- `POST /api/noticias/:id/comentarios`
- `GET /api/tags` | `POST /api/tags`
- `GET /api/ufs` | `POST /api/ufs`
- `GET /api/cidades` | `POST /api/cidades`

## Seed opcional de SUPERADMIN

Defina as variaveis abaixo no `.env` para criar um SUPERADMIN na inicializacao:

```bash
SEED_SUPERADMIN_USERNAME=admin
SEED_SUPERADMIN_PASSWORD=admin123
SEED_SUPERADMIN_NOME=Admin
```

## Definicao de ORM e Drizzle

Um ORM (Object-Relational Mapping) e uma camada que mapeia tabelas e colunas do banco de dados para estruturas de codigo, permitindo criar consultas e persistencia sem escrever SQL manualmente o tempo todo.

O Drizzle ORM e um ORM headless (sem runtime pesado), com foco em seguranca de tipos em tempo de compilacao, schema como codigo e consultas tipadas que se integram bem ao TypeScript.
