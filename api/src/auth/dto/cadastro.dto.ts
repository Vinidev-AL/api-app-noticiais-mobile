import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CadastroDto {
    @IsString()
    @ApiProperty({
        description: 'Nome completo do usuario.',
        example: 'Usuario Um',
    })
    nome: string;

    @IsString()
    @ApiProperty({
        description: 'Username unico para login.',
        example: 'usuario1',
    })
    username: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        description: 'Senha do usuario (minimo 6 caracteres).',
        example: '123456',
    })
    password: string;
}
