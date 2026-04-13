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
import { UfsService } from './ufs.service';
import { CreateUfDto } from './dto/create-uf.dto';
import { UpdateUfDto } from './dto/update-uf.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';

@Controller('ufs')
export class UfsController {
    constructor(private readonly ufsService: UfsService) { }

    @Get()
    findAll() {
        return this.ufsService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.ufsService.findById(id);
    }

    @Get(':ufId/cidades')
    listCidades(@Param('ufId') ufId: string) {
        return this.ufsService.listCidades(ufId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @Roles(Role.SUPERADMIN)
    create(@Body() dto: CreateUfDto) {
        return this.ufsService.create(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    @Roles(Role.SUPERADMIN)
    update(@Param('id') id: string, @Body() dto: UpdateUfDto) {
        return this.ufsService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.ufsService.remove(id);
    }
}
