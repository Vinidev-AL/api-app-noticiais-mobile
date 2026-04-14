import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
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
import { PerfisService } from './perfis.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('perfis')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiTags('Perfis')
@ApiBearerAuth()
export class PerfisController {
    constructor(private readonly perfisService: PerfisService) { }

    @Get()
    @ApiOperation({ summary: 'Listar perfis' })
    @ApiResponse({ status: 200, description: 'Lista de perfis.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    findAll() {
        return this.perfisService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar perfil por id' })
    @ApiParam({ name: 'id', description: 'ID do perfil.' })
    @ApiResponse({ status: 200, description: 'Perfil encontrado.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Perfil nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Perfil nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    findById(@Param('id') id: string) {
        return this.perfisService.findById(id);
    }

    @Post()
    @ApiOperation({ summary: 'Criar perfil' })
    @ApiResponse({ status: 201, description: 'Perfil criado.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    create(@Body() dto: CreatePerfilDto) {
        return this.perfisService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar perfil' })
    @ApiParam({ name: 'id', description: 'ID do perfil.' })
    @ApiResponse({ status: 200, description: 'Perfil atualizado.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Perfil nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Perfil nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    update(@Param('id') id: string, @Body() dto: UpdatePerfilDto) {
        return this.perfisService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir perfil' })
    @ApiParam({ name: 'id', description: 'ID do perfil.' })
    @ApiResponse({ status: 200, description: 'Perfil excluido.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Perfil nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Perfil nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.perfisService.remove(id);
    }
}
