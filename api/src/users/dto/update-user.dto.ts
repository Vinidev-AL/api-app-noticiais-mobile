import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Nome atualizado do usuario.',
        example: 'Usuario Atualizado',
    })
    nome?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @ApiPropertyOptional({
        description: 'Nova senha do usuario (minimo 6 caracteres).',
        example: 'novaSenha123',
    })
    password?: string;
}
