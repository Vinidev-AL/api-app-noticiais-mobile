import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../common/roles.enum';

export class UpdatePerfilDto {
    @IsOptional()
    @IsEnum(Role)
    @ApiPropertyOptional({
        description: 'Descricao do perfil.',
        example: 'AUTOR',
    })
    descricao?: Role;
}
