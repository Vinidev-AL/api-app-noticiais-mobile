import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { DB } from '../db/db.module';
import { comentarios, noticias } from '../db/schema';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { NoticiaStatus } from '../common/noticia-status.enum';

@Injectable()
export class ComentariosService {
    constructor(@Inject(DB) private readonly db: any) { }

    listByNoticia(noticiaId: string) {
        return this.db
            .select()
            .from(comentarios)
            .where(eq(comentarios.noticiaId, noticiaId))
            .orderBy(desc(comentarios.dataCriacao))
            .all();
    }

    create(noticiaId: string, userId: string, dto: CreateComentarioDto) {
        const noticia = this.db.select().from(noticias).where(eq(noticias.id, noticiaId)).get();
        if (!noticia) {
            throw new NotFoundException('Noticia nao encontrada.');
        }

        if (noticia.status !== NoticiaStatus.PUBLICADO) {
            throw new ForbiddenException('Comentarios permitidos apenas em noticias publicadas.');
        }

        const id = randomUUID();
        this.db.insert(comentarios).values({
            id,
            texto: dto.texto,
            dataCriacao: new Date(),
            userId,
            noticiaId,
        }).run();

        return this.db.select().from(comentarios).where(eq(comentarios.id, id)).get();
    }

    update(id: string, texto: string) {
        const existing = this.db.select().from(comentarios).where(eq(comentarios.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Comentario nao encontrado.');
        }

        this.db.update(comentarios).set({ texto }).where(eq(comentarios.id, id)).run();
        return this.db.select().from(comentarios).where(eq(comentarios.id, id)).get();
    }

    remove(id: string) {
        const existing = this.db.select().from(comentarios).where(eq(comentarios.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Comentario nao encontrado.');
        }

        this.db.delete(comentarios).where(eq(comentarios.id, id)).run();
        return { deleted: true };
    }
}
