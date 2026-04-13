import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCidadeDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Nome da cidade.',
        example: 'Santos',
    })
    nome?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'ID da UF associada.',
        example: '7b2f0e8f-2c1a-4a5b-9f51-1b7f1e2a3c4d',
    })
    ufId?: string;
}
