import { IsEnum } from 'class-validator';
import { Role } from '../../common/roles.enum';

export class CreatePerfilDto {
    @IsEnum(Role)
    descricao: Role;
}
