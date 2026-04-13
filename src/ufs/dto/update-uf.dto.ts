import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUfDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Nome da UF.',
        example: 'Rio de Janeiro',
    })
    nome?: string;

    @IsOptional()
    @IsString()
    @Length(2, 2)
    @ApiPropertyOptional({
        description: 'Sigla da UF (2 letras).',
        example: 'RJ',
    })
    sigla?: string;
}
