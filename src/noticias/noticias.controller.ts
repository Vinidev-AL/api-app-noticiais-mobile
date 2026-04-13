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
export class NoticiasController {
    constructor(private readonly noticiasService: NoticiasService) { }

    @Get()
    listPublished() {
        return this.noticiasService.listPublished();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('minhas')
    @Roles(Role.AUTOR)
    listMine(@CurrentUser() user: CurrentUserPayload) {
        return this.noticiasService.listMine(user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('todas')
    @Roles(Role.EDITOR, Role.SUPERADMIN)
    listAll() {
        return this.noticiasService.listAll();
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    getById(@Param('id') id: string, @CurrentUser() user?: CurrentUserPayload) {
        return this.noticiasService.getById(id, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.AUTOR, Role.SUPERADMIN)
    create(
        @Body() dto: CreateNoticiaDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.noticiasService.create(dto, user.userId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.AUTOR, Role.EDITOR, Role.SUPERADMIN)
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
    publish(@Param('id') id: string) {
        return this.noticiasService.publish(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id/despublicar')
    @Roles(Role.EDITOR, Role.SUPERADMIN)
    unpublish(@Param('id') id: string) {
        return this.noticiasService.unpublish(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.noticiasService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post(':noticiaId/tags/:tagId')
    @Roles(Role.AUTOR, Role.EDITOR, Role.SUPERADMIN)
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
    unlinkTag(
        @Param('noticiaId') noticiaId: string,
        @Param('tagId') tagId: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.noticiasService.unlinkTag(noticiaId, tagId, user);
    }
}
