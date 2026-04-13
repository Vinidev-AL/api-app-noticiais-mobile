import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CurrentUser, CurrentUserPayload } from '../common/current-user.decorator';

@Controller('noticias/:noticiaId/comentarios')
export class ComentariosController {
    constructor(private readonly comentariosService: ComentariosService) { }

    @Get()
    list(@Param('noticiaId') noticiaId: string) {
        return this.comentariosService.listByNoticia(noticiaId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.LEITOR, Role.AUTOR)
    create(
        @Param('noticiaId') noticiaId: string,
        @Body() dto: CreateComentarioDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.comentariosService.create(noticiaId, user.userId, dto);
    }
}
