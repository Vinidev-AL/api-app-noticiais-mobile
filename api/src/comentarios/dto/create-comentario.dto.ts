import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateComentarioDto {
    @IsString()
    @ApiProperty({
        description: 'Texto do comentario.',
        example: 'Muito boa a materia, parabens!'
    })
    texto: string;
}
