import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../../common/roles.enum';

export class CreatePerfilDto {
    @IsEnum(Role)
    @ApiProperty({
        description: 'Descricao do perfil.',
        example: 'LEITOR',
    })
    descricao: Role;
}
