import {
    integer,
    primaryKey,
    sqliteTable,
    text,
    uniqueIndex,
} from 'drizzle-orm/sqlite-core';

const PERFIL_ENUM = ['AUTOR', 'EDITOR', 'LEITOR', 'SUPERADMIN'] as const;
const NOTICIA_STATUS_ENUM = ['RASCUNHO', 'PUBLICADO'] as const;

export const perfis = sqliteTable('perfis', {
    id: text('id').primaryKey(),
    descricao: text('descricao', { enum: PERFIL_ENUM }).notNull(),
});

export const users = sqliteTable(
    'users',
    {
        id: text('id').primaryKey(),
        nome: text('nome').notNull(),
        username: text('username').notNull(),
        password: text('password').notNull(),
        avatarUrl: text('avatar_url'),
        perfilId: text('perfil_id')
            .notNull()
            .references(() => perfis.id, { onDelete: 'restrict' }),
    },
    (table) => ({
        usernameIdx: uniqueIndex('users_username_unique').on(table.username),
    }),
);

export const noticias = sqliteTable('noticias', {
    id: text('id').primaryKey(),
    titulo: text('titulo').notNull(),
    imagem: text('imagem'),
    resumo: text('resumo').notNull(),
    texto: text('texto').notNull(),
    autorId: text('autor_id')
        .notNull()
        .references(() => users.id, { onDelete: 'restrict' }),
    status: text('status', { enum: NOTICIA_STATUS_ENUM }).notNull(),
    dataCriacao: integer('data_criacao', { mode: 'timestamp' }).notNull(),
    dataPublicacao: integer('data_publicacao', { mode: 'timestamp' }),
});

export const comentarios = sqliteTable('comentarios', {
    id: text('id').primaryKey(),
    texto: text('texto').notNull(),
    dataCriacao: integer('data_criacao', { mode: 'timestamp' }).notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'restrict' }),
    noticiaId: text('noticia_id')
        .notNull()
        .references(() => noticias.id, { onDelete: 'cascade' }),
});

export const tags = sqliteTable(
    'tags',
    {
        id: text('id').primaryKey(),
        descricao: text('descricao').notNull(),
    },
    (table) => ({
        descricaoIdx: uniqueIndex('tags_descricao_unique').on(table.descricao),
    }),
);

export const noticiaTags = sqliteTable(
    'noticia_tags',
    {
        noticiaId: text('noticia_id')
            .notNull()
            .references(() => noticias.id, { onDelete: 'cascade' }),
        tagId: text('tag_id')
            .notNull()
            .references(() => tags.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.noticiaId, table.tagId] }),
    }),
);

export const ufs = sqliteTable(
    'ufs',
    {
        id: text('id').primaryKey(),
        nome: text('nome').notNull(),
        sigla: text('sigla').notNull(),
    },
    (table) => ({
        siglaIdx: uniqueIndex('ufs_sigla_unique').on(table.sigla),
    }),
);

export const cidades = sqliteTable('cidades', {
    id: text('id').primaryKey(),
    nome: text('nome').notNull(),
    ufId: text('uf_id')
        .notNull()
        .references(() => ufs.id, { onDelete: 'restrict' }),
});

export type Perfil = typeof perfis.$inferSelect;
export type User = typeof users.$inferSelect;
export type Noticia = typeof noticias.$inferSelect;
export type Comentario = typeof comentarios.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Uf = typeof ufs.$inferSelect;
export type Cidade = typeof cidades.$inferSelect;
