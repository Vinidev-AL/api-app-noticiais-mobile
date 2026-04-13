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
import { CidadesService } from './cidades.service';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('cidades')
export class CidadesController {
    constructor(private readonly cidadesService: CidadesService) { }

    @Get()
    findAll() {
        return this.cidadesService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.cidadesService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUPERADMIN)
    create(@Body() dto: CreateCidadeDto) {
        return this.cidadesService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.SUPERADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateCidadeDto) {
        return this.cidadesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.cidadesService.remove(id);
    }
}
