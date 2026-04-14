import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
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
