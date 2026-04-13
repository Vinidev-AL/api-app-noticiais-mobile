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
export class PerfisController {
    constructor(private readonly perfisService: PerfisService) { }

    @Get()
    findAll() {
        return this.perfisService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.perfisService.findById(id);
    }

    @Post()
    create(@Body() dto: CreatePerfilDto) {
        return this.perfisService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePerfilDto) {
        return this.perfisService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.perfisService.remove(id);
    }
}
