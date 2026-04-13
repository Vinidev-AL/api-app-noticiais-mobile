import { Body, Controller, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
export class ComentariosAdminController {
    constructor(private readonly comentariosService: ComentariosService) { }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateComentarioDto) {
        return this.comentariosService.update(id, dto.texto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.comentariosService.remove(id);
    }
}
