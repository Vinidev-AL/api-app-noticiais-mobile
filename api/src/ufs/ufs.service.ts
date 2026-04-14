import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { DB } from '../db/db.module';
import { cidades, ufs } from '../db/schema';
import { CreateUfDto } from './dto/create-uf.dto';
import { UpdateUfDto } from './dto/update-uf.dto';

@Injectable()
export class UfsService {
    constructor(@Inject(DB) private readonly db: any) { }

    findAll() {
        return this.db.select().from(ufs).all();
    }

    findById(id: string) {
        const uf = this.db.select().from(ufs).where(eq(ufs.id, id)).get();
        if (!uf) {
            throw new NotFoundException('UF nao encontrada.');
        }
        return uf;
    }

    create(dto: CreateUfDto) {
        const id = randomUUID();
        this.db.insert(ufs).values({ id, nome: dto.nome, sigla: dto.sigla }).run();
        return { id, nome: dto.nome, sigla: dto.sigla };
    }

    update(id: string, dto: UpdateUfDto) {
        const existing = this.db.select().from(ufs).where(eq(ufs.id, id)).get();
        if (!existing) {
            throw new NotFoundException('UF nao encontrada.');
        }

        this.db.update(ufs).set({
            nome: dto.nome ?? existing.nome,
            sigla: dto.sigla ?? existing.sigla,
        }).where(eq(ufs.id, id)).run();

        return this.findById(id);
    }

    remove(id: string) {
        const existing = this.db.select().from(ufs).where(eq(ufs.id, id)).get();
        if (!existing) {
            throw new NotFoundException('UF nao encontrada.');
        }

        this.db.delete(ufs).where(eq(ufs.id, id)).run();
        return { deleted: true };
    }

    listCidades(ufId: string) {
        return this.db.select().from(cidades).where(eq(cidades.ufId, ufId)).all();
    }
}
