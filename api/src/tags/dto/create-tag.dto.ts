import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
    @IsString()
    @ApiProperty({
        description: 'Descricao da tag.',
        example: 'economia',
    })
    descricao: string;
}
