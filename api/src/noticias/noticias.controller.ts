import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
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
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/optional-jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CurrentUser, CurrentUserPayload } from '../common/current-user.decorator';

@Controller('noticias')
@ApiTags('Noticias')
export class NoticiasController {
    constructor(private readonly noticiasService: NoticiasService) { }

    @Get()
    @ApiOperation({ summary: 'Listar noticias publicadas' })
    @ApiResponse({ status: 200, description: 'Lista de noticias publicadas.' })
    listPublished() {
        return this.noticiasService.listPublished();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('minhas')
    @Roles(Role.AUTOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar noticias do autor logado' })
    @ApiResponse({ status: 200, description: 'Lista de noticias do autor.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    listMine(@CurrentUser() user: CurrentUserPayload) {
        return this.noticiasService.listMine(user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('todas')
    @Roles(Role.EDITOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todas as noticias (painel editorial)' })
    @ApiResponse({ status: 200, description: 'Lista de todas as noticias.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    listAll() {
        return this.noticiasService.listAll();
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Consultar noticia por id' })
    @ApiParam({ name: 'id', description: 'ID da noticia.' })
    @ApiResponse({ status: 200, description: 'Noticia encontrada.' })
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
        description: 'Noticia nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Noticia nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    getById(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
        return this.noticiasService.getById(id, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.AUTOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar noticia (rascunho)' })
    @ApiResponse({ status: 201, description: 'Noticia criada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    create(
        @Body() dto: CreateNoticiaDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.noticiasService.create(dto, user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.AUTOR, Role.EDITOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar noticia' })
    @ApiParam({ name: 'id', description: 'ID da noticia.' })
    @ApiResponse({ status: 200, description: 'Noticia atualizada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Noticia nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Noticia nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateNoticiaDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.noticiasService.update(id, dto, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/publicar')
    @Roles(Role.EDITOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Publicar noticia' })
    @ApiParam({ name: 'id', description: 'ID da noticia.' })
    @ApiResponse({ status: 200, description: 'Noticia publicada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Noticia nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Noticia nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    publish(@Param('id') id: string) {
        return this.noticiasService.publish(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/despublicar')
    @Roles(Role.EDITOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Despublicar noticia' })
    @ApiParam({ name: 'id', description: 'ID da noticia.' })
    @ApiResponse({ status: 200, description: 'Noticia despublicada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Noticia nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Noticia nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    unpublish(@Param('id') id: string) {
        return this.noticiasService.unpublish(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir noticia' })
    @ApiParam({ name: 'id', description: 'ID da noticia.' })
    @ApiResponse({ status: 200, description: 'Noticia excluida.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Noticia nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Noticia nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.noticiasService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':noticiaId/tags/:tagId')
    @Roles(Role.AUTOR, Role.EDITOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Vincular tag a noticia' })
    @ApiParam({ name: 'noticiaId', description: 'ID da noticia.' })
    @ApiParam({ name: 'tagId', description: 'ID da tag.' })
    @ApiResponse({ status: 201, description: 'Tag vinculada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Noticia ou tag nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Tag nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    linkTag(
        @Param('noticiaId') noticiaId: string,
        @Param('tagId') tagId: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.noticiasService.linkTag(noticiaId, tagId, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':noticiaId/tags/:tagId')
    @Roles(Role.AUTOR, Role.EDITOR, Role.SUPERADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Desvincular tag da noticia' })
    @ApiParam({ name: 'noticiaId', description: 'ID da noticia.' })
    @ApiParam({ name: 'tagId', description: 'ID da tag.' })
    @ApiResponse({ status: 200, description: 'Tag desvinculada.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Noticia ou tag nao encontrada.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Noticia nao encontrada.',
                error: 'Not Found',
            },
        },
    })
    unlinkTag(
        @Param('noticiaId') noticiaId: string,
        @Param('tagId') tagId: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.noticiasService.unlinkTag(noticiaId, tagId, user);
    }
}
