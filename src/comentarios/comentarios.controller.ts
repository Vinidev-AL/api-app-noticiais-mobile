import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CurrentUser, CurrentUserPayload } from '../common/current-user.decorator';

@Controller('noticias/:noticiaId/comentarios')
@ApiTags('Comentarios')
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService) { }

    @Get()
    @ApiOperation({ summary: 'Listar comentarios de uma noticia' })
    @ApiParam({ name: 'noticiaId', description: 'ID da noticia.' })
    @ApiResponse({ status: 200, description: 'Lista de comentarios.' })
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
    list(@Param('noticiaId') noticiaId: string) {
        return this.comentariosService.listByNoticia(noticiaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.LEITOR, Role.AUTOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar comentario' })
    @ApiParam({ name: 'noticiaId', description: 'ID da noticia.' })
    @ApiResponse({ status: 201, description: 'Comentario criado.' })
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
    create(
        @Param('noticiaId') noticiaId: string,
        @Body() dto: CreateComentarioDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.comentariosService.create(noticiaId, user.userId, dto);
    }
}
