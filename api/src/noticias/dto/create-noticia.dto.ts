import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNoticiaDto {
    @IsString()
    @ApiProperty({
        description: 'Titulo da noticia.',
        example: 'Nova politica de mobilidade urbana',
    })
    titulo: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'URL da imagem da noticia.',
        example: 'https://exemplo.com/imagens/noticia.jpg',
    })
    imagem?: string;

    @IsString()
    @ApiProperty({
        description: 'Resumo curto da noticia.',
        example: 'Resumo com os principais pontos da materia.',
    })
    resumo: string;

    @IsString()
    @ApiProperty({
        description: 'Texto completo da noticia.',
        example: 'Texto completo da noticia com detalhes e contexto.',
    })
    texto: string;
}
