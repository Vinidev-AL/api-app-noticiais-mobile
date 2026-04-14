import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateComentarioDto {
    @IsString()
    @ApiProperty({
        description: 'Texto atualizado do comentario.',
        example: 'Comentario atualizado pelo admin.'
    })
    texto: string;
}
