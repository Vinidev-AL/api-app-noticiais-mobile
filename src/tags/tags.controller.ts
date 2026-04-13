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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    @ApiOperation({ summary: 'Listar tags' })
    @ApiResponse({ status: 200, description: 'Lista de tags.' })
    findAll() {
        return this.tagsService.findAll();
    }

    @Get(':id/noticias')
    @ApiOperation({ summary: 'Listar noticias publicadas por tag' })
    @ApiParam({ name: 'id', description: 'ID da tag.' })
    @ApiResponse({ status: 200, description: 'Lista de noticias da tag.' })
    listNoticias(@Param('id') id: string) {
        return this.tagsService.listNoticiasByTag(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Consultar tag por id' })
    @ApiParam({ name: 'id', description: 'ID da tag.' })
    @ApiResponse({ status: 200, description: 'Tag encontrada.' })
    @ApiResponse({
        status: 404,
        description: 'Tag nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Tag nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    findById(@Param('id') id: string) {
        return this.tagsService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar tag' })
    @ApiResponse({ status: 201, description: 'Tag criada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    create(@Body() dto: CreateTagDto) {
        return this.tagsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar tag' })
    @ApiParam({ name: 'id', description: 'ID da tag.' })
    @ApiResponse({ status: 200, description: 'Tag atualizada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Tag nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Tag nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
        return this.tagsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir tag' })
    @ApiParam({ name: 'id', description: 'ID da tag.' })
    @ApiResponse({ status: 200, description: 'Tag excluida.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Tag nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Tag nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.tagsService.remove(id);
    }
}
