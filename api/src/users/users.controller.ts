import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CurrentUser, CurrentUserPayload } from '../common/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(Role.SUPERADMIN)
    @ApiOperation({ summary: 'Listar todos os usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar usuario por id' })
    @ApiParam({ name: 'id', description: 'ID do usuario.' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({
        status: 403,
        description: 'Acesso negado.',
        schema: {
            example: {
                statusCode: 403,
                message: 'Acesso negado.',
                error: 'Forbidden',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Usuario nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    findById(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        if (user.role !== Role.SUPERADMIN && user.userId !== id) {
            throw new ForbiddenException('Acesso negado.');
        }
        return this.usersService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar usuario' })
    @ApiParam({ name: 'id', description: 'ID do usuario.' })
    @ApiResponse({ status: 200, description: 'Usuario atualizado.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({
        status: 403,
        description: 'Acesso negado.',
        schema: {
            example: {
                statusCode: 403,
                message: 'Acesso negado.',
                error: 'Forbidden',
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Usuario nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Usuario nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        if (user.role !== Role.SUPERADMIN && user.userId !== id) {
            throw new ForbiddenException('Acesso negado.');
        }
        return this.usersService.update(id, dto);
    }

    @Patch(':id/avatar')
    @ApiOperation({ summary: 'Atualizar foto de perfil' })
    @ApiParam({ name: 'id', description: 'ID do usuario.' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (_req, _file, callback) => {
                    const uploadDir = join(process.cwd(), 'uploads', 'avatars');
                    if (!existsSync(uploadDir)) {
                        mkdirSync(uploadDir, { recursive: true });
                    }
                    callback(null, uploadDir);
                },
                filename: (req, file, callback) => {
                    const rawId = (req.params?.id ?? 'user') as string;
                    const ext = extname(file.originalname) || '.jpg';
                    callback(null, `${rawId}-${Date.now()}${ext}`);
                },
            }),
        }),
    )
    updateAvatar(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        if (user.role !== Role.SUPERADMIN && user.userId !== id) {
            throw new ForbiddenException('Acesso negado.');
        }

        if (!file) {
            return this.usersService.updateAvatar(id, null);
        }

        const avatarUrl = `/uploads/avatars/${file.filename}`;
        return this.usersService.updateAvatar(id, avatarUrl);
    }

    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @ApiOperation({ summary: 'Excluir usuario' })
    @ApiParam({ name: 'id', description: 'ID do usuario.' })
    @ApiResponse({ status: 200, description: 'Usuario excluido.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Usuario nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Usuario nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
