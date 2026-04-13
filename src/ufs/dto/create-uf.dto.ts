import { IsString, Length } from 'class-validator';

export class CreateUfDto {
    @IsString()
    nome: string;

    @IsString()
    @Length(2, 2)
    sigla: string;
}
