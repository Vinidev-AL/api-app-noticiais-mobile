CREATE TABLE `cidades` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`uf_id` text NOT NULL,
	FOREIGN KEY (`uf_id`) REFERENCES `ufs`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `comentarios` (
	`id` text PRIMARY KEY NOT NULL,
	`texto` text NOT NULL,
	`data_criacao` integer NOT NULL,
	`user_id` text NOT NULL,
	`noticia_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`noticia_id`) REFERENCES `noticias`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `noticia_tags` (
	`noticia_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`noticia_id`, `tag_id`),
	FOREIGN KEY (`noticia_id`) REFERENCES `noticias`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `noticias` (
	`id` text PRIMARY KEY NOT NULL,
	`titulo` text NOT NULL,
	`imagem` text,
	`resumo` text NOT NULL,
	`texto` text NOT NULL,
	`autor_id` text NOT NULL,
	`status` text NOT NULL,
	`data_criacao` integer NOT NULL,
	`data_publicacao` integer,
	FOREIGN KEY (`autor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `perfis` (
	`id` text PRIMARY KEY NOT NULL,
	`descricao` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`descricao` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_descricao_unique` ON `tags` (`descricao`);--> statement-breakpoint
CREATE TABLE `ufs` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`sigla` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ufs_sigla_unique` ON `ufs` (`sigla`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`perfil_id` text NOT NULL,
	FOREIGN KEY (`perfil_id`) REFERENCES `perfis`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);