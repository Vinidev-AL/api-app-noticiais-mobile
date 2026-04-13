import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTagDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Descricao da tag.',
        example: 'politica',
    })
    descricao?: string;
}
