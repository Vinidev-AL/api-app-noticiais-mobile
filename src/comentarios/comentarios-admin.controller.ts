import { Body, Controller, Delete, Param, Put, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
@ApiTags('Comentarios')
@ApiBearerAuth()
export class ComentariosAdminController {
    constructor(private readonly comentariosService: ComentariosService) { }

    @Put(':id')
    @ApiOperation({ summary: 'Editar comentario (admin)' })
    @ApiParam({ name: 'id', description: 'ID do comentario.' })
    @ApiResponse({ status: 200, description: 'Comentario atualizado.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Comentario nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Comentario nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    update(@Param('id') id: string, @Body() dto: UpdateComentarioDto) {
        return this.comentariosService.update(id, dto.texto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir comentario (admin)' })
    @ApiParam({ name: 'id', description: 'ID do comentario.' })
    @ApiResponse({ status: 200, description: 'Comentario excluido.' })
    @ApiResponse({ status: 401, description: 'Nao autenticado.' })
    @ApiResponse({ status: 403, description: 'Acesso negado.' })
    @ApiResponse({
        status: 404,
        description: 'Comentario nao encontrado.',
        schema: {
            example: {
                statusCode: 404,
                message: 'Comentario nao encontrado.',
                error: 'Not Found',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.comentariosService.remove(id);
    }
}
