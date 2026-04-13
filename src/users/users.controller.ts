import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { Role } from '../common/roles.enum';
import { RolesGuard } from '../common/roles.guard';
import { CurrentUser, CurrentUserPayload } from '../common/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(Role.SUPERADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findById(
        @Param('id') id: string,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        if (user.role !== Role.SUPERADMIN && user.userId !== id) {
            throw new ForbiddenException('Acesso negado.');
        }
        return this.usersService.findById(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateUserDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        if (user.role !== Role.SUPERADMIN && user.userId !== id) {
            throw new ForbiddenException('Acesso negado.');
        }
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.SUPERADMIN)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
