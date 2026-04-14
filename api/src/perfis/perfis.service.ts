import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { DB } from '../db/db.module';
import { perfis } from '../db/schema';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class PerfisService {
    constructor(@Inject(DB) private readonly db: any) { }

    findAll() {
        return this.db.select().from(perfis).all();
    }

    findById(id: string) {
        const perfil = this.db.select().from(perfis).where(eq(perfis.id, id)).get();
        if (!perfil) {
            throw new NotFoundException('Perfil nao encontrado.');
        }
        return perfil;
    }

    create(dto: CreatePerfilDto) {
        const id = randomUUID();
        this.db.insert(perfis).values({ id, descricao: dto.descricao }).run();
        return { id, descricao: dto.descricao };
    }

    update(id: string, dto: UpdatePerfilDto) {
        const existing = this.db.select().from(perfis).where(eq(perfis.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Perfil nao encontrado.');
        }

        this.db.update(perfis).set({ descricao: dto.descricao }).where(eq(perfis.id, id)).run();
        return this.findById(id);
    }

    remove(id: string) {
        const existing = this.db.select().from(perfis).where(eq(perfis.id, id)).get();
        if (!existing) {
            throw new NotFoundException('Perfil nao encontrado.');
        }

        this.db.delete(perfis).where(eq(perfis.id, id)).run();
        return { deleted: true };
    }
}
