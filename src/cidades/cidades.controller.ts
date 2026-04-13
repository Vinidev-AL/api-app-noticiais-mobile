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
import { CidadesService } from './cidades.service';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('cidades')
@ApiTags('Cidades')
export class CidadesController {
    constructor(private readonly cidadesService: CidadesService) { }

    @Get()
    @ApiOperation({ summary: 'Listar cidades' })
    @ApiResponse({ status: 200, description: 'Lista de cidades.' })
    findAll() {
        return this.cidadesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar cidade por id' })
    @ApiParam({ name: 'id', description: 'ID da cidade.' })
    @ApiResponse({ status: 200, description: 'Cidade encontrada.' })
    @ApiResponse({
        status: 404,
        description: 'Cidade nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Cidade nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    findById(@Param('id') id: string) {
        return this.cidadesService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar cidade' })
    @ApiResponse({ status: 201, description: 'Cidade criada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    create(@Body() dto: CreateCidadeDto) {
        return this.cidadesService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar cidade' })
    @ApiParam({ name: 'id', description: 'ID da cidade.' })
    @ApiResponse({ status: 200, description: 'Cidade atualizada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Cidade nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Cidade nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    update(@Param('id') id: string, @Body() dto: UpdateCidadeDto) {
        return this.cidadesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir cidade' })
    @ApiParam({ name: 'id', description: 'ID da cidade.' })
    @ApiResponse({ status: 200, description: 'Cidade excluida.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Cidade nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Cidade nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.cidadesService.remove(id);
    }
}
