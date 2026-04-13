import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCidadeDto {
    @IsString()
    @ApiProperty({
        description: 'Nome da cidade.',
        example: 'Campinas',
    })
    nome: string;

    @IsString()
    @ApiProperty({
        description: 'ID da UF associada.',
        example: '7b2f0e8f-2c1a-4a5b-9f51-1b7f1e2a3c4d',
    })
    ufId: string;
}
