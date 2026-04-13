import { IsString, MinLength } from 'class-validator';

export class CadastroDto {
    @IsString()
    nome: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;
}
