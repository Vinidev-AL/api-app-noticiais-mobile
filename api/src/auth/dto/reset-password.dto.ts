import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @ApiProperty({
        description: 'Username do usuario que vai redefinir a senha.',
        example: 'editor',
    })
    username: string;

    @IsString()
    @ApiProperty({
        description: 'Codigo fixo de recuperacao.',
        example: '123456',
    })
    codigo: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        description: 'Nova senha (minimo 6 caracteres).',
        example: 'novaSenha123',
    })
    novaSenha: string;
}
