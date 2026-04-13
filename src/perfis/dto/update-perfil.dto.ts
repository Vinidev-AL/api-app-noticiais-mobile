import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../common/roles.enum';

export class UpdatePerfilDto {
    @IsOptional()
    @IsEnum(Role)
    descricao?: Role;
}
