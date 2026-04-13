import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { DB } from '../db/db.module';
import { cidades, ufs } from '../db/schema';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';

@Injectable()
export class CidadesService {
    constructor(@Inject(DB) private readonly db: any) { }

    findAll() {
        return this.db.select().from(cidades).all();
    }

    findById(id: string) {
        const cidade = this.db.select().from(cidades).where(eq(cidades.id, id)).get();
        if (!cidade) {
            throw new NotFoundException('Cidade nao encontrada.');
        }
        return cidade;
    }

    create(dto: CreateCidadeDto) {
        const uf = this.db.select().from(ufs).where(eq(ufs.id, dto.ufId)).get();
        if (!uf) {
            throw new NotFoundException('UF nao encontrada.');
        }

        const id = randomUUID();
        this.db.insert(cidades).values({ id, nome: dto.nome, ufId: dto.ufId }).run();
        return { id, nome: dto.nome, ufId: dto.ufId };
    }

    update(id: string, dto: UpdateCidadeDto) {
        const existing = this.db.select().from(cidades).where(eq(cidades.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Cidade nao encontrada.');
        }

        if (dto.ufId) {
            const uf = this.db.select().from(ufs).where(eq(ufs.id, dto.ufId)).get();
            if (!uf) {
                throw new NotFoundException('UF nao encontrada.');
            }
        }

        this.db.update(cidades).set({
            nome: dto.nome ?? existing.nome,
            ufId: dto.ufId ?? existing.ufId,
        }).where(eq(cidades.id, id)).run();

        return this.findById(id);
    }

    remove(id: string) {
        const existing = this.db.select().from(cidades).where(eq(cidades.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Cidade nao encontrada.');
        }

        this.db.delete(cidades).where(eq(cidades.id, id)).run();
        return { deleted: true };
    }
}
