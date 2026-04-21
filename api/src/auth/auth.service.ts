import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { DB } from '../db/db.module';
import { perfis, users } from '../db/schema';
import { Role } from '../common/roles.enum';
import { CadastroDto } from './dto/cadastro.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DB) private readonly db: any,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    private getResetCode() {
        return this.configService.get<string>('RESET_CODE') ?? '123456';
    }

    async cadastro(dto: CadastroDto) {
        await this.ensurePerfis();

        const existing = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, dto.username))
            .get();

        if (existing) {
            throw new ConflictException('Username ja existe.');
        }

        const perfil = this.db
            .select()
            .from(perfis)
            .where(eq(perfis.descricao, Role.LEITOR))
            .get();

        if (!perfil) {
            throw new ConflictException('Perfil LEITOR nao encontrado.');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const userId = randomUUID();
        this.db.insert(users).values({
            id: userId,
            nome: dto.nome,
            username: dto.username,
            password: passwordHash,
            perfilId: perfil.id,
        }).run();

        return {
            id: userId,
            nome: dto.nome,
            username: dto.username,
            avatarUrl: null,
            role: perfil.descricao,
        };
    }

    async login(dto: LoginDto) {
        const user = this.db
            .select({
                id: users.id,
                nome: users.nome,
                username: users.username,
                password: users.password,
                avatarUrl: users.avatarUrl,
                role: perfis.descricao,
            })
            .from(users)
            .leftJoin(perfis, eq(perfis.id, users.perfilId))
            .where(eq(users.username, dto.username))
            .get();

        if (!user || !user.password || !user.role) {
            throw new UnauthorizedException('Credenciais invalidas.');
        }

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            throw new UnauthorizedException('Credenciais invalidas.');
        }

        const payload = { sub: user.id, username: user.username, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                nome: user.nome,
                username: user.username,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        };
    }

    private async ensurePerfis() {
        const roles = [Role.AUTOR, Role.EDITOR, Role.LEITOR, Role.SUPERADMIN];
        for (const role of roles) {
            this.db
                .insert(perfis)
                .values({ id: randomUUID(), descricao: role })
                .onConflictDoNothing()
                .run();
        }
    }

    async seedSuperadminIfNeeded() {
        const username = this.configService.get<string>('SEED_SUPERADMIN_USERNAME');
        const password = this.configService.get<string>('SEED_SUPERADMIN_PASSWORD');
        const nome = this.configService.get<string>('SEED_SUPERADMIN_NOME') ?? 'Admin';

        if (!username || !password) {
            return;
        }

        await this.ensurePerfis();

        const existing = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, username))
            .get();

        if (existing) {
            return;
        }

        const perfil = this.db
            .select()
            .from(perfis)
            .where(eq(perfis.descricao, Role.SUPERADMIN))
            .get();

        if (!perfil) {
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        this.db.insert(users).values({
            id: randomUUID(),
            nome,
            username,
            password: passwordHash,
            perfilId: perfil.id,
        }).run();
    }

    async seedDefaultUsersIfNeeded() {
        await this.ensurePerfis();

        const defaults = [
            { username: 'admin', nome: 'Admin', role: Role.SUPERADMIN },
            { username: 'editor', nome: 'Editor', role: Role.EDITOR },
            { username: 'autor', nome: 'Autor', role: Role.AUTOR },
            { username: 'leitor', nome: 'Leitor', role: Role.LEITOR },
        ];

        for (const item of defaults) {
            const perfil = this.db
                .select()
                .from(perfis)
                .where(eq(perfis.descricao, item.role))
                .get();

            if (!perfil) {
                continue;
            }

            const passwordHash = await bcrypt.hash('123456', 10);
            this.db
                .insert(users)
                .values({
                    id: randomUUID(),
                    nome: item.nome,
                    username: item.username,
                    password: passwordHash,
                    perfilId: perfil.id,
                })
                .onConflictDoNothing()
                .run();
        }
    }

    requestPasswordReset(dto: ForgotPasswordDto) {
        const user = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, dto.username))
            .get();

        if (!user) {
            throw new UnauthorizedException('Usuario nao encontrado.');
        }

        return {
            message: 'Codigo de recuperacao gerado com sucesso.',
            codigo: this.getResetCode(),
        };
    }

    async resetPassword(dto: ResetPasswordDto) {
        if (dto.codigo !== this.getResetCode()) {
            throw new UnauthorizedException('Codigo invalido.');
        }

        const user = this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, dto.username))
            .get();

        if (!user) {
            throw new UnauthorizedException('Usuario nao encontrado.');
        }

        const passwordHash = await bcrypt.hash(dto.novaSenha, 10);
        this.db
            .update(users)
            .set({ password: passwordHash })
            .where(eq(users.id, user.id))
            .run();

        return { reset: true };
    }
}
