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
import { UfsService } from './ufs.service';
import { CreateUfDto } from './dto/create-uf.dto';
import { UpdateUfDto } from './dto/update-uf.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('ufs')
@ApiTags('UFs')
export class UfsController {
    constructor(private readonly ufsService: UfsService) { }

    @Get()
    @ApiOperation({ summary: 'Listar UFs' })
    @ApiResponse({ status: 200, description: 'Lista de UFs.' })
    findAll() {
        return this.ufsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar UF por id' })
    @ApiParam({ name: 'id', description: 'ID da UF.' })
    @ApiResponse({ status: 200, description: 'UF encontrada.' })
    @ApiResponse({
        status: 404,
        description: 'UF nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'UF nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    findById(@Param('id') id: string) {
        return this.ufsService.findById(id);
    }

    @Get(':ufId/cidades')
    @ApiOperation({ summary: 'Listar cidades por UF' })
    @ApiParam({ name: 'ufId', description: 'ID da UF.' })
    @ApiResponse({ status: 200, description: 'Lista de cidades.' })
    listCidades(@Param('ufId') ufId: string) {
        return this.ufsService.listCidades(ufId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar UF' })
    @ApiResponse({ status: 201, description: 'UF criada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    create(@Body() dto: CreateUfDto) {
        return this.ufsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar UF' })
    @ApiParam({ name: 'id', description: 'ID da UF.' })
    @ApiResponse({ status: 200, description: 'UF atualizada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'UF nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'UF nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    update(@Param('id') id: string, @Body() dto: UpdateUfDto) {
        return this.ufsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir UF' })
    @ApiParam({ name: 'id', description: 'ID da UF.' })
    @ApiResponse({ status: 200, description: 'UF excluida.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'UF nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'UF nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.ufsService.remove(id);
    }
}
