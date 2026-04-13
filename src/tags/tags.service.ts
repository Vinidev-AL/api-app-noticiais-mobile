import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { DB } from '../db/db.module';
import { noticiaTags, noticias, tags } from '../db/schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { NoticiaStatus } from '../common/noticia-status.enum';

@Injectable()
export class TagsService {
    constructor(@Inject(DB) private readonly db: any) { }

    findAll() {
        return this.db.select().from(tags).all();
    }

    findById(id: string) {
        const tag = this.db.select().from(tags).where(eq(tags.id, id)).get();
        if (!tag) {
            throw new NotFoundException('Tag nao encontrada.');
        }
        return tag;
    }

    create(dto: CreateTagDto) {
        const id = randomUUID();
        this.db.insert(tags).values({ id, descricao: dto.descricao }).run();
        return { id, descricao: dto.descricao };
    }

    update(id: string, dto: UpdateTagDto) {
        const existing = this.db.select().from(tags).where(eq(tags.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Tag nao encontrada.');
        }

        this.db.update(tags).set({ descricao: dto.descricao ?? existing.descricao }).where(eq(tags.id, id)).run();
        return this.findById(id);
    }

    remove(id: string) {
        const existing = this.db.select().from(tags).where(eq(tags.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Tag nao encontrada.');
        }

        this.db.delete(tags).where(eq(tags.id, id)).run();
        return { deleted: true };
    }

    listNoticiasByTag(tagId: string) {
        return this.db
            .select({
                id: noticias.id,
                titulo: noticias.titulo,
                imagem: noticias.imagem,
                resumo: noticias.resumo,
                texto: noticias.texto,
                autorId: noticias.autorId,
                status: noticias.status,
                dataCriacao: noticias.dataCriacao,
                dataPublicacao: noticias.dataPublicacao,
            })
            .from(noticias)
            .innerJoin(noticiaTags, eq(noticiaTags.noticiaId, noticias.id))
            .where(and(eq(noticiaTags.tagId, tagId), eq(noticias.status, NoticiaStatus.PUBLICADO)))
            .all();
    }
}
