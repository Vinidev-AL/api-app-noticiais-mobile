import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { DB } from '../db/db.module';
import { perfis, users } from '../db/schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@Inject(DB) private readonly db: any) { }

    findAll() {
        return this.db.select({
            id: users.id,
            nome: users.nome,
            username: users.username,
            avatarUrl: users.avatarUrl,
            perfilId: users.perfilId,
            role: perfis.descricao,
        }).from(users).leftJoin(perfis, eq(perfis.id, users.perfilId)).all();
    }

    findById(id: string) {
        const user = this.db
            .select({
                id: users.id,
                nome: users.nome,
                username: users.username,
                avatarUrl: users.avatarUrl,
                perfilId: users.perfilId,
                role: perfis.descricao,
            })
            .from(users)
            .leftJoin(perfis, eq(perfis.id, users.perfilId))
            .where(eq(users.id, id))
            .get();

        if (!user) {
            throw new NotFoundException('Usuario nao encontrado.');
        }

        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        const existing = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, id))
            .get();

        if (!existing) {
            throw new NotFoundException('Usuario nao encontrado.');
        }

        const updateData: Record<string, unknown> = {};
        if (dto.nome) {
            updateData.nome = dto.nome;
        }

        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        if (Object.keys(updateData).length === 0) {
            return this.findById(id);
        }

        this.db.update(users).set(updateData).where(eq(users.id, id)).run();
        return this.findById(id);
    }

    updateAvatar(id: string, avatarUrl: string | null) {
        const existing = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, id))
            .get();

        if (!existing) {
            throw new NotFoundException('Usuario nao encontrado.');
        }

        this.db.update(users).set({ avatarUrl }).where(eq(users.id, id)).run();
        return this.findById(id);
    }

    remove(id: string) {
        const existing = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, id))
            .get();

        if (!existing) {
            throw new NotFoundException('Usuario nao encontrado.');
        }

        this.db.delete(users).where(eq(users.id, id)).run();
        return { deleted: true };
    }

}
