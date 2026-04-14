import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { DB } from '../db/db.module';
import { noticiaTags, noticias, tags } from '../db/schema';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { NoticiaStatus } from '../common/noticia-status.enum';
import { Role } from '../common/roles.enum';
import { CurrentUserPayload } from '../common/current-user.decorator';

@Injectable()
export class NoticiasService {
  constructor(@Inject(DB) private readonly db: any) {}

  private findByIdOrThrow(id: string) {
    const noticia = this.db
      .select()
      .from(noticias)
      .where(eq(noticias.id, id))
      .get();
    if (!noticia) {
      throw new NotFoundException('Noticia nao encontrada.');
    }

    return noticia;
  }

  listPublished() {
    return this.db
      .select()
      .from(noticias)
      .where(eq(noticias.status, NoticiaStatus.PUBLICADO))
      .orderBy(desc(noticias.dataPublicacao))
      .all();
  }

  listMine(userId: string) {
    return this.db
      .select()
      .from(noticias)
      .where(eq(noticias.autorId, userId))
      .orderBy(desc(noticias.dataCriacao))
      .all();
  }

  listAll() {
    return this.db
      .select()
      .from(noticias)
      .orderBy(desc(noticias.dataCriacao))
      .all();
  }

  getById(id: string, user?: CurrentUserPayload) {
    const noticia = this.findByIdOrThrow(id);

    if (noticia.status === NoticiaStatus.PUBLICADO) {
      return noticia;
    }

    if (!user) {
      throw new ForbiddenException('Acesso negado.');
    }

    if (user.role === Role.SUPERADMIN || user.role === Role.EDITOR) {
      return noticia;
    }

    if (user.role === Role.AUTOR && noticia.autorId === user.userId) {
      return noticia;
    }

    throw new ForbiddenException('Acesso negado.');
  }

  create(dto: CreateNoticiaDto, autorId: string) {
    const id = randomUUID();
    const now = new Date();
    this.db
      .insert(noticias)
      .values({
        id,
        titulo: dto.titulo,
        imagem: dto.imagem ?? null,
        resumo: dto.resumo,
        texto: dto.texto,
        autorId,
        status: NoticiaStatus.RASCUNHO,
        dataCriacao: now,
        dataPublicacao: null,
      })
      .run();

    return this.findByIdOrThrow(id);
  }

  update(id: string, dto: UpdateNoticiaDto, user: CurrentUserPayload) {
    const noticia = this.db
      .select()
      .from(noticias)
      .where(eq(noticias.id, id))
      .get();
    if (!noticia) {
      throw new NotFoundException('Noticia nao encontrada.');
    }

    if (user.role === Role.AUTOR) {
      if (noticia.autorId !== user.userId) {
        throw new ForbiddenException('Acesso negado.');
      }
      if (noticia.status !== NoticiaStatus.RASCUNHO) {
        throw new ForbiddenException('Somente rascunhos podem ser editados.');
      }
    }

    if (user.role === Role.LEITOR) {
      throw new ForbiddenException('Acesso negado.');
    }

    this.db
      .update(noticias)
      .set({
        titulo: dto.titulo ?? noticia.titulo,
        imagem: dto.imagem ?? noticia.imagem,
        resumo: dto.resumo ?? noticia.resumo,
        texto: dto.texto ?? noticia.texto,
      })
      .where(eq(noticias.id, id))
      .run();

    return this.getById(id, user);
  }

  publish(id: string) {
    const noticia = this.db
      .select()
      .from(noticias)
      .where(eq(noticias.id, id))
      .get();
    if (!noticia) {
      throw new NotFoundException('Noticia nao encontrada.');
    }

    this.db
      .update(noticias)
      .set({
        status: NoticiaStatus.PUBLICADO,
        dataPublicacao: new Date(),
      })
      .where(eq(noticias.id, id))
      .run();

    return this.getById(id);
  }

  unpublish(id: string) {
    this.findByIdOrThrow(id);

    this.db
      .update(noticias)
      .set({
        status: NoticiaStatus.RASCUNHO,
        dataPublicacao: null,
      })
      .where(eq(noticias.id, id))
      .run();

    return this.findByIdOrThrow(id);
  }

  remove(id: string) {
    const noticia = this.db
      .select()
      .from(noticias)
      .where(eq(noticias.id, id))
      .get();
    if (!noticia) {
      throw new NotFoundException('Noticia nao encontrada.');
    }

    this.db.delete(noticias).where(eq(noticias.id, id)).run();
    return { deleted: true };
  }

  linkTag(noticiaId: string, tagId: string, user: CurrentUserPayload) {
    const noticia = this.db
      .select()
      .from(noticias)
      .where(eq(noticias.id, noticiaId))
      .get();
    if (!noticia) {
      throw new NotFoundException('Noticia nao encontrada.');
    }

    if (user.role === Role.AUTOR && noticia.autorId !== user.userId) {
      throw new ForbiddenException('Acesso negado.');
    }

    if (user.role === Role.LEITOR) {
      throw new ForbiddenException('Acesso negado.');
    }

    const tag = this.db.select().from(tags).where(eq(tags.id, tagId)).get();
    if (!tag) {
      throw new NotFoundException('Tag nao encontrada.');
    }

    this.db
      .insert(noticiaTags)
      .values({ noticiaId, tagId })
      .onConflictDoNothing()
      .run();
    return { linked: true };
  }

  unlinkTag(noticiaId: string, tagId: string, user: CurrentUserPayload) {
    const noticia = this.db
      .select()
      .from(noticias)
      .where(eq(noticias.id, noticiaId))
      .get();
    if (!noticia) {
      throw new NotFoundException('Noticia nao encontrada.');
    }

    if (user.role === Role.AUTOR && noticia.autorId !== user.userId) {
      throw new ForbiddenException('Acesso negado.');
    }

    if (user.role === Role.LEITOR) {
      throw new ForbiddenException('Acesso negado.');
    }

    this.db
      .delete(noticiaTags)
      .where(
        and(eq(noticiaTags.noticiaId, noticiaId), eq(noticiaTags.tagId, tagId)),
      )
      .run();
    return { unlinked: true };
  }
}
