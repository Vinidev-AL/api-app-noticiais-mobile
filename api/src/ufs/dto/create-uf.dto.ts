import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUfDto {
    @IsString()
    @ApiProperty({
        description: 'Nome da UF.',
        example: 'Sao Paulo',
    })
    nome: string;

    @IsString()
    @Length(2, 2)
    @ApiProperty({
        description: 'Sigla da UF (2 letras).',
        example: 'SP',
    })
    sigla: string;
}
