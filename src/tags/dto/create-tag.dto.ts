import { IsString } from 'class-validator';

export class CreateTagDto {
    @IsString()
    descricao: string;
}
