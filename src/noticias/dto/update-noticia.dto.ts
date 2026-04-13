import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNoticiaDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Titulo da noticia.',
        example: 'Titulo atualizado da noticia',
    })
    titulo?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'URL da imagem da noticia.',
        example: 'https://exemplo.com/imagens/atualizada.jpg',
    })
    imagem?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Resumo curto da noticia.',
        example: 'Resumo atualizado da noticia.',
    })
    resumo?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Texto completo da noticia.',
        example: 'Texto completo atualizado da noticia.',
    })
    texto?: string;
}
